package com.aimtupsu.sender;

import com.aimtupsu.session.SessionStorage;
import java.io.IOException;
import javax.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;

@Log4j2
@Component
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public final class ScheduledMessageSender implements MessageSender {

    /**
     * Хранилище сессии.
     */
    @Nonnull
    private final SessionStorage sessionStorage;

    private int i = 0;

    @Scheduled(fixedDelay = 10000)
    public void produceAndSendMessageTask() {
        log.info("Trying to send a message");
        if (this.sendMessage("Ответ от сервера. №" + i)) {
            i++;
        }
    }

    @Override
    public boolean sendMessage(@Nonnull final String payload) {
        int counter = 0;
        for (var session : sessionStorage.getSessions()) {
            if (session.isOpen()) {
                log.debug("WebSocket session {} is open", session.getId());
                try {
                    session.sendMessage(new TextMessage(payload));
                    log.info("Message sent: {}", payload);
                    counter++;
                } catch (IOException e) {
                    log.error("Message sending is failed", e);
                }
            }
        }
        if (counter == 0) {
            log.info("Message not sent: {}", payload);
            return false;
        } else {
            return true;
        }
    }

}
