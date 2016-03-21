@dfs_fin @location_finder
Feature: DFS FIN: Location Finder
  As a developer,
  I need to ensure that the location content type is correctly set up
  So that the FIN demo Location Finder will work correctly.

  @api
  Scenario: Check Agent Location content type is present
    Given I am logged in as a user with the "administrator" role
    When I visit "/admin/structure/types"
    Then I should see "Agent Location"

  @api
  Scenario: Make sure I can make a Location for FIN
    Given "location" content:
    | title     | body      |
    | Pat Ryan  | Boss Man  |
    And I am logged in as a user with the "administrator" role
    When I visit "/admin/content"
    Then I should see "Pat Ryan"
    When I follow "Pat Ryan"
    Then I should see "Boss Man" in the "main_content" region

  @api
  Scenario: Ensure defined fields exist including FIN specific additions
    Given I am logged in as a user with the "administrator" role
    When I go to "/admin/structure/types/manage/location/fields"
    Then I should see "Title"
    And I should see "Address"
    And I should see "Address Geofield"
    And I should see "Location"
    And I should see "URL path settings"
    And I should see "Body"
    And I should see "Meta tags"
    And I should see "Email Address"
    And I should see "Phone Number"
    And I should see "Has Claims Adjuster"
    And I should see "Persona"
    And I should see "Profile Picture"
    And I should see "Areas of Focus"
    And I should see "Region"

  @javascript
  Scenario: Check to make sure the Location Finder functions correctly
    Given I am an anonymous user
    When I visit "/locations"
    Then I should see "Find an insurance professional near you" in the "main_content" region
    And I should see "Search to find an office near you!" in the "main_content" region
    And I fill in "edit-field-geofield-distance-origin" with "02108"
    And I press "submit" in the "main_content" region
    Then I wait for AJAX to finish
    And I should see "Sara Montgomery" in the "main_content" region
