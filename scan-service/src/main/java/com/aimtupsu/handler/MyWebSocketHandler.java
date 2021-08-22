package com.aimtupsu.handler;

import com.aimtupsu.session.SessionStorage;
import java.io.IOException;
import javax.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@Log4j2
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class MyWebSocketHandler extends TextWebSocketHandler {

    /**
     * Хранилище сессий.
     */
    @Nonnull
    private final SessionStorage sessionStorage;

    @Override
    public void afterConnectionEstablished(@Nonnull final WebSocketSession session) {
        final String id = session.getId();
        log.info("New session id={}", id);
        if (!sessionStorage.save(session)) {
            try {
                log.info("Session could not be added to storage. Session is={} will be closed.", id);
                session.close(CloseStatus.SERVICE_OVERLOAD);
                log.info("Session id={} is closed.", id);
            } catch (IOException e) {
                log.error("Session closing is failed", e);
            }
        }
    }

    @Override
    public void afterConnectionClosed(@Nonnull final WebSocketSession session,
                                      @Nonnull final CloseStatus status) {
        log.info("End session id={} with status: {}.", session.getId(), status);
        sessionStorage.remove(session);
    }

    @Override
    protected void handleTextMessage(@Nonnull final WebSocketSession session,
                                     @Nonnull final TextMessage message) throws Exception {
        super.handleTextMessage(session, message);
    }

}
