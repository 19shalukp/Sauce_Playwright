import { LoginPage } from "./LoginPage";
import { ProductPage } from "./ProductPage";
import { CartPage } from "./CartPage";
import { CheckoutPage } from "./CheckoutPage";
import {BrowserContext, Page} from "@playwright/test";
export class POManager{

private  loginPage:LoginPage;
private  productPage:ProductPage;
private  cartPage:CartPage;
private  checkoutPage:CheckoutPage;
    constructor(page: Page, context: BrowserContext){
        this.loginPage = new LoginPage(page, context);
        this.productPage = new ProductPage(page, context);
        this.cartPage = new CartPage(page, context);
        this.checkoutPage = new CheckoutPage(page, context);
    }

    getLoginPage():LoginPage{
        return this.loginPage;
    }

    getProductPage(): ProductPage{
        return this.productPage;
    }

    getCartPage(): CartPage{
        return this.cartPage;
    }
    getCheckoutPage(): CheckoutPage{
        return this.checkoutPage;
    }

}