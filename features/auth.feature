Feature: Authentication Tests

  Background:
    Given I am on the login page

  Scenario: Shows username and password placeholders
    Then I should see username placeholder "Username"
    And I should see password placeholder "Password"

  Scenario: Shows Login button
    Then I should see login button visible
    And I should see login button with text "Login"

  Scenario: Shows error for blank credentials
    When I click the login button
    Then I should see error message "Epic sadface: Username is required"

  Scenario: Shows error for invalid credentials
    When I login with "invalid_user" and "invalid_password"
    Then I should see error message "Epic sadface: Username and password do not match"

  Scenario: Blocks locked out user
    When I login with "locked_out_user" and "secret_sauce"
    Then I should see error message "Epic sadface: Sorry, this user has been locked out"

  Scenario Outline: Logs in successfully with various user types
    When I login with "<username>" and "<password>"
    Then I should be on the inventory page

    Examples:
      | username                   | password     |
      | standard_user              | secret_sauce |
      | problem_user               | secret_sauce |
      | performance_glitch_user    | secret_sauce |
      | error_user                 | secret_sauce |
      | visual_user                | secret_sauce |

  Scenario: Shows accepted usernames
    Then I should see accepted usernames displayed

  Scenario: Shows password
    Then I should see password info displayed