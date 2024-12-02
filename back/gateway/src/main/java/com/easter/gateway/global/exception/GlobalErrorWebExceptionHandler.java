package com.easter.gateway.global.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.boot.autoconfigure.web.reactive.error.AbstractErrorWebExceptionHandler;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.reactive.error.ErrorAttributes;
import org.springframework.cloud.gateway.support.NotFoundException;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerCodecConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
@Order(-2)
@Slf4j
public class GlobalErrorWebExceptionHandler extends AbstractErrorWebExceptionHandler {

    @Autowired
    private ObjectMapper objectMapper;

    public GlobalErrorWebExceptionHandler(ErrorAttributes errorAttributes, WebProperties.Resources resources, ApplicationContext applicationContext, ServerCodecConfigurer configurer) {
        super(errorAttributes, resources, applicationContext);
        this.setMessageWriters(configurer.getWriters());
    }

    @Override
    protected RouterFunction<ServerResponse> getRoutingFunction(ErrorAttributes errorAttributes) {
        log.info("global web exception handler -> router function entered");
        return RouterFunctions.route(RequestPredicates.all(), this::renderErrorResponse);
    }

    private Mono<ServerResponse> renderErrorResponse(ServerRequest request) {
        Exception ex = (Exception) getError(request);
        if(ex instanceof BusinessException be) {
            ErrorResponse errorResponse = ErrorResponse.of(be.getStatus(), be.getMessage());
            return ServerResponse.status(errorResponse.getStatus()).contentType(MediaType.APPLICATION_JSON).body(BodyInserters.fromValue(errorResponse));
        } else if(ex instanceof NotFoundException ne) {
            ErrorResponse errorResponse = ErrorResponse.of(HttpStatus.NOT_FOUND, "게이트웨이에서 서비스를 찾지 못했습니다.");
            return ServerResponse.status(errorResponse.getStatus()).contentType(MediaType.APPLICATION_JSON).body(BodyInserters.fromValue(errorResponse));
        } else { // 기타 일반 에러
            ex.printStackTrace(); // 디버깅용
            ErrorResponse errorResponse = ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, "서버에서 에러가 발생했습니다.");
            return ServerResponse.status(errorResponse.getStatus()).contentType(MediaType.APPLICATION_JSON).body(BodyInserters.fromValue(errorResponse));
        }
//        log.info(ex.getMessage());
//        Map<String, Object> errorPropertiesMap = getErrorAttributes(request, ErrorAttributeOptions.defaults());
//        for(String key : errorPropertiesMap.keySet()) {
//            log.info("{} -- {}", key, errorPropertiesMap.get(key));
//        }
//        return null;
    }
}
