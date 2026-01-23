package com.attenza.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync 
public class AttenzaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AttenzaBackendApplication.class, args);
	}

}
