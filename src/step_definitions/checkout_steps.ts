import {Given, Then, When} from "@cucumber/cucumber";
import config from '../config/config.json';
import { expect } from "@playwright/test";

When('the user enters checkout information as {string} {string} {string} and hit continue', async function (firstName, lastName, postalCode) {
    const checkoutPage = this.poManager.getCheckoutPage();
    await checkoutPage.enterCheckoutInformation(firstName, lastName, postalCode);
    await checkoutPage.clickContinueButton();
});

Then('the user should be navigated to the checkout overview page', async function () {
    const checkoutPage = this.poManager.getCheckoutPage();
    expect(await checkoutPage.getURL()).toEqual(config.checkoutPageTwoURL); 
});

When('the user verifies products and quantity displayed on icon in checkout overview page', async function () {
    const checkoutPage = this.poManager.getCheckoutPage();
    let qtyDisplayedOnCartIcon= await checkoutPage.getCartIconCount();
    const{itemsFromCheckoutPageList,calculatedCartIconQty}= await checkoutPage.getItemsCheckoutOverviewPage(this.totalProductsQty);
    expect(this.productsUserWantsToAdd).toEqual(itemsFromCheckoutPageList);
    expect (qtyDisplayedOnCartIcon).toBe(calculatedCartIconQty);
});

When('the user verifies subtotal, tax and total amount', async function () {
    const checkoutPage = this.poManager.getCheckoutPage();
    const subTotalDisplayed= await checkoutPage.getDisplayedSubTotal();
    expect(this.subTotalOfItemsUserAdded).toEqual(subTotalDisplayed);
    const actualTotalPrice= await checkoutPage.getCalculatedTotalPrice();
    const displayedTotalPrice= await checkoutPage.getDisplayedTotalPrice();
    expect(displayedTotalPrice).toBeCloseTo(actualTotalPrice, 1); // 1 decimal places
});

Then('clicks finish button', async function () {
    const checkoutPage = this.poManager.getCheckoutPage();
    await checkoutPage.clickFinishButton();
});

Then('the user verifies the order is placed successfully', async function () {
    const checkoutPage = this.poManager.getCheckoutPage();
    const orderConfirmationMsg=await checkoutPage.getOrderConfirmationMessage()
    expect(orderConfirmationMsg).toBe("Thank you for your order!");
});


