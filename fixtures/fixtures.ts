import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';
import { InventoryItemPage } from '../pages/inventory-item-page';
import { CartPage } from '../pages/cart-page';
import { CREDENTIALS, USERNAMES, URLS } from '../test-data';

interface AuthFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  inventoryItemPage: InventoryItemPage;
  cartPage: CartPage;
  authPage: {
    loginPage: LoginPage;
    inventoryPage: InventoryPage; // Добавляем inventoryPage сюда
  };
}

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate(URLS.LOGIN);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  inventoryItemPage: async ({ page }, use) => {
    await use(new InventoryItemPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  authPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page); // Создаем inventoryPage
    
    await loginPage.navigate(URLS.LOGIN);
    await loginPage.login(USERNAMES.STANDARD_USER, CREDENTIALS.PASSWORD);
    
    await use({ loginPage, inventoryPage }); // Передаем оба объекта
  }
});

export { expect } from '@playwright/test';