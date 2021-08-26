package com.aimtupsu.sender;

/**
 * Отправитель сообщений.
 *
 * Пока только умеет отправлять обычные строки.
 */
public interface MessageSender {

    /**
     * Отправляет строковое сообщение.
     *
     * @param message строковое сообщение.
     * @return {@code true}, если сообщение было отправлено, иначе - {@code false}.
     */
    boolean sendMessage(String message);

}
