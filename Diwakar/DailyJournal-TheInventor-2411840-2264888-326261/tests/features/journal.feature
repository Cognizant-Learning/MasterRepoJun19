Feature: Journal Entry and Mood Tracking
  As a user
  I want to create journal entries and select my mood
  So that I can track my mood over time

  Scenario: Add a new journal entry with a mood
    Given I am on the Journal page
    When I enter "Today was a great day!" in the journal entry field
    And I select the mood "happy"
    And I click the "Add Entry" button
    Then I should see the entry "Today was a great day!" in the list
    And I should see the mood emoji "😊" for the entry

  Scenario: Edit a journal entry's mood
    Given I have added a journal entry "Feeling tired" with mood "neutral"
    When I click the "Edit" button for the entry "Feeling tired"
    And I select the mood "sad"
    And I click the "Save" button
    Then I should see the mood emoji "😢" for the entry "Feeling tired"

  Scenario: Delete a journal entry
    Given I have added a journal entry "Temporary entry" with mood "anxious"
    When I click the "Delete" button for the entry "Temporary entry"
    Then I should not see the entry "Temporary entry" in the list

  Scenario: See overall mood update
    Given I have added journal entries with moods "happy", "sad", and "happy"
    Then the overall mood should be "😊" (happy)

  Scenario: Journal layout scrolls only when needed
    Given I have added more than 10 journal entries with mood "happy"
    Then the journal entries list should be scrollable

  Scenario: Header and app layout are the same width
    Given I am on the Journal page
    Then the header and main content should have the same width
