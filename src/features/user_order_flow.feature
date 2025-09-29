@E2EUserFlow
Feature: End to end user flow for placing an order on Swag labs
  
  Scenario Outline: End to end user flow for placing an order on Swag labs
    Given the user navigate to the login page
    When the user enters credentials as "<username>" and "<password>" and click login button
    When the user sorts items by clicking sort option "Price (low to high)"
    When the user adds few products to the cart
      | Name                                    | Qty |  
      |Sauce Labs Fleece Jacket   |   1   |
      | Sauce Labs Onesie              |    1  |
    When the user clicks the cart icon
    Then the user should be navigated to the cart page and verifies products in cart list
    And the user proceeds to checkout
    When the user enters checkout information as "Smith" "Brown" "4122" and hit continue
    Then the user should be navigated to the checkout overview page
    And clicks finish button
    Then the user verifies the order is placed successfully

    Examples:
      | username              | password         |
      | problem_user        | secret_sauce   |
      | standard_user       | secret_sauce   |
      | error_user              | secret_sauce   |
      | visual_user             | secret_sauce   |
    