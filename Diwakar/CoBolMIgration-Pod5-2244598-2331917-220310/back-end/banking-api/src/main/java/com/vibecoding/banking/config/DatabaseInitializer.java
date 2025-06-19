package com.vibecoding.banking.config;

import com.vibecoding.banking.model.Account;
import com.vibecoding.banking.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseInitializer {

    @Bean
    public CommandLineRunner initDatabase(AccountRepository accountRepository) {
        return args -> {
            // Only initialize if no accounts exist
            if (accountRepository.count() == 0) {
                System.out.println("Initializing database with default account...");
                Account defaultAccount = new Account();
                accountRepository.save(defaultAccount);
                System.out.println("Default account created with ID: " + defaultAccount.getId() + 
                                  " and balance: " + defaultAccount.getBalance());
            } else {
                System.out.println("Database already initialized, skipping...");
            }
        };
    }
}
