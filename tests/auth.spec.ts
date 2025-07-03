import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';
import { CREDENTIALS, USERNAMES, URLS } from '../test-data';

test.describe('Успешная авторизация', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.navigate(URLS.LOGIN);
    });

    // Параметризованные тесты для обычных пользователей
    const standardUsers = [
        USERNAMES.STANDARD_USER,
        USERNAMES.PROBLEM_USER,
        USERNAMES.ERROR_USER,
        USERNAMES.VISUAL_USER
    ];

    for (const username of standardUsers) {
        test(`Авторизация пользователя ${username}`, async () => {
            await loginPage.login(username, CREDENTIALS.PASSWORD);
            await inventoryPage.verifySuccessfulLogin();
        });
    }

    // Тест для пользователя с задержкой
    test('Авторизация пользователя performance_glitch_user', async () => {
        const authDuration = await inventoryPage.measureLoginPerformance(
            () => loginPage.login(USERNAMES.PERF_USER, CREDENTIALS.PASSWORD)
        );
        
        console.log(`Время авторизации: ${authDuration}ms`);
        expect(authDuration).toBeGreaterThanOrEqual(4500);
        expect(authDuration).toBeLessThan(8000);

        await inventoryPage.openMenu();
        await inventoryPage.verifySuccessfulLogin();
    });
});