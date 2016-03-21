@dfs_fin
Feature: DFS FIN: General
  In order to prove that dfs_fin was enabled correctly
  As a developer
  I need to check for elements on the front page

  Scenario: Block: Slideshow
    Given I am on the homepage
    Then I should see the text "Less worrying..." in the "top" region
    And I should see the text "More exploring" in the "top" region

  Scenario: Block: Help Dropdown
    Given I am on the homepage
    Then I should see the text "What can we help you with today?" in the "top" region
    And I should see the "button" element with the "class" attribute set to "dropdown" in the "top" region

  Scenario: Block: Trusted Badge
    Given I am on the homepage
    Then I should see the text "Trusted Since 1928" in the "main" region

  Scenario: Block: Quotes
    Given I am on the homepage
    Then I should see "See How We Can Help You" in the "secondary" region

  Scenario: Block: Products Callout 
    Given I am on the homepage
    Then I should see "Auto Insurance" in the "secondary" region
    Then I should see "Home Insurance" in the "secondary" region
    Then I should see "Life Insurance" in the "secondary" region
    Then I should see "Disability Insurance" in the "secondary" region

  Scenario: Menu
    Given I am on the homepage
    Then I should see "Goals" in the "top_bar" region
    And I should see "Products" in the "top_bar" region
    And I should see "Auto Insurance" in the "top_bar" region
    And I should see "Disability Insurance" in the "top_bar" region
    And I should see "Home Insurance" in the "top_bar" region
    And I should see "Life Insurance" in the "top_bar" region
    And I should see "About Us" in the "top_bar" region
    And I should see "History" in the "top_bar" region
    And I should see "Our Story" in the "top_bar" region
    And I should see "Contact Us" in the "top_bar" region
    And I should see "Get a Quote" in the "top_bar" region
    And I should see "Locations" in the "top_bar" region
