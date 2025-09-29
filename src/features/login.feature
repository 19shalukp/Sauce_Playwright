 @Functional
Feature: Login feature
  Background:   
    Given the user navigate to the login page

  Scenario: Unsuccessful login with invalid credentials
    When the user enters credentials as "locked_out_user" and "secret_sauce" and click login button
    Then an error message should be displayed
    
  Scenario Outline: Successful login with valid credentials
    When the user enters credentials as "<username>" and "<password>" and click login button
    Then the user should be redirected to the inventory page
    Examples:
      | username                             | password         |
      | performance_glitch_user   | secret_sauce   |
      | standard_user                     | secret_sauce   |
    
   




