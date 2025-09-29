@Functional @Sort
Feature: Sorting items using different options on the inventory page
  Background:
    Given the user logged in and navigate to the inventory page

  Scenario: Sorting items by name in both orders
    When the user sorts items by clicking sort option "Name (A to Z)"
    Then the items should be displayed in alphabetical order
    When the user sorts items by clicking sort option "Name (Z to A)"
    Then the items should be displayed in reverse alphabetical order

  Scenario: Sorting items by price in both orders
    When the user sorts items by clicking sort option "Price (high to low)"
    Then the items should be displayed in descending price order
    When the user sorts items by clicking sort option "Price (low to high)"
    Then the items should be displayed in ascending price order

