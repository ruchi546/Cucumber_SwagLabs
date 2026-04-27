Feature: Sidebar Navigation Tests

  Background:
    Given I am logged in as a standard user

  Scenario: Can open and close sidebar menu
    When I open the sidebar menu
    Then I should see the sidebar is open
    When I close the sidebar menu
    Then I should see the sidebar is closed

  Scenario: Sidebar displays all navigation links
    When I open the sidebar menu
    Then I should see inventory link in sidebar
    And I should see about link in sidebar
    And I should see logout link in sidebar
    And I should see reset app state link in sidebar

  Scenario: Can navigate to All Items from sidebar
    When I open the sidebar menu
    And I click on "All Items" in sidebar
    Then I should be on the inventory page

  Scenario: Can reset app state from sidebar
    When I add "Sauce Labs Backpack" to cart
    And I should see cart badge with count "1"
    When I reset app state
    Then I should see the sidebar is closed
    And I should not see cart badge

  Scenario: Can logout from sidebar
    When I open the sidebar menu
    And I click on "Logout" in sidebar
    Then I should be on the login page

  Scenario: Sidebar persists on page navigation
    When I add "Sauce Labs Backpack" to cart
    And I view the shopping cart
    And I open the sidebar menu
    Then I should see the sidebar is open
    When I click on "All Items" in sidebar
    Then I should be on the inventory page