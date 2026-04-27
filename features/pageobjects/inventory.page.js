const { $, $$, browser } = require('@wdio/globals')
const Page = require('./page');

class InventoryPage extends Page {
    get inventoryContainer () {
        return $('[data-test="inventory-container"]');
    }

    get inventoryItems () {
        return $$('[data-test="inventory-item"]');
    }

    get inventoryItemName () {
        return $('[data-test="inventory-item-name"]');
    }

    get inventoryItemPrice () {
        return $('[data-test="inventory-item-price"]');
    }

    get inventoryItemDesc () {
        return $('[data-test="inventory-item-desc"]');
    }

    get productSortContainer () {
        return $('[data-test="product-sort-container"]');
    }

    get addToCartButton () {
        return $('[data-test^="add-to-cart"]');
    }

    get shoppingCartBadge () {
        return $('[data-test="shopping-cart-badge"]');
    }

    get shoppingCartLink () {
        return $('[data-test="shopping-cart-link"]');
    }

    open () {
        return super.open('inventory.html');
    }

    async clickItemByName(productName) {
        const itemNames = await $$('[data-test="inventory-item-name"]');
        
        for (let name of itemNames) {
            const text = await name.getText();
            if (text.trim() === productName.trim()) {
                await name.click();
                return;
            }
        }
        
        throw new Error(`Product "${productName}" not found in inventory`);
    }

    async selectSortOrder(sortOrder) {
        await this.productSortContainer.click();
        const options = await this.productSortContainer.$$('option');
        
        for (let option of options) {
            const text = await option.getText();
            if (text.trim() === sortOrder.trim()) {
                await option.click();
                await browser.pause(500);
                return;
            }
        }
        
        throw new Error(`Sort order "${sortOrder}" not found`);
    }

    async clickShoppingCart() {
        await this.shoppingCartLink.click();
    }

    async #waitForItems() {
        await browser.waitUntil(async () => {
            const items = await $$('[data-test="inventory-item"]');
            if (!items.length) return false;
            for (const item of items) {
                const text = await item.$('[data-test="inventory-item-name"]').getText();
                if (text?.trim()) return true;
            }
            return false;
        }, { timeout: 5000, timeoutMsg: 'Inventory items never loaded' });
        await browser.pause(500);
    }

    async #findItemByName(productName) {
        const items = await $$('[data-test="inventory-item"]');
        for (const item of items) {
            const text = await item.$('[data-test="inventory-item-name"]').getText();
            if (text.trim() === productName.trim()) return item;
        }
        throw new Error(`Product "${productName}" not found in inventory`);
    }

    async #clickButton(item, selector) {
        const btn = await item.$(`button[data-test*="${selector}"]`);
        await btn.waitForDisplayed({ timeout: 2000 });
        await btn.click();
        await browser.pause(300);
    }

    async addItemToCartByName(productName) {
        await this.#waitForItems();
        const item = await this.#findItemByName(productName);
        await this.#clickButton(item, 'add-to-cart');
    }

    async getCartBadgeCount() {
        try {
            const badge = await this.shoppingCartBadge;
            await badge.waitForDisplayed({ timeout: 2000 });
            return await badge.getText();
        } catch (e) {
            return null;
        }
    }

    async getFirstItemName() {
        const items = await this.inventoryItems;
        if (items.length > 0) {
            const name = await items[0].$('[data-test="inventory-item-name"]');
            return await name.getText();
        }
        return null;
    }

    async getFirstItemPrice() {
        const items = await this.inventoryItems;
        if (items.length > 0) {
            const price = await items[0].$('[data-test="inventory-item-price"]');
            return await price.getText();
        }
        return null;
    }
}

module.exports = new InventoryPage();