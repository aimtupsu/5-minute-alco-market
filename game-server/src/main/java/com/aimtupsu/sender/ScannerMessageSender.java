package com.aimtupsu.sender;

import com.aimtupsu.model.DatamatrixBarcode;
import com.aimtupsu.session.SessionStorage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import javax.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Log4j2
@Component
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public final class ScannerMessageSender implements MessageSender {

    /**
     * Хранилище сессии.
     */
    @Nonnull
    private final SessionStorage sessionStorage;
    @Nonnull
    private final ObjectMapper objectMapper;

    @Override
    public boolean sendMessage(@Nonnull final String payload) {
        log.info("Start sending scanned datamatrix value: \"{}\".", payload);
        boolean sent = false;
        final DatamatrixBarcode dmBarcode = new DatamatrixBarcode(payload);
        final String dmBarcodeStr;
        try {
            dmBarcodeStr = objectMapper.writeValueAsString(dmBarcode);
        } catch (JsonProcessingException e) {
            log.error("Parsing of datamatrix barcode obj is failed.", e);
            return sent;
        }
        for (WebSocketSession session : sessionStorage.getOpenedSessions()) {
            log.info(
                    "Sending parsed datamatrix barcode \"{}\" to WebSocket session {}",
                    dmBarcodeStr, session.getId()
            );
            try {
                session.sendMessage(new TextMessage(dmBarcodeStr));
                log.info("Parsed datamatrix barcode \"{}\" sent to WebSocket session ", dmBarcodeStr);
                if (!sent) {
                    sent = true;
                }
            } catch (IOException e) {
                log.error("Sending of parsed datamatrix barcode \"{}\" is failed.", dmBarcodeStr, e);
                return sent;
            }
        }
        log.info("End sending scanned datamatrix value: \"{}\".", payload);
        if (!sent) {
            log.warn("Parsed datamatrix barcode \"{}\" not sent", dmBarcodeStr);
        }
        return sent;
    }

}
