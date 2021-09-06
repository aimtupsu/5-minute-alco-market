package com.aimtupsu.session;

import java.util.Set;
import javax.annotation.Nonnull;
import org.springframework.web.socket.WebSocketSession;

/**
 * Интерфейс хранилища сессий с клиентами по WebSocket.
 */
public interface SessionStorage {

    /**
     * Сохраняет передаваемую сессию в хранилище.
     *
     * @param session WebSocket сессия с клиентом.
     * @return {@code true}, если сессию удалось добавить, иначе {@code false}.
     */
    boolean save(@Nonnull WebSocketSession session);

    /**
     * Удаляет передаваемю сессию из хранилища.
     *
     * @param session WebSocket сессия с клиентом.
     * @return {@code true}, если сессия была удалена, иначе {@code false}.
     */
    boolean remove(@Nonnull WebSocketSession session);

    /**
     * Возвращает множество открытых WebSocket сессий с клиентами.
     * <p>
     * Чтобы клиентам не проверять открытость сессии и не хранить
     * закрытые сессии, данный метод гарантирует, что все
     * сессии из возвращаемое множество - открыты.
     *
     * @return множество открытых WebSocket соединений с клиентами.
     */
    @Nonnull
    Set<WebSocketSession> getOpenedSessions();

}
