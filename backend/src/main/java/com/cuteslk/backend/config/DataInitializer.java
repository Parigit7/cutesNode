package com.cuteslk.backend.config;

import com.cuteslk.backend.model.Category;
import com.cuteslk.backend.model.User;
import com.cuteslk.backend.service.CategoryService;
import com.cuteslk.backend.service.UserService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserService userService;
    private final CategoryService categoryService;

    public DataInitializer(UserService userService, CategoryService categoryService) {
        this.userService = userService;
        this.categoryService = categoryService;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userService.findByUsername("admin").isEmpty()) {
            User admin = new User("admin", "admin123", "ADMIN", true);
            userService.save(admin);
        }

        seedCategory("Gift Pack", "GF");
        seedCategory("Birthday cards", "BR");
        seedCategory("HAIR ITEMS", "HR");
        seedCategory("MUGS", "MG");
        seedCategory("PURFUME", "PF");
        seedCategory("SOFT TOY", "ST");
        seedCategory("WALLETS", "WL");
        seedCategory("WATER BOTTLE", "WT");
        seedCategory("DRESS", "DR");
        seedCategory("JEWELLER", "JW");
        seedCategory("MAKEUP ITEM", "MK");
        seedCategory("STATIONARY", "SN");
        seedCategory("KEY TAGS", "KE");
    }

    private void seedCategory(String name, String code) {
        if (categoryService.findByName(name).isEmpty() && categoryService.findByCode(code).isEmpty()) {
            categoryService.save(new Category(name, code));
        }
    }
}
