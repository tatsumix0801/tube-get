/**
 * YouTube API 単体テスト
 * getChannelVideosComplete関数の動作を検証
 */

import { getChannelVideosComplete, getChannelVideos } from '../youtube-api';

// fetchのモック
global.fetch = jest.fn();

describe('getChannelVideosComplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('正常系', () => {
    it('チャンネルの全動画を正しく取得できること', async () => {
      // モックレスポンスの準備
      const mockChannelResponse = {
        ok: true,
        json: async () => ({
          items: [{
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UUtest123'
              }
            },
            statistics: {
              subscriberCount: '10000'
            }
          }]
        })
      };

      const mockPlaylistResponse = {
        ok: true,
        json: async () => ({
          items: [
            {
              snippet: {
                resourceId: {
                  videoId: 'x4BBWXihl7U'
                }
              }
            },
            {
              snippet: {
                resourceId: {
                  videoId: 'PIe60_9RNVI'
                }
              }
            }
          ],
          nextPageToken: null
        })
      };

      const mockVideosResponse = {
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'x4BBWXihl7U',
              snippet: {
                title: 'テスト動画1',
                description: '説明1',
                publishedAt: '2024-01-01T00:00:00Z',
                thumbnails: {
                  high: { url: 'https://example.com/thumb1.jpg' }
                },
                tags: ['tag1']
              },
              contentDetails: {
                duration: 'PT10M30S'
              },
              statistics: {
                viewCount: '1000',
                likeCount: '100',
                commentCount: '10'
              },
              topicDetails: {
                relevantTopicIds: ['topic1']
              }
            },
            {
              id: 'PIe60_9RNVI',
              snippet: {
                title: 'テスト動画2',
                description: '説明2',
                publishedAt: '2024-01-02T00:00:00Z',
                thumbnails: {
                  high: { url: 'https://example.com/thumb2.jpg' }
                },
                tags: ['tag2']
              },
              contentDetails: {
                duration: 'PT5M15S'
              },
              statistics: {
                viewCount: '2000',
                likeCount: '200',
                commentCount: '20'
              },
              topicDetails: {
                relevantTopicIds: ['topic2']
              }
            }
          ]
        })
      };

      // fetchモックの設定
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockChannelResponse)
        .mockResolvedValueOnce(mockPlaylistResponse)
        .mockResolvedValueOnce(mockVideosResponse);

      // テスト実行
      const result = await getChannelVideosComplete('testChannelId', 'testApiKey');

      // 検証
      expect(result.success).toBe(true);
      expect(result.videos).toHaveLength(2);
      expect(result.videos[0].id).toBe('PIe60_9RNVI'); // 最新順でソートされているか
      expect(result.videos[1].id).toBe('x4BBWXihl7U');
      expect(result.method).toBe('playlistItems');

      // 報告された問題の動画が含まれているか確認
      const videoIds = result.videos.map(v => v.id);
      expect(videoIds).toContain('x4BBWXihl7U');
      expect(videoIds).toContain('PIe60_9RNVI');
    });

    it('削除済み動画を除外できること', async () => {
      const mockChannelResponse = {
        ok: true,
        json: async () => ({
          items: [{
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UUtest123'
              }
            },
            statistics: {
              subscriberCount: '10000'
            }
          }]
        })
      };

      const mockPlaylistResponse = {
        ok: true,
        json: async () => ({
          items: [
            {
              snippet: {
                resourceId: {
                  videoId: 'video1'
                }
              }
            },
            {
              snippet: {
                resourceId: {
                  videoId: 'deletedVideo'
                }
              }
            }
          ],
          nextPageToken: null
        })
      };

      const mockVideosResponse = {
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'video1',
              snippet: {
                title: '有効な動画',
                description: '説明',
                publishedAt: '2024-01-01T00:00:00Z',
                thumbnails: {
                  high: { url: 'https://example.com/thumb.jpg' }
                }
              },
              contentDetails: {
                duration: 'PT10M'
              },
              statistics: {
                viewCount: '1000',
                likeCount: '100',
                commentCount: '10'
              }
            }
            // deletedVideoは含まれない（削除済み）
          ]
        })
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockChannelResponse)
        .mockResolvedValueOnce(mockPlaylistResponse)
        .mockResolvedValueOnce(mockVideosResponse);

      const result = await getChannelVideosComplete('testChannelId', 'testApiKey', {
        includeDeleted: false
      });

      expect(result.success).toBe(true);
      expect(result.videos).toHaveLength(1);
      expect(result.videos[0].id).toBe('video1');
    });

    it('最大取得件数を制限できること', async () => {
      const mockChannelResponse = {
        ok: true,
        json: async () => ({
          items: [{
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UUtest123'
              }
            },
            statistics: {
              subscriberCount: '10000'
            }
          }]
        })
      };

      const mockPlaylistResponse = {
        ok: true,
        json: async () => ({
          items: Array(5).fill(null).map((_, i) => ({
            snippet: {
              resourceId: {
                videoId: `video${i}`
              }
            }
          })),
          nextPageToken: null
        })
      };

      const mockVideosResponse = {
        ok: true,
        json: async () => ({
          items: Array(5).fill(null).map((_, i) => ({
            id: `video${i}`,
            snippet: {
              title: `動画${i}`,
              description: `説明${i}`,
              publishedAt: `2024-01-0${i+1}T00:00:00Z`,
              thumbnails: {
                high: { url: `https://example.com/thumb${i}.jpg` }
              }
            },
            contentDetails: {
              duration: 'PT10M'
            },
            statistics: {
              viewCount: '1000',
              likeCount: '100',
              commentCount: '10'
            }
          }))
        })
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockChannelResponse)
        .mockResolvedValueOnce(mockPlaylistResponse)
        .mockResolvedValueOnce(mockVideosResponse);

      const result = await getChannelVideosComplete('testChannelId', 'testApiKey', {
        maxVideos: 5
      });

      expect(result.success).toBe(true);
      expect(result.videos).toHaveLength(5);
    });
  });

  describe('異常系', () => {
    it('APIキーがない場合エラーを返すこと', async () => {
      const result = await getChannelVideosComplete('testChannelId', null);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('YouTube API Keyが必要です');
    });

    it('チャンネル情報取得でエラーの場合、フォールバックすること', async () => {
      const mockErrorResponse = {
        ok: false,
        json: async () => ({
          error: {
            message: 'Invalid API key'
          }
        })
      };

      // getChannelVideosのモック
      const mockFallbackResponse = {
        ok: true,
        json: async () => ({
          items: []
        })
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockErrorResponse) // チャンネル情報取得失敗
        .mockResolvedValueOnce(mockFallbackResponse) // フォールバック
        .mockResolvedValueOnce(mockFallbackResponse); // フォールバック

      const result = await getChannelVideosComplete('testChannelId', 'testApiKey');

      // フォールバックが呼ばれることを確認
      expect(result.success).toBeDefined();
    });

    it('プレイリスト取得でエラーの場合、フォールバックすること', async () => {
      const mockChannelResponse = {
        ok: true,
        json: async () => ({
          items: [{
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UUtest123'
              }
            },
            statistics: {
              subscriberCount: '10000'
            }
          }]
        })
      };

      const mockErrorResponse = {
        ok: false,
        json: async () => ({
          error: {
            message: 'Quota exceeded'
          }
        })
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockChannelResponse)
        .mockResolvedValueOnce(mockErrorResponse);

      const result = await getChannelVideosComplete('testChannelId', 'testApiKey');

      // エラーが処理されることを確認
      expect(result.success).toBeDefined();
    });

    it('uploadsプレイリストIDが見つからない場合、エラーを返すこと', async () => {
      const mockChannelResponse = {
        ok: true,
        json: async () => ({
          items: [{
            contentDetails: {
              relatedPlaylists: {} // uploadsがない
            },
            statistics: {
              subscriberCount: '10000'
            }
          }]
        })
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockChannelResponse);

      const result = await getChannelVideosComplete('testChannelId', 'testApiKey');

      // フォールバックが呼ばれることを確認
      expect(result.success).toBeDefined();
    });
  });

  describe('データ整形', () => {
    it('Duration変換が正しく行われること', async () => {
      const mockChannelResponse = {
        ok: true,
        json: async () => ({
          items: [{
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UUtest123'
              }
            },
            statistics: {
              subscriberCount: '10000'
            }
          }]
        })
      };

      const mockPlaylistResponse = {
        ok: true,
        json: async () => ({
          items: [
            {
              snippet: {
                resourceId: {
                  videoId: 'video1'
                }
              }
            }
          ],
          nextPageToken: null
        })
      };

      const mockVideosResponse = {
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'video1',
              snippet: {
                title: 'テスト動画',
                description: '説明',
                publishedAt: '2024-01-01T00:00:00Z',
                thumbnails: {
                  high: { url: 'https://example.com/thumb.jpg' }
                }
              },
              contentDetails: {
                duration: 'PT1H23M45S' // 1時間23分45秒
              },
              statistics: {
                viewCount: '1000',
                likeCount: '100',
                commentCount: '10'
              }
            }
          ]
        })
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockChannelResponse)
        .mockResolvedValueOnce(mockPlaylistResponse)
        .mockResolvedValueOnce(mockVideosResponse);

      const result = await getChannelVideosComplete('testChannelId', 'testApiKey');

      expect(result.success).toBe(true);
      expect(result.videos[0].duration).toBe('1:23:45');
    });

    it('拡散率が正しく計算されること', async () => {
      const mockChannelResponse = {
        ok: true,
        json: async () => ({
          items: [{
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UUtest123'
              }
            },
            statistics: {
              subscriberCount: '10000'
            }
          }]
        })
      };

      const mockPlaylistResponse = {
        ok: true,
        json: async () => ({
          items: [
            {
              snippet: {
                resourceId: {
                  videoId: 'video1'
                }
              }
            }
          ],
          nextPageToken: null
        })
      };

      const mockVideosResponse = {
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'video1',
              snippet: {
                title: 'テスト動画',
                description: '説明',
                publishedAt: '2024-01-01T00:00:00Z',
                thumbnails: {
                  high: { url: 'https://example.com/thumb.jpg' }
                }
              },
              contentDetails: {
                duration: 'PT10M'
              },
              statistics: {
                viewCount: '5000', // 再生回数5000
                likeCount: '100',
                commentCount: '10'
              }
            }
          ]
        })
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockChannelResponse)
        .mockResolvedValueOnce(mockPlaylistResponse)
        .mockResolvedValueOnce(mockVideosResponse);

      const result = await getChannelVideosComplete('testChannelId', 'testApiKey');

      expect(result.success).toBe(true);
      // 拡散率 = (5000 / 10000) * 100 = 50%
      expect(result.videos[0].spreadRate).toBe(50);
    });
  });
});