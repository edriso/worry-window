import { expect, test } from '@playwright/test';

test('park worries, open a session early, clear and close', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const intro = page.getByText(/Park it here/);
  await expect(intro).toBeVisible();

  await page.getByLabel(/What's worrying you/).fill('the presentation');
  await page.getByRole('button', { name: 'Park worry' }).click();
  await expect(page.getByText('the presentation')).toBeVisible();

  await page.reload();
  await expect(page.getByText('the presentation')).toBeVisible();

  await page.getByRole('button', { name: 'Open worry time early' }).click();
  await expect(page.getByRole('heading', { name: 'This is the time.' })).toBeVisible();
  await page.clock.runFor(10 * 60 * 1000);
  await page.getByRole('button', { name: /Clear & close/ }).click();
  await expect(page.getByText(/Nothing parked/)).toBeVisible();
});
