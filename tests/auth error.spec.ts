import { test, expect } from '@playwright/test';

test.describe('Неуспешная авторизация', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
    });
    test('Авторизация пользователя locked_out_user', async ({ page }) => {
        // Данные пользователя
        const blockedUser = {
            username: "locked_out_user",
            password: "secret_sauce"
        };

        // Авторизация
        await page.getByRole('textbox', { name: 'Username' }).fill(blockedUser.username);
        await page.getByRole('textbox', { name: 'Password' }).fill(blockedUser.password);
        await page.getByRole('button', { name: 'Login' }).click();

        // Проверка
        const error = page.locator('[data-test="error"]');
        await expect(error).toBeVisible();
        await expect(error).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    });
});























