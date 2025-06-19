package com.dailyjournal.web.service;

import com.dailyjournal.web.entity.UserEntity;
import com.dailyjournal.web.model.User;
import com.dailyjournal.web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public UserEntity registerUser(User user) {
        UserEntity entity = new UserEntity(user.getUsername(), user.getPassword(), user.getName());
        return userRepository.save(entity);
    }

    public String loginUser(User user) {
        return userRepository.findByUsernameAndPassword(user.getUsername(), user.getPassword())
                .isPresent() ? "success" : "failure";
    }
}