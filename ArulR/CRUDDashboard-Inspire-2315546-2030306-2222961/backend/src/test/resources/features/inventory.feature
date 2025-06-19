Feature: Inventory Item Management API

  Scenario: Get all inventory items
    Given the inventory API is available
    When I request all inventory items
    Then the API returns status code 200
    And the response contains items

  Scenario: Get inventory stats
    Given the inventory API is available
    When I request inventory stats
    Then the API returns status code 200
    And the response contains stats data
