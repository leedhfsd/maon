package com.easter.tournament.global.security;
import com.easter.tournament.global.exception.BusinessException;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.*;

@Slf4j
public class PassportFilter extends OncePerRequestFilter {

    private final ObjectMapper mapper;
    private final HmacProvider hmacProvider;

    public PassportFilter(HmacProvider hmacProvider) {
        mapper = new ObjectMapper();
        this.hmacProvider = hmacProvider;
        mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.debug("passport filter entered");
        Enumeration<String> headerNames = request.getHeaderNames();
        Field[] passportField = PassportDto.class.getDeclaredFields();
        List<String> fieldList = new ArrayList<>();
        Map<String, String> passportMap = new HashMap<>();
        for(Field f : passportField) {
            fieldList.add(f.getName().toLowerCase());
        }
        String hmacValue = null;
        boolean passportExists = false;
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue;
            if(headerName.equals("passport-hmac")) {
                hmacValue = request.getHeader(headerName);
            }
            if(fieldList.contains(headerName)) {
                passportExists = true;
                headerValue = new String(Base64.getDecoder().decode(request.getHeader(headerName)), "UTF-8");
                passportMap.put(headerName, headerValue);
//                request.setAttribute(headerName, headerValue);
            }
//            else headerValue = request.getHeader(headerName);
//            log.info("headerName: {}, headerValue: {}", headerName, headerValue);
        }
        if(!passportExists) { // passport가 없다면 attribute설정 및 hmac 검사 생략
            log.debug("passport does not exist");
            filterChain.doFilter(request, response);
        } else {
            PassportDto passport = mapper.convertValue(passportMap, PassportDto.class);
            // hmac 무결성 검사
            String passportValue = mapper.writeValueAsString(passport);
            try {
                String convertedHmac = hmacProvider.hmac(passportValue);
                log.debug("convertedHmac : {}, receivedHmac : {}", convertedHmac, hmacValue);
                if(!convertedHmac.equals(hmacValue)) {
                    log.error("hmac inconsistency problem has been occurred");
                    throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "[Passport] hmac값이 일치하지 않습니다.");
                }
            } catch (Exception e) {
                log.error("error occurred while hmac processing");
                e.printStackTrace();
                throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "[Passport] hmac 과정에서 오류가 발생했습니다.");
            }
            request.setAttribute("passport", passport);
            filterChain.doFilter(request, response);
        }
    }
}
