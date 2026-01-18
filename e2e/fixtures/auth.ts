import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * ログイン処理を実行
 */
async function login(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  // パスワード入力
  await page.locator('#password').waitFor({ state: 'visible', timeout: 15000 })
  await page.locator('#password').fill('admin123')

  // ログインボタンをクリック
  await page.getByRole('button', { name: 'ログイン' }).click()

  // ダッシュボードへのリダイレクトを待つ
  await page.waitForURL('**/dashboard', { timeout: 15000 })
  await page.waitForLoadState('domcontentloaded')
}

/**
 * 認証済みページへのアクセスを提供するフィクスチャ
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // ログイン処理
    await login(page)

    // テストでページを使用
    await use(page)
  },
})

export { expect }
