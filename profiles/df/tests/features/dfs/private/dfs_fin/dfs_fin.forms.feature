@dfs_fin
Feature: DFS FIN: Forms
  In order to prove that dfs_fin was enabled correctly
  As a developer
  I need to check form workflows on the site 

  @api
  Scenario: Form: Get a Quote (anonymous)
    Given I am an anonymous user
    When I visit "/contact/get-quote"
    Then I should see the heading "Get a Quote"
    And I should see "Quote Type" in the "primary_features" region
    And I should see "I am interested in..."
    And I select "Auto Insurance" from "edit-product"
    And I select "Home Insurance" from "edit-product"
    And I select "Life Insurance" from "edit-product"
    And I select "Disability Insurance" from "edit-product"
    And I should see "Do you currently have this insurance?"
    And I select "1" from "edit-has-insurance-0"
    And I select "0" from "edit-has-insurance-0"
    And I should not see "Personal Information" in the "primary_features" region
    
  @api
  Scenario: Form: Get a Quote (authenticated)
    Given I am logged in as a user with the "administrator" role
    When I visit "/contact/get-quote"
    Then I should see the heading "Get a Quote"
    And I select "Home Insurance" from "edit-product"
    And I select "0" from "edit-has-insurance-0"
    And I should see "Personal Information" in the "primary_features" region
    And I should see "First Name" in the "primary_features" region
    And I fill in "edit-firstname" with "Bill"
    And I should see "Last Name" in the "primary_features" region
    And I fill in "edit-lastname" with "Sorenson"
    And I should see "Email" in the "primary_features" region
    And I fill in "edit-email" with "BillSorenson@example.com"
    And I should see "Phone" in the "primary_features" region
    And I fill in "edit-phone" with "555-555-5555"
    And I should see "Street" in the "primary_features" region
    And I fill in "edit-street" with "123 Fake St."
    And I should see "City" in the "primary_features" region
    And I fill in "edit-city" with "Springfield"
    And I should see "Postal Code" in the "primary_features" region
    And I fill in "edit-postal-code" with "61264"
    And I should see "Do you have other policies with Bayside Insurance?"
    And I select "No existing policy" from "edit-existing-policies"
    And I select "Auto Insurance" from "edit-existing-policies"
    And I select "Home Insurance" from "edit-existing-policies"
    And I select "Life Insurance" from "edit-existing-policies"
    And I select "Disability Insurance" from "edit-existing-policies"
    And I should see "Additional Information" in the "primary_features" region
    And I fill in "edit-additional-information--2" with "None"
    And I press "Get My Quote!"
    Then I should see "Thanks for requesting a quote. Confirmation has been sent to BillSorenson@example.com"

  @api
  Scenario: Form: Newsletter signup
    Given I am on the homepage
    Then I should see "Sign up for our newsletter"
    And I should see "We will keep your address safe"
    And I should see "we promise!"
    And I fill in "edit-email" with "JenniferThomson@example.com"
    When I press "Subscribe"
    Then I should see "Thanks for signing up! An email confirmation has been sent to JenniferThomson@example.com" 
