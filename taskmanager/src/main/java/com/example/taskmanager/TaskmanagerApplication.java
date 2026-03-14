package com.example.taskmanager;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class TaskmanagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskmanagerApplication.class, args);
	}

    @Bean
    public CommandLineRunner printHash(PasswordEncoder encoder) {
        return args -> System.out.println("HASH: " + encoder.encode("admin123"));
    }
}
