@df
Feature: Demo Framework
  In order to prove that general features for a given scenario function properly
  As a developer
  I need to perform various basic tests

  Scenario: Homepage (anon)
    Given I am on the homepage
    Then the response status code should be 200

  @api
  Scenario: Homepage (admin)
    Given I am logged in as a user with the "administrator" role
    And I am on the homepage
    Then the response status code should be 200

  Scenario: Confirm anonymous user
    Given I am on "/user"
    Then I should see the heading "User account"
    And I should see "Username"
    And I should see "Password"

  @api
  Scenario: Confirm authenticated user
    Given I am logged in as a user with the "administrator" role
    And I am on "/user"
    Then I should not see the heading "User account"
    And I should not see "Username"
    And I should not see "Password"

  @api
  Scenario: Ensure that database logging is available
    Given I am logged in as a user with the "administrator" role
    And I am on "/admin/reports/dblog"
    Then I should see "Recent log messages"
