@dfs_wem
Feature: WEM Demo Anon

  Scenario: Ensure the homepage has been built
    Given I am an anonymous user
    And I am on the homepage
    Then I should see "Bike The USA"
    And I should see "Featured Package"
    And I should see "Nexus Contest"
    And I should see "Video Tours"
    And I should see "Nexus on Twitter"
