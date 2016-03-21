@dfs_fin @insurance_product
Feature: DFS FIN: Products
  As a developer,
  I need to ensure that the Insurance Product content type is correctly set up
  So that the FIN demo will work correctly.

  @api
  Scenario: Check Insurance Product content type is present
    Given I am logged in as a user with the "administrator" role
    When I visit "/admin/structure/types"
    Then I should see "Insurance Product"

  @api
  Scenario: Make sure I can make an Insurance Product for FIN
    Given "insurance_product" content:
    | title             | body          |
    | Travel Insurance  | A placeholder |
    And I am logged in as a user with the "administrator" role
    When I visit "/admin/content"
    Then I should see "Travel Insurance"
    When I follow "Travel Insurance"
    Then I should see the heading "Travel Insurance" in the "secondary" region
    And I should see "A placeholder" in the "left" region

  @api
  Scenario: Ensure defined fields and field groups exist
    Given I am logged in as a user with the "administrator" role
    When I go to "/admin/structure/types/manage/insurance-product/fields"
    Then I should see "title"
    And I should see "group_ins_tabs"
    And I should see "group_content"
    And I should see "field_subtitle"
    And I should see "field_short_title"
    And I should see "body"
    And I should see "group_media"
    And I should see "field_ins_image"
    And I should see "field_ins_icon"
    And I should see "group_hero"
    And I should see "field_ins_hero_image"
    And I should see "field_hero_button"
    And I should see "group_relationships"
    And I should see "field_product_quotes"
    And I should see "field_site_section"
    And I should see "field_persona"
    And I should see "group_callout"
    And I should see "field_bundle_text"
    And I should see "field_callout_heading"
    And I should see "field_callout_text"
    And I should see "field_hero_list_text"
    And I should see "metatags"
    And I should see "path"
    And I should see "locations"

  @api
  Scenario: Check on imported Insurance Product content
    Given I am an anonymous user
    When I visit "/product/auto-insurance"
    Then I should see "Get A Car Insurance Quote & You Could Save $500+" in the "top" region
    And I should see "Start Quote" in the "top" region
    And I should see the heading "Auto Insurance" in the "secondary" region
    And I should see "Protected from the unexpected!" in the "secondary" region
    And I should see "Having trouble picking the right car insurance?" in the "left" region
    And I should see "I switched my Auto Insurance to Bayside 10 years ago." in the "right" region
    And I should see "Bundle & Save!" in the "bottom" region
    And I should see "Save money by bundling Bayside insurance products together" in the "bottom" region
    And I should see "Home Insurance" in the "bottom" region
    And I should see "Life Insurance" in the "bottom" region
    And I should see "Disability Insurance" in the "bottom" region
