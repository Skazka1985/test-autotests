import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { URLS } from '../test-data';

export class InventoryPage extends BasePage {
    // Локаторы (все объявлены в одном месте)
    readonly title: Locator;
    readonly menuButton: Locator;
    readonly inventoryList: Locator;
    readonly inventoryItems: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;
    readonly itemNames: Locator;

    constructor(page: Page) {
        super(page);
        
        // Инициализируем все локаторы
        this.title = page.locator('.title');
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.inventoryList = page.locator('.inventory_list');
        this.inventoryItems = page.locator('.inventory_item');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartLink = page.locator('.shopping_cart_link');
        this.itemNames = page.locator('.inventory_item_name');
    }

    // Методы для проверок страницы
    async verifySuccessfulLogin(): Promise<void> {
        await this.verifyInventoryPageIsOpened();
    }

    async verifyInventoryPageIsOpened(): Promise<void> {
        await expect(this.page).toHaveURL(URLS.INVENTORY);
        await expect(this.title).toHaveText('Products');
        await expect(this.inventoryList).toBeVisible();
    }

    // Методы для работы с меню
    async openMenu(): Promise<void> {
        await this.menuButton.click({ timeout: 10000 });
    }

    // Методы для работы с товарами
    async getItemName(index: number): Promise<string | null> {
        return this.itemNames.nth(index).textContent();
    }

    async addItemToCart(index: number): Promise<void> {
        await this.inventoryItems.nth(index).getByRole('button', { name: 'Add to cart' }).click();
    }

    async getRandomItemIndex(): Promise<number> {
        const count = await this.inventoryItems.count();
        return Math.floor(Math.random() * count);
    }

    // Методы для работы с корзиной
    async verifyCartBadgeCount(expectedCount: number): Promise<void> {
        await expect(this.cartBadge).toHaveText(expectedCount.toString());
    }

    async verifyCartBadgeNotVisible(): Promise<void> {
        await expect(this.cartBadge).not.toBeVisible();
    }

    async goToCart(): Promise<void> {
        await this.cartLink.click();
    }

    async openItemDetails(index: number): Promise<void> {
        await this.itemNames.nth(index).click();
    }

    // Метод для замера производительности
    async measureLoginPerformance(loginAction: () => Promise<void>): Promise<number> {
        const startTime = Date.now();
        await loginAction();
        await this.verifyInventoryPageIsOpened();
        return Date.now() - startTime;
    }
}