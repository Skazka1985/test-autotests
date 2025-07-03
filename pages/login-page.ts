import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator; // Добавляем локатор ошибки

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.locator('[data-test="error"]'); // Инициализируем локатор
    }

    // Существующий метод успешного логина
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    // Новый метод для проверки ошибки
    async verifyError(expectedText: string) {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toHaveText(expectedText);
    }

    // Метод для проверки стилей ошибки (если нужно)
    async verifyErrorStyles() {
        await expect(this.errorMessage).toHaveCSS('color', 'rgb(255, 255, 255)');
        await expect(this.errorMessage).toHaveCSS('background-color', 'rgba(226, 35, 26, 0.1)');
    }
}