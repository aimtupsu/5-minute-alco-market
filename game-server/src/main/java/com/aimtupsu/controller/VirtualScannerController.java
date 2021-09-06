package com.aimtupsu.controller;

import com.aimtupsu.model.ScannedData;
import com.aimtupsu.scanner.Scanner;
import javax.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST-контроллер виртуаального сканера.
 * <p>
 * Эмулирует работу сканеру, используя REST-запросы.
 */
@RestController
@RequestMapping("/test")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class VirtualScannerController {

    /**
     * Виртуальный сканер.
     */
    @Nonnull
    @Qualifier("virtual")
    private final Scanner scanner;

    /**
     * Эмулирует сканирование ШК.
     */
    @PostMapping("/v-scanner")
    public void scan() {
        scanner.dataOccurred(new ScannedData("Default Barcode"));
    }

}
