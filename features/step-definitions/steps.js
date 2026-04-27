const { Given, When, Then, Before, After } = require('@wdio/cucumber-framework');
const { expect, browser, $$ } = require('@wdio/globals')

const LoginPage = require('../pageobjects/login.page');
const InventoryPage = require('../pageobjects/inventory.page');
const SidebarPage = require('../pageobjects/sidebar.page');
const { users, loginErrors, loginUI, acceptedUsers } = require('../support/testData');

// Hooks

Before(async function(scenario) {
    try {
        console.log(`[TEST START] ${scenario.pickle.name}`);
        await browser.deleteCookies();
    } catch (error) {
        console.error(`[ERROR] Before hook failed: ${error.message}`);
    }
});

After(async function(scenario) {
    try {
        if (scenario.result.status === 'FAILED') {
            console.error(`[TEST FAILED] ${scenario.pickle.name}`);
        } else {
            console.log(`[TEST PASSED] ${scenario.pickle.name}`);
        }
    } catch (error) {
        console.error(`[ERROR] After hook failed: ${error.message}`);
    }
});

// Login/Authentication Steps

Given(/^I am on the login page$/, async () => {
    try {
        console.log('[STEP] Opening login page');
        await LoginPage.open();
        await LoginPage.inputUsername.waitForDisplayed({ timeout: 5000 });
    } catch (error) {
        throw new Error(`Failed to open login page: ${error.message}`);
    }
});

Given(/^I am logged in as a standard user$/, async () => {
    try {
        console.log('[STEP] Logging in as standard user');
        await LoginPage.open();
        await LoginPage.login(users.standard.username, users.standard.password);
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory.html');
        }, { timeout: 5000 });
    } catch (error) {
        throw new Error(`Failed to login as standard user: ${error.message}`);
    }
});

When(/^I login with "([^"]*)" and "([^"]*)"$/, async (username, password) => {
    try {
        console.log(`[STEP] Login with username: ${username}`);
        await LoginPage.login(username, password);
    } catch (error) {
        throw new Error(`Failed to login: ${error.message}`);
    }
});

When(/^I click the login button$/, async () => {
    try {
        console.log('[STEP] Clicking login button');
        await LoginPage.clickLoginButton();
    } catch (error) {
        throw new Error(`Failed to click login button: ${error.message}`);
    }
});

Then(/^I should see error message "([^"]*)"$/, async (message) => {
    try {
        console.log(`[ASSERTION] Checking for error message: "${message}"`);
        const errorMsg = await LoginPage.errorMessage;
        await errorMsg.waitForDisplayed({ timeout: 5000 });
        const text = await errorMsg.getText();
        await expect(text).toContain(message);
    } catch (error) {
        throw new Error(`Error message assertion failed: ${error.message}`);
    }
});

Then(/^I should see username placeholder "([^"]*)"$/, async (placeholder) => {
    try {
        console.log(`[ASSERTION] Verifying username placeholder is "${placeholder}"`);
        const input = await LoginPage.inputUsername;
        await input.waitForDisplayed({ timeout: 3000 });
        const attr = await input.getAttribute('placeholder');
        await expect(attr).toBe(placeholder || loginUI.usernamePlaceholder);
    } catch (error) {
        throw new Error(`Username placeholder assertion failed: ${error.message}`);
    }
});

Then(/^I should see password placeholder "([^"]*)"$/, async (placeholder) => {
    try {
        console.log(`[ASSERTION] Verifying password placeholder is "${placeholder}"`);
        const input = await LoginPage.inputPassword;
        await input.waitForDisplayed({ timeout: 3000 });
        const attr = await input.getAttribute('placeholder');
        await expect(attr).toBe(placeholder || loginUI.passwordPlaceholder);
    } catch (error) {
        throw new Error(`Password placeholder assertion failed: ${error.message}`);
    }
});

Then(/^I should see login button visible$/, async () => {
    try {
        console.log('[ASSERTION] Verifying login button is visible');
        await expect(LoginPage.btnSubmit).toBeDisplayed();
    } catch (error) {
        throw new Error(`Login button visibility assertion failed: ${error.message}`);
    }
});

Then(/^I should see login button with text "([^"]*)"$/, async (text) => {
    try {
        console.log(`[ASSERTION] Verifying login button text is "${text}"`);
        const btn = await LoginPage.btnSubmit;
        await btn.waitForDisplayed({ timeout: 3000 });
        const btnValue = await btn.getAttribute('value') || await btn.getText();
        await expect(btnValue.trim()).toContain(text || loginUI.loginButtonText);
    } catch (error) {
        throw new Error(`Login button text assertion failed: ${error.message}`);
    }
});

