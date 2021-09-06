package com.aimtupsu.session;

import java.util.Collections;
import java.util.Set;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

/**
 * Хранилище одной WebSocket сессии.
 * <p>
 * Если сессия уже добавлена в хранилище,
 * то повторное сохранение не будет выполнено.
 * <p>
 * Если сессия ещё не добавлена, то удаление не будет выполнено.
 * <p>
 * В качестве множества сессий возвращается множество с одной сессией.
 * <p>
 * Для синхронизации обновления сессии используется
 * многопоточный паттерн Блокировка с двойной проверкой.
 */
@Log4j2
@Component
public class SingleSessionStorage implements SessionStorage {

    /**
     * Хранимая одиночная WebSocket сессия.
     */
    @Nullable
    private WebSocketSession session = null;

    /**
     * Для синхронизации используется блокировка с двойной проверкой.
     */
    @Override
    public boolean save(@Nonnull final WebSocketSession session) {
        log.info("Saving a session id={} to storage", session.getId());
        if (this.session == null) {
            synchronized (this) {
                if (this.session == null) {
                    this.session = session;
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Для синхронизации используется блокировка с двойной проверкой.
     */
    @Override
    public boolean remove(@Nonnull final WebSocketSession session) {
        log.info("Session id={} is removed from storage", session.getId());
        if (this.session != null) {
            synchronized (this) {
                if (this.session != null) {
                    this.session = null;
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Возвращает множество из одного объекта WebSocket сессии,
     * если сессия есть, иначе пустое множество.
     *
     * Возвращаемое соединение - открыто.
     * Если же в момент вызова метода, хранимое соединение закрыто,
     * то оно удаляется.
     *
     * @return множество из одной открытой WebSocket сессии.
     */
    @Nonnull
    @Override
    public Set<WebSocketSession> getOpenedSessions() {
        if (session != null) {
            if (session.isOpen()) {
                return Collections.singleton(this.session);
            }
            this.remove(session);
        }
        return Collections.emptySet();
    }

}
