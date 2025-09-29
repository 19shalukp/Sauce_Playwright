@Functional @ProductCheckout
Feature: Adding to cart, verifying  cart, cart icon and checkout page
  Background:
    Given the user logged in and navigate to the inventory page

Scenario: Add items of users choice to cart and verify cart list, quantity on cart icon and products with quantity on checkout page
When the user adds few products to the cart
| Name                                    | Qty |
|Sauce Labs Fleece Jacket   |   1   |
| Sauce Labs Onesie              |   1  |
|Sauce Labs Backpack           |   1 |
Then the cart icon count should match the number of products added
When the user clicks the cart icon
Then the user should be navigated to the cart page and verifies products in cart list
And the user proceeds to checkout  
When the user enters checkout information as "Smith" "Brown" "4122" and hit continue
Then the user should be navigated to the checkout overview page 
And the user verifies products and quantity displayed on icon in checkout overview page
Then the user verifies subtotal, tax and total amount 
