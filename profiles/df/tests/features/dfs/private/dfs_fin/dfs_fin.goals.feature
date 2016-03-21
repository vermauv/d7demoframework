@dfs_fin @goals
Feature: DFS FIN: Goals
  As a developer,
  I need to ensure that the Goals page is correctly set up
  So that the FIN demo will work correctly.

  @api
  Scenario: Check Goal content type is present
    Given I am logged in as a user with the "administrator" role
    When I visit "/admin/structure/types"
    Then I should see "Goal"

  @api
  Scenario: Make sure I can make a Goal in FIN
    Given "goal" content:
    | title           | body                  |
    | Get to Heaven   | Be a good boy or girl.|
    And I am logged in as a user with the "administrator" role
    When I visit "/admin/content"
    Then I should see "Get to Heaven"
    When I follow "Get to Heaven"
    Then I should see the heading "Get to Heaven" in the "main_content" region
    And I should see "Be a good boy or girl." in the "main_content" region

  @api
  Scenario: Ensure defined fields and field groups exist
    Given I am logged in as a user with the "administrator" role
    When I go to "/admin/structure/types/manage/goal/fields"
    Then I should see "title"
    And I should see "locations"
    And I should see "path"
    And I should see "body"
    And I should see "metatags"
    And I should see "field_image"
    And I should see "field_related_articles"
    And I should see "field_related_products"

  @api
  Scenario: Check on imported Goals and related Articles
    Given I am an anonymous user
    When I visit "/goals"
    Then I should see "Protect Who Matters Most" in the "primary_features" region
    And I should see "Do you have the proper coverage in place to protect those who matter the most for you?" in the "primary_features" region
    And I should see "Coverage for All" in the "primary_features" region
    And I should see "Protection From the Unexpected" in the "primary_features" region
    And I should see "Do you have the proper coverage in place to protect from the unknown?" in the "primary_features" region
    And I should see "Life is a Highway" in the "primary_features" region
    And I should see "Managing Risk" in the "primary_features" region
    And I should see "Protect Your Assets" in the "primary_features" region
    And I should see "Do you have the proper coverage in place to protect your assets in a time of crisis?" in the "primary_features" region
    And I should see "Cover your Assets" in the "primary_features" region
    And I should see "Working with a Financial Professional" in the "primary_features" region
    And I should see "Why Go Alone?" in the "primary_features" region
