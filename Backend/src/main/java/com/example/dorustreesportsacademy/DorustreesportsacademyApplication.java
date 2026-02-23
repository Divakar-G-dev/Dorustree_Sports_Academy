package com.example.dorustreesportsacademy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication  // ✅ This ALREADY includes @ComponentScan
public class DorustreesportsacademyApplication {

	public static void main(String[] args) {
		SpringApplication.run(DorustreesportsacademyApplication.class, args);
	}
}
