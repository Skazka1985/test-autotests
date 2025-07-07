// tests/fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';
import { CREDENTIALS, USERNAMES, URLS, ERROR_MESSAGES } from '../test-data';

// Определяем типы для наших фикстур
interface AuthFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  authPage: { loginPage: LoginPage; inventoryPage: InventoryPage };
}

// Расширяем базовые фикстуры Playwright
export const test = base.extend<AuthFixtures>({
  // Базовая фикстура для страницы логина
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate(URLS.LOGIN);
    await use(loginPage);
  },

  // Фикстура для страницы инвентаря
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  // Комплексная фикстура с предварительной авторизацией
  authPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.navigate(URLS.LOGIN);
    await loginPage.login(USERNAMES.STANDARD_USER, CREDENTIALS.PASSWORD);
    
    await use({ loginPage, inventoryPage });
  }
});

export { expect } from '@playwright/test';