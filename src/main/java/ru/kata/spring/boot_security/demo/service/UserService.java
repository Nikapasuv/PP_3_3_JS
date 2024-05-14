package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {

    void addUser(User user);

    User findUser(Integer id);

    void updateUser(User user);

    void deleteUser(Integer id);

    User findByUsername(String username);

    List<User> getAllUsers();

}