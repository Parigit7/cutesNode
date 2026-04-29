package com.cuteslk.backend.config;

import com.cuteslk.backend.model.User;
import com.cuteslk.backend.service.UserService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserService userService;

    public DataInitializer(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userService.findByUsername("admin").isEmpty()) {
            User admin = new User("admin", "admin123", "ADMIN", true);
            userService.save(admin);
        }
    }
}
