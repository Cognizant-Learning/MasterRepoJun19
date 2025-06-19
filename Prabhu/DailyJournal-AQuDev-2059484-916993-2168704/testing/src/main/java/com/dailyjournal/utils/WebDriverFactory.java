package com.dailyjournal.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxOptions;

/**
 * Simple factory class for WebDriver management using WebDriverManager
 * Supports only Chrome and Firefox browsers
 */
public class WebDriverFactory {
    
    private static final ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();
    private static final Logger LOGGER = LoggerFactory.getLogger(WebDriverFactory.class);
    
    /**
     * Initializes WebDriver for Chrome or Firefox browser
     * 
     * @param browser The browser name ("chrome" or "firefox")
     * @param headless Whether to run in headless mode
     * @return The WebDriver instance
     */
    public static WebDriver initDriver(String browser, boolean headless) {
        WebDriver driver;
        
        try {
            LOGGER.info("Setting up {} driver, headless: {}", browser, headless);
            
            if ("chrome".equalsIgnoreCase(browser)) {
                // Setup Chrome with WebDriverManager
                WebDriverManager.chromedriver().browserVersion("137").setup();
                
                ChromeOptions options = new ChromeOptions();
                if (headless) {
                    options.addArguments("--headless=new");
                }
                options.addArguments("--remote-allow-origins=*");
                
                driver = new ChromeDriver(options);
            } 
            else if ("firefox".equalsIgnoreCase(browser)) {
                // Setup Firefox with WebDriverManager
                WebDriverManager.firefoxdriver().setup();
                
                FirefoxOptions options = new FirefoxOptions();
                if (headless) {
                    options.addArguments("--headless");
                }
                
                driver = new FirefoxDriver(options);
            } 
            else {
                LOGGER.error("Unsupported browser: {}", browser);
                throw new IllegalArgumentException("Only Chrome and Firefox are supported. Received: " + browser);
            }
            
            // Configure common settings
            driver.manage().window().maximize();
            int timeout = Integer.parseInt(ConfigReader.getProperty("implicit.wait", "10"));
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(timeout));
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
            
            LOGGER.info("Successfully initialized {} driver", browser);
            return driver;
            
        } catch (Exception e) {
            LOGGER.error("Failed to initialize {} driver: {}", browser, e.getMessage());
            throw new RuntimeException("Failed to initialize driver: " + e.getMessage(), e);
        }
    }
    
    /**
     * Sets up a WebDriver instance and stores it in ThreadLocal
     * 
     * @param browser The browser name ("chrome" or "firefox")
     * @param headless Whether to run in headless mode
     */
    public static void setupDriver(String browser, boolean headless) {
        WebDriver driver = initDriver(browser, headless);
        driverThreadLocal.set(driver);
    }
    
    /**
     * Gets the driver instance for the current thread
     * 
     * @return The WebDriver instance
     */
    public static WebDriver getThreadLocalDriver() {
        return driverThreadLocal.get();
    }
    
    /**
     * Quits the driver and removes it from the thread local
     */
    public static void quitDriver() {
        if (driverThreadLocal.get() != null) {
            try {
                driverThreadLocal.get().quit();
                LOGGER.info("WebDriver session closed successfully");
            } catch (Exception e) {
                LOGGER.warn("Exception while quitting driver: {}", e.getMessage());
            } finally {
                driverThreadLocal.remove();
            }
        }
    }
}