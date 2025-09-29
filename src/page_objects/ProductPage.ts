import { Page, Locator,BrowserContext} from "@playwright/test";
import { DataTable } from '@cucumber/cucumber';
import { BasePage } from "./BasePage";
export class ProductPage extends BasePage {
    
    context: BrowserContext;
    sortDropdown: Locator;
    allProductsName: Locator;
    allProductsPrice: Locator;
    products: Locator;
    productName: Locator;
    productAddCartButton: Locator;
    productPrice: Locator;
    cartIcon: Locator;

    constructor(page: Page, context: BrowserContext) {
        super(page);
        this.context = context;
        this.allProductsName = page.locator(".inventory_item .inventory_item_description .inventory_item_label .inventory_item_name ")
        this.allProductsPrice = page.locator(".inventory_item .inventory_item_description .pricebar .inventory_item_price")
        this.sortDropdown = page.locator(".product_sort_container")
        this.products = page.locator(".inventory_item_description")
        this.productName=this.products.locator(".inventory_item_name")
        this.productAddCartButton=this.products.locator(".btn")
        this.productPrice=this.products.locator(".inventory_item_price")
        this.cartIcon = page.locator(".shopping_cart_badge")
    }

    async sortItemsBySortOption(sortOption: string) {
        await this.sortDropdown.selectOption({label: sortOption});
        await this.waitForLoadState('load')
    }

    async saveInventoryListFromPage(sortOption: string): Promise<string[]> {
        if (sortOption === "Name (A to Z)" || sortOption === "Name (Z to A)") {
            const sortedItemsNameFromPage = await this.allProductsName.allTextContents();
            console.log(`Sorted items with sort option as ${sortOption} from page are - ${sortedItemsNameFromPage}`)
            return sortedItemsNameFromPage;
        } else if (sortOption === "Price (low to high)" || sortOption === "Price (high to low)") {
            const sortedItemsPriceFromPage = await this.allProductsPrice.allTextContents();
            console.log(`Sorted items with sort option as ${sortOption} from page are - ${sortedItemsPriceFromPage}`)
            return sortedItemsPriceFromPage;
        }
        return [];
    }

    async sortInventoryListProgramaticallyFromPage(sortOption: string, listFromPage: string[]): Promise<string[]> {
        if (sortOption === "Name (A to Z)") {
            const programaticallySortedItems = listFromPage.slice().sort();
            console.log(`Programatically sorted items in alphabetical order are - ${programaticallySortedItems}`)
            return programaticallySortedItems;
        } else if (sortOption === "Name (Z to A)") {
            const programaticallySortedItems = listFromPage.slice().sort().reverse();
            console.log(`Programatically sorted items in reverse alphabetical order are - ${programaticallySortedItems}`)
            return programaticallySortedItems;
        } else if (sortOption === "Price (low to high)") {
            const programaticallySortedItems = listFromPage.slice().sort((a, b) => parseFloat(a.replace('$', '')) - parseFloat(b.replace('$', '')));
            console.log(`Programatically sorted price in ascending order are - ${programaticallySortedItems}`)
            return programaticallySortedItems;
        } else if (sortOption === "Price (high to low)") {
            const programaticallySortedItems = listFromPage.slice().sort((a, b) => parseFloat(b.replace('$', '')) - parseFloat(a.replace('$', '')));
            console.log(`Programatically sorted price in descending order are - ${programaticallySortedItems}`)
            return programaticallySortedItems;
        }
        return [];
    }
    

   //Convert data table to object array and loop through each object to add products to cart
    async addProductsFromDataTable(dataTable: DataTable) {
        const productsUserWantsToAdd = dataTable.hashes();
        let totalProductsQty=0;
        let productNames: string[] = [];
        let subTotalOfItemsUserAdded = 0;
        for (const product of productsUserWantsToAdd) {
            const productName = product['Name'];
            productNames.push(productName);
            const quantity = Number(product.Qty);
             totalProductsQty+=quantity;
            for (let i = 0; i < quantity; i++) {
                const price = await this.addEachProductToCart(productName);
                subTotalOfItemsUserAdded += price;
            }
        }
        return { productsUserWantsToAdd,totalProductsQty, productNames,subTotalOfItemsUserAdded };
    }

        async addEachProductToCart(productName: string) {
            const count = await this.products.count();
            for (let i = 0; i < count; i++) {
                const name = await this.productName.nth(i).textContent()
                if (name==productName) {
                    await this.productAddCartButton.nth(i).click();
                    const priceText = await this.productPrice.nth(i).textContent();
                    return priceText ? parseFloat(priceText.replace('$', '')) : 0;
                }
            }
           return 0;
        }
    async getCartIconCount() {
        await this.waitFor(this.cartIcon);
        const textCount = await this.cartIcon.textContent();
        return textCount?.trim() ? parseInt(textCount.trim(), 10) : 0;
    }
    async clickOnCartIcon() {
        await this.cartIcon.click();
    }
}