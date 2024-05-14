package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
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
    public String getUsers(Model model) {
        model.addAttribute("table_name", "Users");
        model.addAttribute("users", userService.getAllUsers());
        return "adminPages/admin";
    }

    @GetMapping(value = "/addUser")
    public String addUser(@ModelAttribute("user") User user, Model model) {
        model.addAttribute("roles", roleService.getAllRoles());
        return "adminPages/addUser";
    }

    @PostMapping()
    public String create(@ModelAttribute("user") User user) {
        userService.addUser(user);
        return "redirect:/admin";
    }

    @GetMapping(value = "/{id}/edit")
    public String editUser(Model model, @PathVariable("id") int id) {
        model.addAttribute("roles", roleService.getAllRoles());
        model.addAttribute("user", userService.findUser(id));
        return "adminPages/editUser";
    }

    @PatchMapping()
    public String update(@ModelAttribute("user") User user) {
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @GetMapping(value = "/{id}/delete")
    public String deleteUser(Model model, @PathVariable("id") int id) {
        model.addAttribute("delete_text", "Are you sure you want to delete the user?");
        model.addAttribute("user", userService.findUser(id));
        return "adminPages/deleteUser";
    }

    @DeleteMapping()
    public String delete(@ModelAttribute("user") User user, Principal principal) {
        User thisUser = userService.findByUsername(principal.getName());

        userService.deleteUser(user.getId());

        if (thisUser.getUsername().equals(user.getUsername())) {
            return "redirect:/logout";
        } else {
            return "redirect:/admin";
        }
    }
}