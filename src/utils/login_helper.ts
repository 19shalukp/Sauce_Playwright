// src/utils/loginHelper.ts
import { chromium } from 'playwright';
import config from '../config/config.json';
import { LoginPage } from '../page_objects/LoginPage';
import {expect} from "@playwright/test";

export async function saveLoginState(username: string, password: string) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page, context);

    if (
        config.browser.toLowerCase() === 'chromium' ||
        config.browser.toLowerCase() === 'firefox' ||
        config.browser.toLowerCase() === 'webkit'
    ) {
    
        await loginPage.navigateTo(config.baseURL);
        await loginPage.waitFor(loginPage.userName);
        await loginPage.enterCredentials(username, password);
        await loginPage.clickLoginButton();
        await loginPage.loginAndStoreLoginState();
        // Save the login state for reuse in tests
        await context.storageState({path: 'src/artifacts/loginState.json'});
        await browser.close();
        console.log('Login state saved successfully!');
    }
    else {
        console.error('saveLoginState is only supported for desktop browsers (chromium, firefox, webkit).');
        await browser.close();
    }

}
