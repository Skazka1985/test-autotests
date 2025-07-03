import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { USERNAMES, CREDENTIALS, ERROR_MESSAGES } from '../test-data'; // Импортируем ERROR_MESSAGES

test.describe('Неуспешная авторизация', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate('https://www.saucedemo.com/');
    });

    test('Авторизация заблокированного пользователя', async () => {
        // Используем константы из test-data
        await loginPage.login(USERNAMES.LOCKED_USER, CREDENTIALS.PASSWORD);
        
        // Используем сообщение об ошибке из test-data
        await loginPage.verifyError(ERROR_MESSAGES.LOCKED_OUT);
    });

    // Пример дополнительного теста для пустого логина
    test('Авторизация без логина', async () => {
        await loginPage.login('', CREDENTIALS.PASSWORD);
        await loginPage.verifyError(ERROR_MESSAGES.USERNAME_REQUIRED);
    });
});