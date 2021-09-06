package com.aimtupsu.scanner;

import com.aimtupsu.model.ScannedData;
import com.aimtupsu.sender.MessageSender;
import javax.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

/**
 * Виртуальный сканер.
 * <p>
 * Достаточно простая реализация сканера.
 * При появлении данных, передаёт сканированный ШК в отправитель сообщений.
 */
@Log4j2
@Component
@Qualifier("virtual")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class VirtualScanner implements Scanner {

    /**
     * Отправитель сообщений.
     */
    private final MessageSender messageSender;

    /**
     * Логирует и отправляет сканированный ШК черезщ отправитель сообщений.
     *
     * @param data сканированные данные.
     */
    @Override
    public void dataOccurred(@Nonnull final ScannedData data) {
        log.info("Scanned barcode data has occurred: {}", data);
        messageSender.sendMessage(data.getValue());
    }

}
