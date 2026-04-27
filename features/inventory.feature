Feature: Inventory Management

  Background:
    Given I am logged in as a standard user
    And I am on the inventory page
    When I reset app state

  Scenario: Shows inventory list with expected item count
    Then I should see 6 items in the inventory

  Scenario: Opens a product details page
    When I click on product "Sauce Labs Bolt T-Shirt"
    Then I should be on the inventory item page
    And I should see product details "Sauce Labs Bolt T-Shirt", "$15.99", "Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt."

  Scenario Outline: Sorts inventory by different criteria
    When I sort by "<sortOrder>"
    Then I should see first item as "<expectedValue>"

    Examples:
      | sortOrder             | expectedValue                    |
      | Name (A to Z)         | Sauce Labs Backpack              |
      | Name (Z to A)         | Test.allTheThings() T-Shirt (Red) |
      | Price (low to high)   | $7.99                            |
      | Price (high to low)   | $49.99                           |

  Scenario: Adds item to cart
    When I add "Sauce Labs Backpack" to cart
    Then I should see cart badge with count "1"