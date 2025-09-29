import { Page, Locator,BrowserContext} from "@playwright/test";
import { BasePage } from "./BasePage";
export class CartPage extends BasePage {
    readonly context: BrowserContext;
    readonly cartList: Locator;
    readonly cartItemName: Locator;
    readonly cartItem: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page, context: BrowserContext) {
        super(page);
        this.context = context;
        this.cartList = page.locator(".cart_list")
        this.cartItem=  this.cartList.locator(".cart_item");
        this.cartItemName = this.cartItem.locator(".cart_item_label .inventory_item_name");
        this.checkoutButton = page.getByRole("button", { name: "checkout" });
    }
    async getProductsInCartList(): Promise<string[]> {
        const itemsCount = await this.cartItem.count();
        const itemNames: string[] = [];
        for (let i=0;i<itemsCount;i++) {
            const name= await this.cartItemName.nth(i).textContent();
            itemNames.push(name?name:"");
        }
        return itemNames;
    }
    
    async clickCheckoutButton(): Promise<void> {
        await this.checkoutButton.click();
    }
    
}