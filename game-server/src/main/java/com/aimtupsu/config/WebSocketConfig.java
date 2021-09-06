package com.aimtupsu.config;

import com.aimtupsu.handler.MyWebSocketHandler;
import javax.annotation.Nonnull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    private MyWebSocketHandler myWebSocketHandler;

    public void registerWebSocketHandlers(@Nonnull final WebSocketHandlerRegistry registry) {
        registry.addHandler(myWebSocketHandler, "/message").setAllowedOrigins("*");
    }

}
