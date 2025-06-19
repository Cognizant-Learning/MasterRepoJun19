package com.dailyjournal.web.repository;

import com.dailyjournal.web.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByUsernameAndPassword(String username, String password);
}