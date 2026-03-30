import { test, expect, Page } from '@playwright/test';
import {
  randAmount,
  randEmail,
  randFullName,
  randPassword,
} from '@ngneat/falso';

type User = {
  email: string;
  password: string;
  name: string;
};

test.describe('Client Management Flow', () => {
  /**
   * This function is to register a also login a user passed by param
   * @param page 
   * @param mockUser 
   */
  async function registerUserAndLogin(page: Page, mockUser: User) {
    await page.goto('http://localhost:5173/register');

    // Using explicit locators for better stability
    await page.getByPlaceholder('Qual seu nome:').fill(mockUser.name);
    await page.getByPlaceholder('Digite o seu email').fill(mockUser.email);
    await page.getByPlaceholder('Digite sua senha').fill(mockUser.password);
    await page.getByRole('button', { name: 'Registrar' }).click();
    await expect(page).toHaveURL(/.*login/);
    await page.getByPlaceholder('Digite o seu email').fill(mockUser.email);
    await page.getByPlaceholder('Digite sua senha').fill(mockUser.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/.*client/);
  }

  test('should register a new user and login', async ({ page }) => {
    const mockUser = {
      email: randEmail(),
      password: randPassword(),
      name: randFullName(),
    } satisfies User;

    // 1. Registration
    await page.goto('http://localhost:5173/register');

    // Using explicit locators for better stability
    await page.getByPlaceholder('Qual seu nome:').fill(mockUser.name);
    await page.getByPlaceholder('Digite o seu email').fill(mockUser.email);
    await page.getByPlaceholder('Digite sua senha').fill(mockUser.password);
    await page.getByRole('button', { name: 'Registrar' }).click();

    await expect(page).toHaveURL(/.*login/);

    // 2. Login
    await page.getByPlaceholder('Digite o seu email').fill(mockUser.email);
    await page.getByPlaceholder('Digite sua senha').fill(mockUser.password);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/.*client/);
    await expect(page.locator('nav')).toContainText(`Olá, ${mockUser.name}!`);
  });

  test('should create and then update a client', async ({ page }) => {
    const mockClient = {
      email: randEmail(),
      name: randFullName(),
      salary: randAmount().toString(),
      valuation: randAmount().toString(),
    };
    const clientNewName = randFullName();
    const mockUser = {
      email: randEmail(),
      password: randPassword(),
      name: randFullName(),
    } satisfies User;
    await registerUserAndLogin(page, mockUser);

    // 1. Open Insert Modal
    await page.getByRole('button', { name: 'Criar cliente' }).click();

    // Scoped locator for the modal
    const insertModal = page.getByTestId('insert-client-modal');
    await insertModal
      .getByPlaceholder('Digite o email:')
      .fill(mockClient.email);
    await insertModal.getByPlaceholder('Digite o nome:').fill(mockClient.name);
    await insertModal
      .getByPlaceholder('Digite o salário:')
      .fill(mockClient.salary);
    await insertModal
      .getByPlaceholder('Digite o valor da empresa:')
      .fill(mockClient.valuation);
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    // 2. Update the client
    await page.reload();
    await page.getByTestId(`${mockClient.email}-edit`).click();
    await page.getByPlaceholder('Digite o nome:').fill(clientNewName);
    await page.getByRole('button', { name: 'Atualizar' }).click();

    await page.reload();
    await expect(page.locator('body')).toContainText(clientNewName);
  });

  test('should navigate via Sidebar', async ({ page }) => {
    const mockUser = {
      email: randEmail(),
      password: randPassword(),
      name: randFullName(),
    } satisfies User;
    await registerUserAndLogin(page, mockUser);
    await page.goto('http://localhost:5173/client');

    // Open Sidebar
    await page.locator('nav svg').first().click();

    // Click "Clientes selecionados"
    await page.getByText('Clientes selecionados').click();
    await expect(page).toHaveURL(/.*client\/select/);

    // Logout
    await page.getByText('Logout').click();
    await expect(page).toHaveURL(/.*login/);
  });
});
