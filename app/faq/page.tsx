"use client"

import * as React from 'react'
import { useState } from 'react'
import { HelpCircle, User, Workflow, Bug, ShieldAlert, Headphones, Clock } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type FAQItem = {
  question: string;
  answer: string | string[];
  lastUpdated?: string;
  popular?: boolean;
}

type FAQCategory = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  items: FAQItem[];
}

export default function FAQPage() {
  // 検索機能がUIから削除されているため、searchQuery関連のロジックも不要
  
  // FAQデータを構造化
  const faqCategories: FAQCategory[] = [
    {
      id: "account",
      title: "アカウント・利用開始について",
      icon: <User className="h-6 w-6 text-purple-500" />,
      description: "アカウント作成、セットアップ、YouTubeとの連携に関する質問",
      items: [
        {
          question: "つべナビの利用を開始するには何が必要ですか？",
          answer: [
            "以下のものをご用意ください。",
            "- YouTube Data API Key",
            "- Webブラウザ（Chrome、Firefox、Safari、Edgeの最新版推奨）",
            "",
            "API Keyの取得方法は「YouTube APIキーの取得方法を教えてください」の項目をご覧ください。API Keyは設定画面で保存してください。"
          ],
          lastUpdated: "2025年4月20日",
          popular: true
        },
        {
          question: "YouTube APIキーの取得方法を教えてください",
          answer: [
            "YouTube APIキーの取得方法は以下の通りです。",
            "",
            "<a href=\"https://www.canva.com/design/DAGbkeCZFrM/ruembgqVMl4gXwpbdNLJfA/view?utm_content=DAGbkeCZFrM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h338a14344d\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 underline font-medium hover:text-blue-800\">→ APIキー取得ガイド（クリックで開く）</a>",
            "",
            "このガイドでは、Google Cloud ConsoleのUI変更（2024年4月）に対応した最新の手順で、プロジェクト作成から、YouTube Data APIの有効化、APIキーの作成、つべナビでの設定まで詳しく解説しています。"
          ],
          lastUpdated: "2025年4月20日"
        }
      ]
    },
    {
      id: "features",
      title: "機能・使い方について",
      icon: <Workflow className="h-6 w-6 text-indigo-500" />,
      description: "各機能の使い方、データ分析、レポート機能に関する質問",
      items: [
        {
          question: "動画のパフォーマンスはどのように分析されますか？",
          answer: [
            "つべナビでは主に以下の指標を用いて動画のパフォーマンスを分析します。",
            "- 視聴回数",
            "- 再生時間",
            "- 高評価数",
            "- コメント数"
          ],
          lastUpdated: "2025年4月20日",
          popular: true
        },
        {
          question: "データはどのくらいの頻度で更新されますか？",
          answer: "データはチャンネル検索を実行したタイミングで最新情報を取得します。最新のデータを確認したい場合は、チャンネルを再度検索してください。",
          lastUpdated: "2025年4月20日"
        },
        {
          question: "レポートの出力形式は？",
          answer: "現在はExcel形式でのデータ出力に対応しています。レポートには選択した期間のデータや主要な指標が含まれます。レポート出力は分析画面の右上にある「データ出力」ボタンから実行できます。",
          lastUpdated: "2025年4月20日"
        },
        {
          question: "API Keyはどこに保存されますか？",
          answer: "API Keyはブラウザのローカルストレージに保存されます。これにより、ブラウザを閉じて再度開いた場合でも、再入力する必要がありません。ただし、ブラウザのデータをクリアした場合は再設定が必要です。",
          lastUpdated: "2025年4月20日"
        },
        {
          question: "チャンネル情報はどこで確認できますか？",
          answer: "チャンネル検索後、チャンネル概要ページに移動します。ここで登録者数、総再生回数などの基本情報や、動画のパフォーマンスデータを確認できます。",
          lastUpdated: "2025年4月20日"
        },
        {
          question: "分析データをチームで共有する方法はありますか？",
          answer: "現在はExcel形式でのデータ出力機能を使用して、チームメンバーと分析データを共有いただけます。データ出力は分析画面の右上にある「データ出力」ボタンから実行できます。",
          lastUpdated: "2025年4月20日"
        }
      ]
    },
    {
      id: "troubleshooting",
      title: "トラブルシューティング",
      icon: <Bug className="h-6 w-6 text-red-500" />,
      description: "エラー解決、問題対処法に関する質問",
      items: [
        {
          question: "「APIキーが無効です」というエラーが表示されます",
          answer: [
            "以下の点をご確認ください。",
            "1. API Keyが正確にコピーされているか",
            "2. YouTube Data API v3が有効化されているか",
            "3. API Keyに適切な制限が設定されているか",
            "4. 使用量制限に達していないか"
          ],
          lastUpdated: "2025年4月20日",
          popular: true
        },
        {
          question: "データが表示されない、または一部のデータのみ表示されます",
          answer: [
            "以下の原因が考えられます。",
            "1. チャンネルのプライバシー設定で統計情報が非公開になっている",
            "2. チャンネルや動画が最近作成されたもので、データがまだ十分に蓄積されていない",
            "3. API制限に達している",
            "",
            "設定を確認し、時間をおいて再度お試しください。問題が解決しない場合はサポートまでご連絡ください。"
          ],
          lastUpdated: "2025年4月20日"
        },
        {
          question: "アプリケーションにアクセスできません",
          answer: [
            "以下の手順をお試しください。",
            "1. ブラウザのキャッシュとCookieをクリア",
            "2. 設定画面でAPI Keyが正しく設定されていることを確認",
            "3. 別のブラウザでアクセス",
            "",
            "これらの方法で解決しない場合は、サポートまでご連絡ください。"
          ],
          lastUpdated: "2025年4月20日"
        },
        {
          question: "API Keyを設定しましたが、「YouTube API Keyが必要です」というエラーが表示されます",
          answer: [
            "以下の点をご確認ください。",
            "1. 設定画面でAPI Keyを保存した後、ページをリロードしてみてください",
            "2. ブラウザのローカルストレージが有効になっていることを確認してください",
            "3. シークレットモードやプライベートブラウジングモードでは、API Keyが保存されない場合があります",
            "",
            "上記の方法で解決しない場合は、API Keyを再設定してください。"
          ],
          lastUpdated: "2025年4月20日"
        },
        {
          question: "「クォータを超えました」というエラーが表示されます",
          answer: [
            "YouTube Data APIの1日の利用制限（クォータ）に達した可能性があります。以下の対処法をお試しください。",
            "1. 翌日まで待つ（クォータは24時間ごとにリセットされます）",
            "2. 必要最小限の機能のみ使用する",
            "3. 別のAPI Keyを取得して設定する",
            "4. Google Cloud Consoleでクォータの引き上げを申請する（有料プランの場合）"
          ],
          lastUpdated: "2025年4月20日",
          popular: true
        }
      ]
    },
    {
      id: "security",
      title: "セキュリティ・プライバシー",
      icon: <ShieldAlert className="h-6 w-6 text-green-500" />,
      description: "データ保護、プライバシー設定に関する質問",
      items: [
        {
          question: "私のYouTubeアカウント情報は安全ですか？",
          answer: [
            "はい。つべナビは以下のセキュリティ対策を実施しています。",
            "- 必要最小限の権限のみを持つAPI Keyを使用",
            "- YouTubeアカウントの認証情報を保存しない",
            "- すべての通信はSSL/TLS暗号化で保護",
            "- データはAES-256暗号化で安全に管理",
            "- 定期的なセキュリティ監査の実施"
          ],
          lastUpdated: "2025年4月20日"
        },
        {
          question: "どのようなデータが保存されますか？",
          answer: "チャンネル情報、動画統計、分析結果などがセッションストレージに一時的に保存されます。API Keyはブラウザのローカルストレージに保存されます。個人を特定できる視聴者データは収集・保存しません。",
          lastUpdated: "2025年4月20日"
        }
      ]
    },
    {
      id: "support",
      title: "サポート",
      icon: <Headphones className="h-6 w-6 text-amber-500" />,
      description: "お問い合わせ、サポート情報に関する質問",
      items: [
        {
          question: "技術的な問題が発生した場合、どこに連絡すればよいですか？",
          answer: [
            "技術的な問題が発生した場合は、お問い合わせフォームからご連絡ください。",
            "お問い合わせフォーム: <a href=\"https://forms.gle/4dZsuKzmj4qzj6sN8\" target=\"_blank\" rel=\"noopener noreferrer\">https://forms.gle/4dZsuKzmj4qzj6sN8</a>",
            "受付時間: 平日10:00-18:00"
          ],
          lastUpdated: "2025年4月20日"
        },
        {
          question: "新機能のリクエストは可能ですか？",
          answer: "はい。フィードバックフォームから新機能のリクエストをお送りいただけます。多くのユーザーからリクエストがある機能は優先的に開発検討されます。",
          lastUpdated: "2025年4月20日"
        }
      ]
    }
  ];

  // 検索機能が削除されているため、常に全カテゴリを表示
  const filteredCategories = faqCategories;

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-6xl">
      {/* ヘッダーセクション */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text mb-6">
          よくある質問 (FAQ)
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          つべナビの利用に関するよくある質問と回答をまとめています。
          お探しの情報が見つからない場合は、検索機能をご利用いただくか、サポートまでお問い合わせください。
        </p>
      </div>

      {/* メインFAQセクション */}
      {/* 検索機能が削除されているため、常に全カテゴリを表示 */}
      <div className="space-y-12">
        {filteredCategories.map((category) => (
          <div key={category.id} id={category.id} className="scroll-mt-24">
            <div className="border-b border-gray-200 pb-2 mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                {category.icon}
                {category.title}
              </h2>
              <p className="text-muted-foreground mt-2">{category.description}</p>
            </div>

            <div className="space-y-4">
              {category.items.map((item, index) => (
                <Card key={index} className="border border-gray-200 overflow-hidden">
                  <details className="group" open={false}>
                    <summary className="list-none cursor-pointer">
                      <div className="flex justify-between items-start p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-3">
                          <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                            {item.question}
                          </h3>
                        </div>
                        <div className="h-5 w-5 flex-shrink-0 ml-4 transition-transform group-open:rotate-180">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        </div>
                      </div>
                    </summary>
                    <div className="p-5 pt-0 border-t border-gray-100">
                      <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                        {typeof item.answer === 'string' 
                          ? <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                          : <div dangerouslySetInnerHTML={{ __html: item.answer.join('\n') }} />}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          最終更新: {item.lastUpdated || '情報なし'}
                        </div>
                      </div>
                    </div>
                  </details>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* フッター */}
      <div className="mt-16 text-center border-t border-gray-200 pt-10">
        <p className="text-muted-foreground">
          その他のご質問がございましたら、<a href="https://forms.gle/4dZsuKzmj4qzj6sN8" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">お問い合わせフォーム</a>からお気軽にご連絡ください。
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          コンテンツ最終監査日: 2025年4月20日
        </p>
      </div>
    </div>
  )
} 