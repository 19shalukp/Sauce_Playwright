import {Given, Then, When} from "@cucumber/cucumber";
import config from '../config/config.json';
import { expect } from "@playwright/test";

Given('the user logged in and navigate to the inventory page', async function () {
    const productPage = this.poManager.getProductPage();
    await productPage.navigateTo(config.inventoryPageURL)
  //  await this.page.goto(config.inventoryPageURL, {timeout: 100000});
    await productPage.waitFor(productPage.sortDropdown);
    expect(await productPage.getURL()).toBe(config.inventoryPageURL); 
});

When('the user sorts items by clicking sort option {string}', async function (sortOption: string) {
    const productPage = this.poManager.getProductPage();
    this.sortOption = sortOption;
    await productPage.sortItemsBySortOption( this.sortOption);
});

Then(/^the items should be displayed in (?:alphabetical|reverse alphabetical|descending price|ascending price) order$/, async function () {
    const productPage = this.poManager.getProductPage();
    let listFromPageAfterSorting = await productPage.saveInventoryListFromPage( this.sortOption);
    let listProgramaticallySorted = await productPage.sortInventoryListProgramaticallyFromPage(this.sortOption,listFromPageAfterSorting);
    expect(listFromPageAfterSorting).toEqual(listProgramaticallySorted);
});

When('the user adds few products to the cart', async function (dataTable) {
    const productPage = this.poManager.getProductPage();
    const { productsUserWantsToAdd, totalProductsQty, productNames,subTotalOfItemsUserAdded }=await productPage.addProductsFromDataTable(dataTable);
    this.productsUserWantsToAdd=productsUserWantsToAdd;
    this.totalProductsQty = totalProductsQty;
    this.productNames = productNames;
    this.subTotalOfItemsUserAdded=subTotalOfItemsUserAdded;
});

Then('the cart icon count should match the number of products added', async function () {
    const productPage = this.poManager.getProductPage();
    const qtyDisplayedInCartIcon= await productPage.getCartIconCount();
    expect(qtyDisplayedInCartIcon).toBe(this.totalProductsQty);
});

When('the user clicks the cart icon', async function () {
    const productPage = this.poManager.getProductPage();
    await productPage.clickOnCartIcon();
});

