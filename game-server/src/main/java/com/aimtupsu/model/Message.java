package com.aimtupsu.model;

import javax.annotation.Nonnull;
import lombok.Value;

/**
 * Сообщение.
 * Отправляется сервером клиенту.
 */
@Value
public class Message {

    /**
     * Значение сообщения.
     */
    @Nonnull
    String payload;

}
