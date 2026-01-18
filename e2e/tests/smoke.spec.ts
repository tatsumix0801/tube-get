import { test, expect } from '../fixtures/auth'

test.describe('スモークテスト - 主要ページ表示確認', () => {
  test('ダッシュボードが正常に表示される', async ({ page }) => {
    await page.goto('/dashboard')

    // ページタイトル確認
    await expect(page).toHaveTitle(/つべナビ/)

    // メインヘッダー確認（h1タグを指定）
    await expect(page.getByRole('heading', { name: 'つべナビ', level: 1 })).toBeVisible()

    // チャンネル分析セクション確認（h3タグを指定）
    await expect(page.getByRole('heading', { name: 'チャンネル分析', level: 3 })).toBeVisible()

    // 入力フォーム確認
    await expect(page.getByPlaceholder('https://www.youtube.com/channelname')).toBeVisible()

    // 分析ボタン確認
    await expect(page.getByRole('button', { name: /分析/ })).toBeVisible()
  })

  test('設定ページが正常に表示される', async ({ page }) => {
    await page.goto('/settings')

    // ページタイトル確認
    await expect(page).toHaveTitle(/つべナビ/)

    // 設定ヘッダー確認
    await expect(page.getByRole('heading', { name: /設定/i })).toBeVisible()

    // API Key設定セクション確認
    await expect(page.getByText('YouTube Data API Key')).toBeVisible()

    // API Key入力欄確認
    await expect(page.getByPlaceholder('YouTube Data API Keyを入力')).toBeVisible()

    // 保存ボタン確認
    await expect(page.getByRole('button', { name: /保存/ })).toBeVisible()
  })

  test('FAQページが正常に表示される', async ({ page }) => {
    await page.goto('/faq')

    // ページタイトル確認
    await expect(page).toHaveTitle(/つべナビ/)

    // FAQヘッダー確認
    await expect(page.getByRole('heading', { name: /よくある質問/i })).toBeVisible()

    // FAQ項目が存在することを確認（カテゴリヘッダーで確認）
    await expect(page.getByRole('heading', { name: /アカウント・利用開始について/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: /機能・使い方について/ })).toBeVisible()
  })

  test('スタイルガイドページが正常に表示される', async ({ page }) => {
    await page.goto('/styleguide')

    // ページタイトル確認
    await expect(page).toHaveTitle(/つべナビ/)

    // スタイルガイドヘッダー確認
    await expect(page.getByRole('heading', { name: /スタイルガイド/i })).toBeVisible()
  })

  test.skip('スキップリンクが機能する', async ({ page }) => {
    await page.goto('/dashboard')

    // Tabキーでスキップリンクにフォーカス
    await page.keyboard.press('Tab')

    // スキップリンクが表示されることを確認
    const skipLink = page.getByRole('link', { name: /メインコンテンツへスキップ/ })
    await expect(skipLink).toBeFocused()

    // Enterキーでメインコンテンツにジャンプ
    await page.keyboard.press('Enter')

    // メインコンテンツにフォーカスが移動したことを確認
    const mainContent = page.locator('#main-content')
    await expect(mainContent).toBeVisible()
  })
})
