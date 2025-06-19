package com.vibecoding.inventory.cucumber.steps;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.junit.jupiter.api.Assertions;

public class ItemApiSteps {

    private RequestSpecification request;
    private Response response;
    private final String BASE_URL = "http://localhost:8080/api";

    @Given("the inventory API is available")
    public void inventoryApiIsAvailable() {
        RestAssured.baseURI = BASE_URL;
        request = RestAssured.given();
    }

    @When("I request all inventory items")
    public void requestAllItems() {
        response = request.get("/items");
    }

    @Then("the API returns status code {int}")
    public void verifyStatusCode(int statusCode) {
        Assertions.assertEquals(statusCode, response.getStatusCode());
    }

    @Then("the response contains items")
    public void responseContainsItems() {
        Assertions.assertNotNull(response.getBody());
        String responseBody = response.getBody().asString();
        Assertions.assertTrue(responseBody.contains("id"));
    }
}
