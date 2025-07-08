import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';
import { InventoryItemPage } from '../pages/inventory-item-page';
import { CartPage } from '../pages/cart-page';
import { CREDENTIALS, USERNAMES, URLS } from '../test-data';

interface AppFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  inventoryItemPage: InventoryItemPage;
  cartPage: CartPage;
  authenticatedState: { // Переименовываем authPage → authenticatedState
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage; // Добавляем cartPage
  };
}

export const test = base.extend<AppFixtures>({
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

  // Переименовываем authPage → authenticatedState и добавляем cartPage
  authenticatedState: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page); // Добавляем
    
    await loginPage.navigate(URLS.LOGIN);
    await loginPage.login(USERNAMES.STANDARD_USER, CREDENTIALS.PASSWORD);
    await inventoryPage.verifyInventoryPageIsOpened();
    
    await use({ loginPage, inventoryPage, cartPage }); // Теперь передаем все три страницы
  }
});

export { expect } from '@playwright/test';