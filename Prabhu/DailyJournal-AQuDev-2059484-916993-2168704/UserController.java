package com.dailyjournal.web.controller;

import com.dailyjournal.web.model.User;
import com.dailyjournal.web.entity.UserEntity;
import com.dailyjournal.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserEntity registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping("/login")
    public String loginUser(@RequestBody User user) {
        return userService.loginUser(user);
    }

}