import { expect, Locator, Page } from '@playwright/test';
import { URLS } from '../test-data';

export class CartPage {
  private readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  private readonly itemNames: Locator; // Делаем приватным, так как используется только внутри класса

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.itemNames = page.locator('.inventory_item_name'); // Добавляем отдельный локатор для имен
  }

  // Основные методы проверки страницы (ваши)
  async verifyCartPageIsOpened() {
    await expect(this.page).toHaveURL(URLS.CART);
    await expect(this.checkoutButton).toBeVisible();
    await expect(this.continueShoppingButton).toBeVisible();
  }

  // Методы для работы с товарами (совмещенные)
  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async expectItemsCount(expectedCount: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async getItemName(index: number): Promise<string> {
    return (await this.itemNames.nth(index).textContent()) ?? ''; // Обработка null
  }

  // Методы действий (ваши + улучшенные)
  async removeItem(index: number): Promise<void> {
    await this.cartItems.nth(index).getByRole('button', { name: 'Remove' }).click(); // Более стабильный селектор
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  // Новый полезный метод
  async verifyItemName(index: number, expectedName: string): Promise<void> {
    await expect(this.itemNames.nth(index)).toHaveText(expectedName);
  }
}