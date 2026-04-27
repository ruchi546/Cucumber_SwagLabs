const { $ } = require('@wdio/globals')
const Page = require('./page');

class SidebarPage extends Page {
    get menuButton () {
        return $('#react-burger-menu-btn');
    }

    get closeButton () {
        return $('#react-burger-cross-btn');
    }

    get inventorySidebarLink () {
        return $('[data-test="inventory-sidebar-link"]');
    }

    get aboutSidebarLink () {
        return $('[data-test="about-sidebar-link"]');
    }

    get logoutSidebarLink () {
        return $('[data-test="logout-sidebar-link"]');
    }

    get resetSidebarLink () {
        return $('[data-test="reset-sidebar-link"]');
    }

    async openMenu() {
        await this.menuButton.waitForClickable({ timeout: 5000 });
        await this.menuButton.click();
        await this.closeButton.waitForDisplayed({ timeout: 5000 });
    }

    async closeMenu() {
        await this.closeButton.waitForClickable({ timeout: 5000 });
        await this.closeButton.click();
        await this.closeButton.waitForDisplayed({ timeout: 5000, reverse: true });
    }

    async clickAllItems() {
        await this.inventorySidebarLink.waitForDisplayed({ timeout: 5000 });
        await this.inventorySidebarLink.click();
    }

    async clickAbout() {
        await this.aboutSidebarLink.waitForDisplayed({ timeout: 5000 });
        await this.aboutSidebarLink.click();
    }

    async clickLogout() {
        await this.logoutSidebarLink.waitForDisplayed({ timeout: 5000 });
        await this.logoutSidebarLink.click();
    }

    async clickResetAppState() {
        await this.resetSidebarLink.waitForDisplayed({ timeout: 5000 });
        await this.resetSidebarLink.click();
    }
}

module.exports = new SidebarPage();