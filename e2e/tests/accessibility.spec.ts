import { test, expect } from '../fixtures/auth'
import AxeBuilder from '@axe-core/playwright'

test.describe('アクセシビリティテスト - WCAG 2.1 AA準拠確認', () => {
  test('ダッシュボードにアクセシビリティ違反がない', async ({ page }) => {
    await page.goto('/dashboard')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('設定ページにアクセシビリティ違反がない', async ({ page }) => {
    await page.goto('/settings')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('FAQページにアクセシビリティ違反がない', async ({ page }) => {
    await page.goto('/faq')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('コントラスト比が適切である', async ({ page }) => {
    await page.goto('/dashboard')

    // コントラスト比のチェック
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test.skip('キーボードナビゲーションが可能である', async ({ page }) => {
    await page.goto('/dashboard')

    // スキップリンクのテスト
    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: /メインコンテンツへスキップ/ })
    await expect(skipLink).toBeFocused()

    // メインコンテンツへの移動
    await page.keyboard.press('Enter')
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('ARIA属性が適切に設定されている', async ({ page }) => {
    await page.goto('/dashboard')

    // ARIAルールのチェック
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.aria'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
