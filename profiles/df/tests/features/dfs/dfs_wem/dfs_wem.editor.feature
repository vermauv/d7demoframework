@dfs_wem
Feature: WEM Demo Editor

  @api @javascript
  Scenario: Confirm the content curator editor workflow
    Given I am on "/user"
    When I fill in "edit-name" with "EricaWebb"
    And I fill in "edit-pass" with "password"
    And I press "Log in"
    Then I should see "EricaWebb"
    And I should see "Persona: Editor (Curator)"
    Given I am on the homepage
    Then I should see "Big Air at Big Sky" 
    When I follow "Big Air at Big Sky"
    Then I should see "Light powdery snow and consistently wide runs."

  Scenario: Confirm the content reviewer editor workflow
    Given I am on "/user"
    When I fill in "edit-name" with "PaulSimon"
    And I fill in "edit-pass" with "password"
    And I press "Log in"
    Then I should see "PaulSimon"
    And I should see "Persona: Editor (Reviewer)"
    Given I am on "admin/workbench"
    Then I should see "My Profile"
    And I should see "PaulSimon"
    And I should see "My Edits"
    And I should see "All Recent Content"
