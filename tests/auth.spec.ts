// tests/auth.spec.ts
import { test, expect } from '../fixtures/fixtures.ts'; // Импортируем наши кастомные фикстуры
import { USERNAMES, CREDENTIALS, ERROR_MESSAGES } from '../test-data';

test.describe('Успешная авторизация', () => {
  // Параметризованные тесты для обычных пользователей
  const standardUsers = [
    USERNAMES.STANDARD_USER,
    USERNAMES.PROBLEM_USER,
    USERNAMES.ERROR_USER,
    USERNAMES.VISUAL_USER
  ];

  for (const username of standardUsers) {
    test(`Авторизация пользователя ${username}`, async ({ loginPage, inventoryPage }) => {
      await loginPage.login(username, CREDENTIALS.PASSWORD);
      await inventoryPage.verifySuccessfulLogin();
    });
  }

  // Тест для пользователя с задержкой
  test('Авторизация пользователя performance_glitch_user', async ({ loginPage, inventoryPage }) => {
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

test.describe('Неуспешная авторизация', () => {
  test('Авторизация заблокированного пользователя', async ({ loginPage }) => {
    await loginPage.login(USERNAMES.LOCKED_USER, CREDENTIALS.PASSWORD);
    await loginPage.verifyError(ERROR_MESSAGES.LOCKED_OUT);
  });

  test('Авторизация без логина', async ({ loginPage }) => {
    await loginPage.login('', CREDENTIALS.PASSWORD);
    await loginPage.verifyError(ERROR_MESSAGES.USERNAME_REQUIRED);
  });
});