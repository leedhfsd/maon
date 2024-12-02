package com.easter.route.global.config;

import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.handler.WebSocketHandlerDecoratorFactory;
import org.springframework.web.socket.server.HandshakeInterceptor;

import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 서버에서 클라이언트가 전송하는 메시지 받을 때
        config.setApplicationDestinationPrefixes("/pub");
        // 구독하고 있는 클라이언트한테 메시지 전달함 (@SendTo("/sub")
        config.enableSimpleBroker("/sub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/maon/route/ws/location")
                .setAllowedOriginPatterns("*")
                .addInterceptors(new HandshakeInterceptor() {
                    @Override
                    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
                        log.debug("WebSocket Handshake 시작 - URI: {}, Headers: {}",
                                request.getURI(), request.getHeaders());
                        return true;
                    }

                    @Override
                    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                               WebSocketHandler wsHandler, Exception exception) {
                        if (exception != null) {
                            log.error("Handshake 실패:", exception);
                        } else {
                            log.debug("Handshake 성공");
                        }
                    }
                });
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration
                .setMessageSizeLimit(2048 * 2048)     // 메시지 크기 제한
                .setSendBufferSizeLimit(2048 * 2048)  // 버퍼 크기
                .setSendTimeLimit(20 * 1000)         // 전송 타임아웃
                .setTimeToFirstMessage(30 * 1000)   // 첫 메시지 대기 시간
                .addDecoratorFactory(new WebSocketHandlerDecoratorFactory() {
                    @Override
                    public WebSocketHandler decorate(WebSocketHandler webSocketHandler) {
                        return new CustomWebSocketHandlerDecorator(webSocketHandler);
                    }
                });
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
                log.info("Inbound Channel - Command: {}, SessionId: {}",
                        accessor.getCommand(), accessor.getSessionId());
                if (accessor.getCommand() == StompCommand.CONNECT) {
                    log.info("STOMP CONNECT - Headers: {}", accessor.toNativeHeaderMap());
                } else if (accessor.getCommand() == StompCommand.DISCONNECT) {
                    log.info("STOMP DISCONNECT - SessionId: {}", accessor.getSessionId());
                }

                return message;
            }
        });
    }

    @Override
    public void configureClientOutboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
                log.debug("Outbound Channel - Command: {}, SessionId: {}",
                        accessor.getCommand(), accessor.getSessionId());
                return message;
            }
        });
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/maon/route/ws/**")
                        .allowedOrigins("*") // 모든 출처 허용 (임시 설정)
                        .allowedMethods("GET", "POST")
                        .allowCredentials(true);
            }
        };
    }
}
