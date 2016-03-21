@dfs_fin @article
Feature: DFS FIN: Article
  As a developer,
  I need to ensure that the article content type is correctly set up
  So that the FIN demo will work correctly.

  @api
  Scenario: Check Article content type is present
    Given I am logged in as a user with the "administrator" role
    When I visit "/admin/structure/types"
    Then I should see "Article"

  @api
  Scenario: Make sure I can make an Article for FIN
    Given "article" content:
    | title                   | body          | persona   | site_section |
    | My article with fields! | A placeholder | Home      | Content      |
    And I am logged in as a user with the "administrator" role
    When I visit "/admin/content"
    Then I should see "My article with fields!"
    When I follow "My article with fields!"
    Then I should see the heading "My article with fields!" in the "primary_features" region
    And I should see "A placeholder" in the "secondary_features" region

  @api
  Scenario: Ensure defined fields exist including FIN specific additions
    Given I am logged in as a user with the "administrator" role
    When I go to "/admin/structure/types/manage/article/fields"
    Then I should see "Title"
    And I should see "Tags"
    And I should see "Image"
    And I should see "Article Icon"
    And I should see "Persona"
    And I should see "Category"
    And I should see "Site Section"
    And I should see "Headline"
    And I should see "Collection"
    And I should see "Body"