Then(/^I should see accepted usernames displayed$/, async () => {
    try {
        console.log('[ASSERTION] Verifying accepted usernames are displayed');
        const credentials = await LoginPage.loginCredentials;
        await credentials.waitForDisplayed({ timeout: 3000 });
        const text = await credentials.getText();
        await expect(text).toContain('Accepted usernames are:');
        for (const username of acceptedUsers) {
            await expect(text).toContain(username);
        }
    } catch (error) {
        throw new Error(`Usernames display assertion failed: ${error.message}`);
    }
});

Then(/^I should see password info displayed$/, async () => {
    try {
        console.log('[ASSERTION] Verifying password info is displayed');
        const password = await LoginPage.loginPassword;
        await password.waitForDisplayed({ timeout: 3000 });
        const text = await password.getText();
        await expect(text).toContain('Password for all users:');
        await expect(text).toContain(loginUI.defaultPassword);
    } catch (error) {
        throw new Error(`Password info assertion failed: ${error.message}`);
    }
});

// Navigation/Page Steps

Then(/^I should be on the inventory page$/, async () => {
    await browser.waitUntil(async () => {
        const url = await browser.getUrl();
        return url.includes('inventory.html');
    }, { timeout: 5000 });
});

When(/^I reset app state$/, async () => {
    try {
        console.log('[STEP] Resetting app state');
        await SidebarPage.openMenu();
        await SidebarPage.clickResetAppState();
        await SidebarPage.closeMenu();
        await browser.waitUntil(async () => {
            try {
                return true;
            } catch (e) {
                return false;
            }
        }, { timeout: 3000 });
    } catch (e) {
        console.log(`[WARNING] Could not reset app state: ${e.message}`);
    }
});

Then(/^I should be on the inventory item page$/, async () => {
    try {
        console.log('[ASSERTION] Verifying on inventory item page');
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('inventory-item.html');
        }, { timeout: 5000 });
    } catch (error) {
        throw new Error(`Not on inventory item page: ${error.message}`);
    }
});

// Inventory Steps

Given(/^I am on the inventory page$/, async () => {
    await InventoryPage.open();
    await browser.waitUntil(async () => {
        try {
            const items = await $$('[data-test="inventory-item"]');
            if (items.length === 0) return false;
            for (let item of items) {
                const name = await item.$('[data-test="inventory-item-name"]');
                const text = await name.getText();
                if (text && text.trim().length > 0) return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }, { timeout: 5000, timeoutMsg: 'Inventory page failed to load' });
});

When(/^I click on product "([^"]*)"$/, async (productName) => {
    try {
        console.log(`[STEP] Clicking on product: "${productName}"`);
        await InventoryPage.clickItemByName(productName);
    } catch (error) {
        throw new Error(`Failed to click on product "${productName}": ${error.message}`);
    }
});

When(/^I sort by "([^"]*)"$/, async (sortOrder) => {
    try {
        console.log(`[STEP] Sorting by: "${sortOrder}"`);
        await InventoryPage.selectSortOrder(sortOrder);
    } catch (error) {
        throw new Error(`Failed to sort by "${sortOrder}": ${error.message}`);
    }
});

When(/^I add "([^"]*)" to cart$/, async (productName) => {
    try {
        console.log(`[STEP] Adding to cart: "${productName}"`);
        await InventoryPage.addItemToCartByName(productName);
    } catch (error) {
        throw new Error(`Failed to add "${productName}" to cart: ${error.message}`);
    }
});

When(/^I remove "([^"]*)" from inventory$/, async (productName) => {
    try {
        console.log(`[STEP] Removing from inventory: "${productName}"`);
        await InventoryPage.removeItemByName(productName);
    } catch (error) {
        throw new Error(`Failed to remove "${productName}" from inventory: ${error.message}`);
    }
});

When(/^I view the shopping cart$/, async () => {
    try {
        console.log('[STEP] Viewing shopping cart');
        await InventoryPage.clickShoppingCart();
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('cart.html');
        }, { timeout: 5000 });
    } catch (error) {
        throw new Error(`Failed to view shopping cart: ${error.message}`);
    }
});

Then(/^I should see (\d+) items in the inventory$/, async (count) => {
    const items = await InventoryPage.inventoryItems;
    await expect(items).toHaveLength(parseInt(count));
});

Then(/^I should see product details "([^"]*)", "([^"]*)", "([^"]*)"$/, async (name, price, desc) => {
    const itemName = await InventoryPage.inventoryItemName;
    const nameText = await itemName.getText();
    await expect(nameText).toContain(name);
    
    const itemPrice = await InventoryPage.inventoryItemPrice;
    const priceText = await itemPrice.getText();
    await expect(priceText).toContain(price);
    
    const addBtn = await InventoryPage.addToCartButton;
    await expect(addBtn).toBeDisplayed();
    
    const description = await InventoryPage.inventoryItemDesc;
    const descText = await description.getText();
    await expect(descText).toContain(desc);
});

