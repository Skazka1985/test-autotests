import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { URLS } from '../test-data';

export class InventoryPage extends BasePage {
    readonly title: Locator;
    readonly menuButton: Locator;
    readonly inventoryList: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.locator('.title');
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.inventoryList = page.locator('.inventory_list');
    }

    async verifySuccessfulLogin(): Promise<void> {
        await expect(this.page).toHaveURL(URLS.INVENTORY);
        await expect(this.title).toHaveText('Products');
        await expect(this.inventoryList).toBeVisible();
    }

    async openMenu(): Promise<void> {
        await this.menuButton.click({ timeout: 10000 });
    }

    async measureLoginPerformance(loginAction: () => Promise<void>): Promise<number> {
        const startTime = Date.now();
        await loginAction();
        await this.verifySuccessfulLogin();
        return Date.now() - startTime;
    }
}


