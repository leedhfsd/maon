package com.easter.route.global.utils;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@RequiredArgsConstructor
public class GoogleGeoCoding {

    @Value("${google.api.key}")
    private String API_KEY;

    private final RestTemplate restTemplate;

    public String getAddress(double latitude, double longitude) {
        String address = "";
        try {
            String url = String.format(
                "https://maps.googleapis.com/maps/api/geocode/json?latlng=%f,%f&language=ko&key=%s",
                latitude, longitude, API_KEY
            );
            log.info("Requesting address to Google API: {}", url);

            // POST 요청을 위한 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // POST 요청을 위한 HttpEntity 생성 (비어있는 body 사용)
            HttpEntity<String> requestEntity = new HttpEntity<>("", headers);

            // POST 요청 보내기
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.getBody().get("results");

                if (results != null && !results.isEmpty()) {
                    address = getFormattedAddress(results);
                } else {
                    address = "주소를 찾을 수 없습니다.";
                }
            } else {
                address = "API 요청 실패: 응답 코드 " + response.getStatusCode();
            }
        } catch (Exception e) {
            log.error("Failed to get address: {}", e.getMessage());
            address = "오류 발생: " + e.getMessage();
        }
        return address;
    }

    private String getFormattedAddress(List<Map<String, Object>> results) {
        String city = null;
        String district = null;

        for (Map<String, Object> result : results) {
            List<Map<String, Object>> addressComponents = (List<Map<String, Object>>) result.get("address_components");

            if (addressComponents != null) {
                for (Map<String, Object> component : addressComponents) {
                    List<String> types = (List<String>) component.get("types");

                    if (types != null) {
                        if (types.contains("administrative_area_level_1")) {
                            city = (String) component.get("long_name");
                        } else if (types.contains("sublocality_level_1")) {
                            district = (String) component.get("long_name");
                        }
                    }
                }
            }

            if (city != null && district != null) {
                break;
            }
        }

        return (city != null && district != null) ? city + " " + district : "지역 정보가 없습니다.";
    }
}
