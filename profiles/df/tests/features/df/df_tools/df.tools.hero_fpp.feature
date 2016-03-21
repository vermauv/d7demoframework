@df
Feature: Hero FPP
  Makes sure that the hero FPP type was created correctly.

  @api
  Scenario: Check for Hero FPP type
    Given I am logged in as a user with the "administrator" role
    When I visit "/admin/structure/fieldable-panels-panes"
    Then I should see "Hero"

  @api
  Scenario: Make sure I can create a Hero FPP
    Given I am logged in as a user with the "administrator" role
    When I visit "/admin/structure/fieldable-panels-panes/hero/add"
    And I fill in "edit-title" with "My Hero!"
    And I press "Save"

  @api
  Scenario: Ensure defined fields exist
    Given I am logged in as a user with the "administrator" role
    When I go to "/admin/structure/fieldable-panels-panes/hero/fields"
    Then I should see "Title"
    And I should see "field_hero_image"
    And I should see "field_hero_headline_1"
    And I should see "field_hero_headline_2"
    And I should see "field_hero_button_link"
