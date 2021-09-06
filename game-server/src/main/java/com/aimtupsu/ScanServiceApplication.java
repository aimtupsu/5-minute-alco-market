package com.aimtupsu;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition
public class ScanServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScanServiceApplication.class, args);
    }

}
