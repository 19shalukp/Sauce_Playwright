import { Page, Locator,BrowserContext} from "@playwright/test";
import { BasePage } from "./BasePage";
export class LoginPage extends BasePage {
    context: BrowserContext;
    userName: Locator;
    password: Locator;
    loginButton: Locator;
    invalidCredentialError: Locator;
    constructor(page:Page, context: BrowserContext) {
        super(page);
        this.context = context;
        this.userName = page.getByPlaceholder("Username")
        this.password = page.getByPlaceholder("Password")
        this.loginButton = page.locator(".submit-button")
        this.invalidCredentialError = page.locator("[data-test='error']");
    }
    
    async enterCredentials(username: string, password: string) {
        await this.userName.fill(username);
        await this.password.fill(password);
    }
     async clickLoginButton() {
         await this.loginButton.click();
    }
    
    async getInvalidCredentialError(): Promise<string> {
        return (await this.invalidCredentialError.textContent()) ?? "";
    }

    async loginAndStoreLoginState() {
        await this.context.storageState({path: 'src/artifacts/loginState.json'});
    }
    
}