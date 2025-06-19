package com.dailyjournal.tests;

import com.dailyjournal.utils.WebDriverFactory;
import com.dailyjournal.utils.ConfigReader;
import com.dailyjournal.pages.JournalEntryPage;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.testng.Assert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Arrays;

/**
 * Smoke Test Suite for Daily Journal Application
 * Focus on journal entry and mood tracking features
 */
public class DailyJournalSmokeTests {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(DailyJournalSmokeTests.class);
    private WebDriver driver;
    private JournalEntryPage journalEntryPage;
    
    @BeforeMethod
    public void setUp() {
        try {
            // Initialize configuration
            String browser = ConfigReader.getProperty("browser", "chrome");
            String baseUrl = ConfigReader.getProperty("baseUrl", "http://localhost:3000");
            boolean headless = Boolean.parseBoolean(ConfigReader.getProperty("headless", "false"));
            
            LOGGER.info("Setting up test with browser: {}, headless: {}", browser, headless);
            
            // Initialize WebDriver using simplified WebDriverFactory
            WebDriverFactory.setupDriver(browser, headless);
            driver = WebDriverFactory.getThreadLocalDriver();
            
            // Navigate to application URL
            driver.get(baseUrl);
            LOGGER.info("Navigated to URL: {}", baseUrl);
            
            // Initialize page objects
            journalEntryPage = new JournalEntryPage(driver);
            
        } catch (Exception e) {
            LOGGER.error("Failed to set up test: {}", e.getMessage());
            throw new RuntimeException("Test setup failed", e);
        }
    }
    
    @AfterMethod
    public void tearDown() {
        // Close the WebDriver session
        WebDriverFactory.quitDriver();
    }
    
    @Test(groups = {"smoke"})
    public void testBasicPageLoad() {
        // Basic test to verify page loads correctly
        String browser = ConfigReader.getProperty("browser", "chrome");
        LOGGER.info("Test running with browser: {}", browser);
        LOGGER.info("Current URL: {}", driver.getCurrentUrl());
        
        // Verify test can access the web page
        String pageTitle = driver.getTitle();
        LOGGER.info("Page title: {}", pageTitle);
        
        // Simple assertion to verify browser launched
        Assert.assertNotNull(driver);
    }
    
    // 1. Journal Entry Management Tests
    
    @Test(groups = {"smoke"})
    public void testCreateJournalEntry() {
        // Test creating a new journal entry with specific text and mood
        String journalText = "This is a test journal entry for automation testing";
        String selectedMood = "happy";
        
        // Create journal entry using page object
        journalEntryPage.createJournalEntry(journalText, selectedMood);
        
        // Verify the entry was created and appears in the list
        String actualText = journalEntryPage.getLatestEntryText();
        
        LOGGER.info("Expected text: {}, Actual text: {}", journalText, actualText);
        Assert.assertEquals(actualText, journalText, "Journal entry text doesn't match");
    }
    
    @Test(groups = {"smoke"})
    public void testJournalEntryWithDifferentMoods() {
        // Test creating journal entries with different moods
        String journalText = "Testing entry with different mood";
        String selectedMood = "excited";
        
        // Create journal entry with the excited mood
        journalEntryPage.createJournalEntry(journalText, selectedMood);
        
        // Verify the entry has been created
        String actualText = journalEntryPage.getLatestEntryText();
        Assert.assertEquals(actualText, journalText, "Journal entry with excited mood failed");
        
        // Create another entry with a different mood
        journalText = "Testing entry with sad mood";
        selectedMood = "sad";
        journalEntryPage.createJournalEntry(journalText, selectedMood);
        
        // Verify this entry is now the latest
        actualText = journalEntryPage.getLatestEntryText();
        Assert.assertEquals(actualText, journalText, "Journal entry with sad mood failed");
    }
    
