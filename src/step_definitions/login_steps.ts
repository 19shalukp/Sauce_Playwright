import {Given, Then, When} from "@cucumber/cucumber";
import config from '../config/config.json';
import { expect } from "@playwright/test";

Given('the user navigate to the login page', async function () {
   const loginPage = this.poManager.getLoginPage();
    await loginPage.navigateTo(config.baseURL)
    await loginPage.waitFor(loginPage.userName);
});

When('the user enters credentials as {string} and {string} and click login button', async function (username, password) {
    const loginPage = this.poManager.getLoginPage();
    await loginPage.enterCredentials(username, password);
    await loginPage.clickLoginButton();
   
});

Then('an error message should be displayed', async function () {
    const loginPage = this.poManager.getLoginPage();
    await loginPage.waitFor(loginPage.invalidCredentialError);
    expect(await loginPage.getInvalidCredentialError()).toContain("Epic sadface: Sorry, this user has been locked out.");
});

Then('the user should be redirected to the inventory page', async function () {
    const loginPage = this.poManager.getLoginPage();
    expect(await loginPage.getURL()).toBe(config.inventoryPageURL);
});


       
       