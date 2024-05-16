package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;

@Controller
@RequestMapping(value = "/admin")
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;

    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping()
    public String getUsers(Model model, Principal principal, @ModelAttribute("user") User user) {
        User currentUser = userService.findByUsername(principal.getName());

        model.addAttribute("table_name", "Users");
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("roles", roleService.getAllRoles());
        model.addAttribute("current_user", currentUser);

        return "adminPages/admin";
    }

    @PostMapping()
    public String create(@ModelAttribute("user") User user) {
        userService.addUser(user);
        return "redirect:/admin";
    }

    @PatchMapping("/{id}")
    public String update(@ModelAttribute("user") User user, Principal principal, @PathVariable("id") Integer id) {
        int currentId = userService.findByUsername(principal.getName()).getId();

        // если админ обновляет свою собственную учетку, даннные в Authentication (откуда мы тянем principal) также обновятся, и в navbar будет сразу актуальная информация
        if (id == currentId) {
            Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
            RequestContextHolder.currentRequestAttributes().setAttribute("SPRING_SECURITY_CONTEXT", auth, RequestAttributes.SCOPE_SESSION);
        }

        userService.updateUser(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Integer id, Principal principal) {
        int currentId = userService.findByUsername(principal.getName()).getId();

        userService.deleteUser(id);

        // если админ удаляет свою собственную учетку, происходит логаут
        return (id == currentId) ? "redirect:/logout" : "redirect:/admin";
    }

}