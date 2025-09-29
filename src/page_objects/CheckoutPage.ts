import { Page, Locator,BrowserContext} from "@playwright/test";
import { BasePage } from "./BasePage";
export class CheckoutPage extends BasePage {
    readonly context: BrowserContext;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly postalCode: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly cartList: Locator;
    readonly cartItem: Locator;
    readonly cartQty: Locator;
    readonly cartIcon: Locator;
    readonly cartProductName: Locator;
    readonly cartSubTotal: Locator;
    readonly cartTax: Locator;
    readonly cartTotal: Locator;
    readonly orderConfirmationMessage: Locator;

    constructor(page: Page, context: BrowserContext) {
        super(page);
        this.context = context;
        this.firstName = page.getByPlaceholder("First Name")
        this.lastName = page.getByPlaceholder("Last Name")
        this.postalCode = page.getByPlaceholder("Zip/Postal Code")
        this.continueButton = page.locator("#continue")
        this.finishButton = page.getByRole("button", { name: "finish" });
        this.cartList = page.locator(".cart_list")
        this.cartItem=  this.cartList.locator(".cart_item");
        this.cartQty = this.cartItem.locator(".cart_quantity");
        this.cartIcon = page.locator(".shopping_cart_badge")
        this.cartProductName=   this.cartItem.locator(".cart_item_label .inventory_item_name");
        this.cartSubTotal=page.locator(".summary_subtotal_label");
        this.cartTax=page.locator(".summary_tax_label");
        this.cartTotal=page.locator(".summary_total_label");
        this.orderConfirmationMessage=page.locator(".complete-header");
    }
    
    async enterCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
    }
    
    async clickContinueButton(): Promise<void> {
        await this.continueButton.click();
        await this.page.waitForLoadState();
    }
    async clickFinishButton():  Promise<void> {
        await this.finishButton.scrollIntoViewIfNeeded()
        await this.finishButton.click();
    }

    // async getItemsCheckoutOverviewPage(expectedQty: number) {
    //     const count = await this.cartItem.count();
    //     let calculatedTotalQty=0;
    //     let items: { Name: string; Qty: string }[] = [];
    //     for (let i = 0; i < count; i++) {
    //         const qtyText = await this.cartQty.nth(i).textContent();
    //         const productName=await this.cartProductName.nth(i).textContent();
    //         items.push({ Name: productName ?? "", Qty: qtyText ?? "" });
    //         calculatedTotalQty+= qtyText ? parseInt(qtyText) : 0;
    //     }
    //     return items;
    // }

    async getItemsCheckoutOverviewPage():    Promise<{ itemsFromCheckoutPageList: { Name: string; Qty: string }[]; calculatedCartIconQty: number }>{
        const count = await this.cartItem.count();
        let calculatedCartIconQty=0;
        let itemsFromCheckoutPageList: { Name: string; Qty: string }[] = [];
        for (let i = 0; i < count; i++) {
            const qtyText = await this.cartQty.nth(i).textContent();
            const productName=await this.cartProductName.nth(i).textContent();
            itemsFromCheckoutPageList.push({ Name: productName ?? "", Qty: qtyText ?? "" });
            calculatedCartIconQty+= qtyText ? parseInt(qtyText) : 0;
        }
        return {itemsFromCheckoutPageList,calculatedCartIconQty}
    }

    async getCartIconCount() {
        await this.waitFor(this.cartIcon);
        const textCount = await this.cartIcon.textContent();
        return textCount?.trim() ? parseInt(textCount.trim(), 10) : 0;
    }
    async getDisplayedSubTotal():   Promise<number> {
        await this.waitFor(this.cartSubTotal);
        let subTotalText=await this.cartSubTotal.textContent();
        return subTotalText ? parseFloat(subTotalText.replace(/[^0-9\.]/g, "")) : 0;
    }
    
    async getDisplayedTotalPrice():  Promise<number> {
        await this.waitFor(this.cartTotal);
        let totalText=await this.cartTotal.textContent();
        return totalText ? parseFloat(totalText.replace(/[^0-9\.]/g, "")) : 0;
    }
    
    async getCalculatedTotalPrice():    Promise<number> {
        const subTotal = await this.getDisplayedSubTotal()
        const calculatedTax = subTotal * 0.0801;
        const total = subTotal + calculatedTax;
        return parseFloat(total.toFixed(2));
    }
    
    async getOrderConfirmationMessage():    Promise<string | null> {
        await this.waitFor(this.orderConfirmationMessage);
        return await this.orderConfirmationMessage.textContent();
    }
}