Then(/^I should see first item as "([^"]*)"$/, async (expectedValue) => {
    const firstItem = await InventoryPage.getFirstItemName();
    if (expectedValue.includes('$')) {
        const firstPrice = await InventoryPage.getFirstItemPrice();
        await expect(firstPrice).toContain(expectedValue);
    } else {
        await expect(firstItem).toContain(expectedValue);
    }
});

Then(/^I should see cart badge with count "(\d+)"$/, async (count) => {
    const badge = await InventoryPage.getCartBadgeCount();
    await expect(badge).toBe(count.toString());
});

Then(/^I should not see cart badge$/, async () => {
    const badge = await InventoryPage.getCartBadgeCount();
    await expect(badge).toBeNull();
});

// Sidebar Steps

When(/^I open the sidebar menu$/, async () => {
    try {
        console.log('[STEP] Opening sidebar menu');
        await SidebarPage.openMenu();
    } catch (error) {
        throw new Error(`Failed to open sidebar menu: ${error.message}`);
    }
});

When(/^I close the sidebar menu$/, async () => {
    try {
        console.log('[STEP] Closing sidebar menu');
        await SidebarPage.closeMenu();
    } catch (error) {
        throw new Error(`Failed to close sidebar menu: ${error.message}`);
    }
});

Then(/^I should see the sidebar is open$/, async () => {
    try {
        console.log('[ASSERTION] Checking if sidebar is open');
        const closeBtn = await SidebarPage.closeButton;
        await expect(closeBtn).toBeDisplayed();
    } catch (error) {
        throw new Error(`Sidebar is not open: ${error.message}`);
    }
});

Then(/^I should see inventory link in sidebar$/, async () => {
    try {
        console.log('[ASSERTION] Verifying inventory link in sidebar');
        const link = await SidebarPage.inventorySidebarLink;
        await expect(link).toBeDisplayed();
    } catch (error) {
        throw new Error(`Inventory link not found in sidebar: ${error.message}`);
    }
});

Then(/^I should see about link in sidebar$/, async () => {
    try {
        console.log('[ASSERTION] Verifying about link in sidebar');
        const link = await SidebarPage.aboutSidebarLink;
        await expect(link).toBeDisplayed();
    } catch (error) {
        throw new Error(`About link not found in sidebar: ${error.message}`);
    }
});

Then(/^I should see logout link in sidebar$/, async () => {
    try {
        console.log('[ASSERTION] Verifying logout link in sidebar');
        const link = await SidebarPage.logoutSidebarLink;
        await expect(link).toBeDisplayed();
    } catch (error) {
        throw new Error(`Logout link not found in sidebar: ${error.message}`);
    }
});

Then(/^I should see reset app state link in sidebar$/, async () => {
    try {
        console.log('[ASSERTION] Verifying reset app state link in sidebar');
        const link = await SidebarPage.resetSidebarLink;
        await expect(link).toBeDisplayed();
    } catch (error) {
        throw new Error(`Reset app state link not found in sidebar: ${error.message}`);
    }
});

Then(/^I should be on the login page$/, async () => {
    try {
        console.log('[ASSERTION] Verifying on login page');
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('https://www.saucedemo.com');
        }, { timeout: 5000 });
    } catch (error) {
        throw new Error(`Not on login page: ${error.message}`);
    }
});

Then(/^I should see the sidebar is closed$/, async () => {
    try {
        console.log('[ASSERTION] Checking if sidebar is closed');
        await SidebarPage.closeButton.waitForDisplayed({ timeout: 5000, reverse: true });
    } catch (error) {
        throw new Error(`Sidebar is still open: ${error.message}`);
    }
});

When(/^I click on "([^"]*)" in sidebar$/, async (linkName) => {
    try {
        console.log(`[STEP] Clicking on "${linkName}" in sidebar`);
        switch (linkName.toLowerCase()) {
            case 'all items':
                await SidebarPage.clickAllItems();
                break;
            case 'about':
                await SidebarPage.clickAbout();
                break;
            case 'logout':
                await SidebarPage.clickLogout();
                break;
            case 'reset app state':
                await SidebarPage.clickResetAppState();
                break;
            default:
                throw new Error(`Unknown sidebar link: ${linkName}`);
        }
        await browser.pause(500);
    } catch (error) {
        throw new Error(`Failed to click on "${linkName}": ${error.message}`);
    }
});