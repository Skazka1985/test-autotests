import { test, expect } from '../fixtures/fixtures'; // Добавляем expect в импорт
import { USERNAMES, CREDENTIALS } from '../test-data';
import { URLS } from '../test-data';

test.describe('Тесты корзины', () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.inventoryPage.verifyInventoryPageIsOpened();
  });

  test('Добавление и удаление товара', async ({ inventoryPage, cartPage }) => {
    const ITEM_INDEX = 2;
    const itemName = await inventoryPage.getItemName(ITEM_INDEX);
    
    await inventoryPage.addItemToCart(ITEM_INDEX);
    await inventoryPage.verifyCartBadgeCount(1);
    
    await inventoryPage.goToCart();
    await cartPage.expectItemsCount(1);
    expect(await cartPage.getItemName(0)).toBe(itemName);
    
    await cartPage.removeItem(0);
    await cartPage.expectItemsCount(0);
    
    await cartPage.continueShopping();
    await inventoryPage.verifyCartBadgeNotVisible();
  });

  test('Добавление нескольких товаров', async ({ inventoryPage, cartPage }) => {
    const ITEMS = [0, 2, 4];
    
    for (const index of ITEMS) {
      await inventoryPage.addItemToCart(index);
    }
    
    await inventoryPage.verifyCartBadgeCount(ITEMS.length);
    await inventoryPage.goToCart();
    await cartPage.expectItemsCount(ITEMS.length);
  });

  test('Случайный товар', async ({ inventoryPage, cartPage }) => {
    const index = await inventoryPage.getRandomItemIndex();
    const itemName = await inventoryPage.getItemName(index);
    
    await inventoryPage.addItemToCart(index);
    await inventoryPage.goToCart();
    
    expect(await cartPage.getItemName(0)).toBe(itemName);
  });
});