package com.pqc.fido2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PostQuantumFido2Application {

    public static void main(String[] args) {
        SpringApplication.run(PostQuantumFido2Application.class, args);
    }
}
