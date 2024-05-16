package ru.kata.spring.boot_security.demo.configs;

import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;

@Component
public class AdminSettings {
    private final RoleService roleService;
    private final UserService userService;

    public AdminSettings(RoleService roleService, UserService userService) {
        this.roleService = roleService;
        this.userService = userService;
    }

    @PostConstruct
    public void init() {
        Role roleAdmin = new Role("ROLE_ADMIN");
        Role roleUser = new Role("ROLE_USER");

        roleService.addRole(roleAdmin);
        roleService.addRole(roleUser);

        User admin = new User("admin", "admin", 33, "admin", "admin");
        admin.getRoles().add(roleService.getRole("ROLE_ADMIN"));
        admin.getRoles().add(roleService.getRole("ROLE_USER"));
        userService.addUser(admin);

        User user = new User("user", "user", 55, "user", "user");
        user.getRoles().add(roleService.getRole("ROLE_USER"));
        userService.addUser(user);
    }
}