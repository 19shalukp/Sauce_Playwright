import { Page, Locator } from "@playwright/test";
export class BasePage {
    protected readonly page: Page;
    constructor(page:Page) {
        this.page = page;
    }
    async navigateTo(url: string):  Promise<void> {
        await this.page.goto(url, {timeout: 10000});
    }
    async waitFor(locator: Locator) {
        try {
            await locator.waitFor({ state: 'visible', timeout: 5000 });
        } catch (error) {
            throw new Error(`Element not visible after 5s: ${error}`);
        }
    }
    async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' ) {
        await this.page.waitForLoadState(state);
    }
    async getTitle(): Promise<string> {
        return this.page.title();
    }

    async getURL(): Promise<string> {
        return this.page.url();
    }
}