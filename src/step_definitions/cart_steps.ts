import {Then} from "@cucumber/cucumber";
import config from '../config/config.json';
import {expect} from "@playwright/test";


Then('the user should be navigated to the cart page and verifies products in cart list', async function () {
    const cartPage = this.poManager.getCartPage();
    expect(await cartPage.getURL()).toBe(config.cartPageURL);
    const itemsInCheckoutCart=await cartPage.getProductsInCartList();
    expect(itemsInCheckoutCart).toEqual(this.productNames);
});

Then('the user proceeds to checkout', async function () {
    const cartPage = this.poManager.getCartPage();
    await cartPage.clickCheckoutButton();
});