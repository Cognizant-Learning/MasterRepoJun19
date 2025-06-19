package com.dailyjournal.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Utility class to read configuration properties from config.properties file
 */
public class ConfigReader {
    private static final Properties properties = new Properties();
    private static boolean isInitialized = false;
    
    /**
     * Loads the configuration properties from the config.properties file
     */
    public static void loadConfig() {
        if (!isInitialized) {
            try (FileInputStream fis = new FileInputStream("src/main/resources/config.properties")) {
                properties.load(fis);
                isInitialized = true;
            } catch (IOException e) {
                throw new RuntimeException("Failed to load config.properties file: " + e.getMessage());
            }
        }
    }

    /**
     * Gets a property value from the configuration
     * 
     * @param key The property key
     * @return The property value
     */
    public static String getProperty(String key) {
        if (!isInitialized) {
            loadConfig();
        }
        String value = properties.getProperty(key);
        if (value == null) {
            throw new RuntimeException("Property '" + key + "' not found in config.properties");
        }
        return value;
    }
    
    /**
     * Gets a property value with a default if not found
     * 
     * @param key The property key
     * @param defaultValue The default value to return if the key is not found
     * @return The property value or the default value
     */
    public static String getProperty(String key, String defaultValue) {
        if (!isInitialized) {
            loadConfig();
        }
        return properties.getProperty(key, defaultValue);
    }
}