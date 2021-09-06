package com.aimtupsu.model;

import javax.annotation.Nonnull;
import lombok.Value;

/**
 * Данные сканированного датаматрикса.
 *
 * Передаются сервером клиенту.
 */
@Value
public class DatamatrixBarcode {

    /**
     * Значение датаматрикса.
     */
    @Nonnull
    String value;

}
