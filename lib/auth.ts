"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// 実際の環境では、環境変数から取得するか、データベースに保存されたハッシュ値と比較するべきです
const ADMIN_PASSWORD = "admin123"

// セッションの有効期限（24時間）
const SESSION_EXPIRY = 24 * 60 * 60 * 1000

// この関数はAPIルートから直接呼び出されなくなりました
// 代わりにAPIルート内で直接パスワード検証とCookie設定を行います
export async function login(password: string) {
  if (password !== ADMIN_PASSWORD) {
    return { success: false, message: "パスワードが正しくありません" }
  }

  try {
    // セッションIDを生成（実際の環境ではより安全な方法を使用すべきです）
    const sessionId = Math.random().toString(36).substring(2, 15)
    const expires = new Date(Date.now() + SESSION_EXPIRY)

    // セッションCookieを設定
    cookies().set("session_id", sessionId, {
      expires,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // strictからlaxに変更して互換性を向上
    })

    return { success: true }
  } catch (error) {
    console.error("Login cookie setting error:", error)
    return { success: false, message: "セッションの設定中にエラーが発生しました" }
  }
}

export async function logout() {
  try {
    cookies().delete("session_id")
  } catch (error) {
    console.error("Logout error:", error)
  }
  redirect("/")
}

export async function checkAuth() {
  try {
    const sessionId = cookies().get("session_id")
    return !!sessionId
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }
}

