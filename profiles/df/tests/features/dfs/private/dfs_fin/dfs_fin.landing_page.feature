@dfs_fin
Feature: DFS FIN: Contest Landing
  In order to prove that dfs_fin was enabled correctly
  As a developer
  I need to check for elements on the panelized landing page

  Scenario: Content: Fieldable Panels Panes
    When I visit "/contest"
    Then I should see the text "Bundle car insurance for a chance to win!" in the "primary_features" region
    And I should see the heading "Bundle Auto insurance for a chance to win!" in the "secondary_features" region
    And I should see "When you add a auto insurance policy to your account" in the "secondary_features" region
    And I should see "Share to Win!" in the "secondary_features" region