    @Test(groups = {"smoke"})
    public void testViewJournalEntries() {
        // First, create a journal entry to ensure there's something to view
        String journalText = "Entry for viewing test";
        journalEntryPage.createJournalEntry(journalText, "neutral");
        
        // Verify the entry count is at least 1
        int entryCount = journalEntryPage.getEntryCount();
        Assert.assertTrue(entryCount >= 1, "Journal entries not displayed");
        
        // Click on the first entry (latest one)
        journalEntryPage.clickOnJournalEntry(0);
        
        // Note: In this implementation, clicking on entries would show daily mood details        // We can verify this functionality is working by checking if the page updates accordingly
        // This would depend on the actual application behavior
    }
    
    // 2. Mood Tracking Tests
    
    @Test(groups = {"smoke"})
    public void testMoodSelection() {
        // Test for selecting a specific mood during journal entry creation
        String journalText = "Testing mood selection";
        String selectedMood = "angry";
        
        // Create a journal entry with the angry mood
        journalEntryPage.createJournalEntry(journalText, selectedMood);
        
        // Verify the entry was created with the correct text
        // Note: The UI doesn't expose direct way to verify the mood of an existing entry
        // so we're verifying the entry was created successfully as a proxy
        String actualText = journalEntryPage.getLatestEntryText();
        Assert.assertEquals(actualText, journalText, "Journal entry with mood not created correctly");
    }
    
    @Test(groups = {"smoke"})
    public void testMoodOptions() {
        // Verify all expected mood options are available in the dropdown
        List<String> availableMoods = journalEntryPage.getAvailableMoods();
        // Expected moods based on the frontend code
        List<String> expectedMoods = Arrays.asList("happy", "sad", "neutral", "angry", "excited");
          // Verify all expected moods are available
        LOGGER.info("Available moods: {}", availableMoods);
        Assert.assertEquals(availableMoods.size(), expectedMoods.size(), "Incorrect number of mood options");
        Assert.assertTrue(availableMoods.containsAll(expectedMoods), "Not all expected moods are available");
    }
    
    // 3. Data Visualization Tests
    
    @Test(groups = {"smoke"})
    public void testWeeklyMoodChart() {
        // First, create a journal entry to ensure there's data in the chart
        journalEntryPage.createJournalEntry("Entry for chart testing", "happy");
        
        // Verify the weekly mood chart is displayed
        boolean isChartDisplayed = journalEntryPage.isWeeklyMoodChartDisplayed();
        LOGGER.info("Weekly mood chart displayed: {}", isChartDisplayed);
        Assert.assertTrue(isChartDisplayed, "Weekly mood chart is not displayed");
    }
    
    @Test(groups = {"smoke"})
    public void testJournalEntryInteraction() {
        // Test creating multiple entries and then viewing them
        
        // Create first entry
        journalEntryPage.createJournalEntry("First test entry", "happy");
        
        // Create second entry
        journalEntryPage.createJournalEntry("Second test entry", "excited");
        
        // Verify we have at least 2 entries
        int entryCount = journalEntryPage.getEntryCount();
        Assert.assertTrue(entryCount >= 2, "Journal should display at least 2 entries");
        
        // Get the text of the latest entry (should be the second one)
        String latestText = journalEntryPage.getLatestEntryText();
        Assert.assertEquals(latestText, "Second test entry", "Latest entry text does not match");
    }
    
    // 4. Browser Compatibility Test (simplified for smoke testing)
    
    @Test(groups = {"smoke"})
    public void testBasicCompatibility() {
        // This is a simplified compatibility test that just verifies
        // core functionality works in the configured browser
        
        // Create an entry
        String testText = "Basic compatibility test entry";
        journalEntryPage.createJournalEntry(testText, "neutral");
        
        // Verify entry was created
        String actualText = journalEntryPage.getLatestEntryText();
        Assert.assertEquals(actualText, testText, "Entry creation failed in " + 
            ConfigReader.getProperty("browser", "current browser"));
              // Verify chart is displayed
        Assert.assertTrue(journalEntryPage.isWeeklyMoodChartDisplayed(), 
            "Weekly chart not displayed in " + ConfigReader.getProperty("browser", "current browser"));
    }
}
