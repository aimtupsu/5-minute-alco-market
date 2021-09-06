package com.aimtupsu.scanner;

import com.aimtupsu.model.ScannedData;
import javax.annotation.Nonnull;

/**
 * Интерфейс сканера ШК.
 */
public interface Scanner {

    /**
     * Данный метод вызывается, когда появились данные сканированного ШК.
     * <p>
     * Пока нет поддержки JPOS, поэтому передаваемый параметр имеет кастомный тип.
     *
     * @param data сканированные данные.
     */
    void dataOccurred(@Nonnull ScannedData data);

}
