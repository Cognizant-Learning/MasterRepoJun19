package com.dailyjournal.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * Page Object Model for Journal Entry related functions
 */
public class JournalEntryPage {
    private static final Logger LOGGER = LoggerFactory.getLogger(JournalEntryPage.class);
    private WebDriver driver;
    private WebDriverWait wait;

    // Locators from frontend code
    private final By journalTextareaLocator = By.cssSelector("textarea[placeholder='How was your day?']");
    private final By moodSelectLocator = By.cssSelector(".mood-select select");
    private final By addEntryButtonLocator = By.cssSelector("button[type='submit']");
    private final By journalItemsLocator = By.cssSelector(".journal-list .journal-item");
    private final By weeklyMoodChartLocator = By.cssSelector(".chart-container");
    private final By journalEntryTextLocator = By.cssSelector(".journal-entry");
    private final By journalDateLocator = By.cssSelector(".journal-date");
    @SuppressWarnings("unused")
    private final By moodIconLocator = By.cssSelector(".mood-select .mood-icon");

    public JournalEntryPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    /**
     * Enters text in the journal entry textarea
     * @param text The journal text to enter
     */
    public void enterJournalText(String text) {
        WebElement textarea = wait.until(ExpectedConditions.visibilityOfElementLocated(journalTextareaLocator));
        textarea.clear();
        textarea.sendKeys(text);
        LOGGER.info("Entered journal text: {}", text);
    }

    /**
     * Selects a mood from the dropdown
     * @param mood The mood to select (happy, sad, neutral, angry, excited)
     */
    public void selectMood(String mood) {
        WebElement select = wait.until(ExpectedConditions.visibilityOfElementLocated(moodSelectLocator));
        new Select(select).selectByValue(mood);
        LOGGER.info("Selected mood: {}", mood);
    }

    /**
     * Clicks on the Add Entry button to submit the journal
     */
    public void clickAddEntry() {
        WebElement button = wait.until(ExpectedConditions.elementToBeClickable(addEntryButtonLocator));
        button.click();
        LOGGER.info("Clicked Add Entry button");
        // Wait for entry to be added
        wait.until(driver -> driver.findElements(journalItemsLocator).size() > 0);
    }

    /**
     * Creates a new journal entry with the specified text and mood
     * @param text The journal text
     * @param mood The mood to select
     */
    public void createJournalEntry(String text, String mood) {
        enterJournalText(text);
        selectMood(mood);
        clickAddEntry();
    }

    /**
     * Gets the latest journal entry's text
     * @return The text of the latest journal entry
     */
    public String getLatestEntryText() {
        List<WebElement> entries = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(journalItemsLocator));
        if (entries.isEmpty()) {
            return null;
        }
        WebElement latestEntry = entries.get(0); // First entry is most recent
        WebElement entryText = latestEntry.findElement(journalEntryTextLocator);
        LOGGER.info("Retrieved latest entry text: {}", entryText.getText());
        return entryText.getText();
    }

    /**
     * Gets the latest journal entry's date
     * @return The date of the latest journal entry
     */
    public String getLatestEntryDate() {
        List<WebElement> entries = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(journalItemsLocator));
        if (entries.isEmpty()) {
            return null;
        }
        WebElement latestEntry = entries.get(0); // First entry is most recent
        WebElement dateText = latestEntry.findElement(journalDateLocator);
        return dateText.getText();
    }

    /**
     * Gets all available mood options
     * @return List of available moods
     */
    public List<String> getAvailableMoods() {
        WebElement select = wait.until(ExpectedConditions.visibilityOfElementLocated(moodSelectLocator));
        Select moodSelect = new Select(select);
        List<String> moods = new ArrayList<>();
        
        for (WebElement option : moodSelect.getOptions()) {
            moods.add(option.getAttribute("value"));
        }
        
        LOGGER.info("Available moods: {}", moods);
        return moods;
    }

    /**
     * Clicks on an entry to view detailed information
     * @param index The index of the entry to click (0 is most recent)
     */
    public void clickOnJournalEntry(int index) {
        List<WebElement> entries = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(journalItemsLocator));
        if (index < entries.size()) {
            entries.get(index).click();
            LOGGER.info("Clicked on journal entry at index: {}", index);
        } else {
            throw new IndexOutOfBoundsException("Entry index out of bounds");
        }
    }

    /**
     * Verifies if the weekly mood chart is displayed
     * @return true if the chart is displayed
     */
    public boolean isWeeklyMoodChartDisplayed() {
        try {
            WebElement chart = wait.until(ExpectedConditions.visibilityOfElementLocated(weeklyMoodChartLocator));
            return chart.isDisplayed();
        } catch (Exception e) {
            LOGGER.error("Weekly mood chart not displayed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Gets the number of journal entries displayed
     * @return The count of journal entries
     */
    public int getEntryCount() {
        List<WebElement> entries = driver.findElements(journalItemsLocator);
        return entries.size();
    }
}
