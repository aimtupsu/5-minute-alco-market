package com.aimtupsu.model;

import javax.annotation.Nonnull;
import lombok.Value;

/**
 * Сканированный ШК.
 */
@Value
public class ScannedData {

    /**
     * Значение сканированного ШК.
     */
    @Nonnull
    String value;

}
