/**
 * YouTube Videos APIエンドポイント 統合テスト
 * modeパラメータの処理と後方互換性を検証
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { vi, type MockedFunction } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';
import * as youtubeApi from '@/lib/youtube-api';

// モジュールのモック
vi.mock('@/lib/youtube-api');

describe('GET /api/youtube/videos', () => {
  const mockGetChannelId = youtubeApi.getChannelId as MockedFunction<typeof youtubeApi.getChannelId>;
  // mockGetChannelVideos is removed - function no longer exists
  const mockGetChannelVideosComplete = youtubeApi.getChannelVideosComplete as MockedFunction<typeof youtubeApi.getChannelVideosComplete>;
  const mockCalculateChannelStats = youtubeApi.calculateChannelStats as MockedFunction<typeof youtubeApi.calculateChannelStats>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('パラメータ検証', () => {
    it('APIキーがない場合400エラーを返すこと', async () => {
      const request = new NextRequest('http://localhost:3000/api/youtube/videos?channelUrl=test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe('YouTube API Keyが必要です');
    });

    it('チャンネルURLがない場合400エラーを返すこと', async () => {
      const request = new NextRequest('http://localhost:3000/api/youtube/videos?apiKey=test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe('チャンネルURLが必要です');
    });
  });

  describe('modeパラメータの処理', () => {
    beforeEach(() => {
      mockGetChannelId.mockResolvedValue({
        success: true,
        channelId: 'testChannelId'
      });

      mockCalculateChannelStats.mockResolvedValue({
        success: true,
        stats: {
          totalVideos: 2,
          totalViews: 3000,
          avgViews: 1500,
          avgLikes: 150,
          avgComments: 15,
          avgSpreadRate: 50,
          mostViewedVideo: undefined as any,
          mostLikedVideo: undefined as any
        }
      });
    });

    it('mode=completeの場合、getChannelVideosCompleteを呼び出すこと', async () => {
      const mockVideos = [
        {
          id: 'x4BBWXihl7U',
          title: 'テスト動画1',
          description: '説明1',
          publishedAt: '2024-01-01T00:00:00Z',
          thumbnail: 'https://example.com/thumb1.jpg',
          duration: '10:30',
          viewCount: '1,000',
          likeCount: '100',
          commentCount: '10',
          spreadRate: 50,
          url: 'https://www.youtube.com/watch?v=x4BBWXihl7U',
          tags: ['tag1'],
          topics: ['topic1']
        },
        {
          id: 'PIe60_9RNVI',
          title: 'テスト動画2',
          description: '説明2',
          publishedAt: '2024-01-02T00:00:00Z',
          thumbnail: 'https://example.com/thumb2.jpg',
          duration: '5:15',
          viewCount: '2,000',
          likeCount: '200',
          commentCount: '20',
          spreadRate: 100,
          url: 'https://www.youtube.com/watch?v=PIe60_9RNVI',
          tags: ['tag2'],
          topics: ['topic2']
        }
      ];

      mockGetChannelVideosComplete.mockResolvedValue({
        success: true,
        videos: mockVideos,
        nextPageToken: null,
        totalResults: 2,
        method: 'playlistItems'
      } as any);

      const request = new NextRequest(
        'http://localhost:3000/api/youtube/videos?apiKey=testKey&channelUrl=@test&mode=complete'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(mockGetChannelVideosComplete).toHaveBeenCalledWith(
        'testChannelId',
        'testKey',
        '', // pageToken
        {
          maxVideos: 50,
          includeDeleted: false
        }
      );
      // expect(mockGetChannelVideos).not.toHaveBeenCalled(); // getChannelVideos関数は削除済み

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.videos).toHaveLength(2);
      
      // 報告された問題の動画が含まれているか確認
      const videoIds = data.videos.map((v: { id: string }) => v.id);
      expect(videoIds).toContain('x4BBWXihl7U');
      expect(videoIds).toContain('PIe60_9RNVI');
    });

    it.skip('mode=fastの場合、getChannelVideosを呼び出すこと', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mockVideos = [
        {
          id: 'video1',
          title: 'テスト動画',
          description: '説明',
          publishedAt: '2024-01-01T00:00:00Z',
          thumbnail: 'https://example.com/thumb.jpg',
          duration: '10:00',
          viewCount: '1,000',
          likeCount: '100',
          commentCount: '10',
          spreadRate: 50,
          url: 'https://www.youtube.com/watch?v=video1',
          tags: [],
          topics: []
        }
      ];

      // mockGetChannelVideos.mockResolvedValue({
      //   success: true,
      //   videos: mockVideos,
      //   nextPageToken: 'nextToken',
      //   totalResults: 100
      // });

      const request = new NextRequest(
        'http://localhost:3000/api/youtube/videos?apiKey=testKey&channelUrl=@test&mode=fast'
      );
      const response = await GET(request);
      const data = await response.json();

      // expect(mockGetChannelVideos).toHaveBeenCalledWith(
      //   'testChannelId',
      //   'testKey',
      //   '',
      //   50
      // );
      // expect(mockGetChannelVideosComplete).not.toHaveBeenCalled();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.videos).toHaveLength(1);
    });

    it('modeパラメータがない場合、デフォルトでcompleteモードを使用すること', async () => {
      const mockVideos = [
        {
          id: 'video1',
          title: 'テスト動画',
          description: '説明',
          publishedAt: '2024-01-01T00:00:00Z',
          thumbnail: 'https://example.com/thumb.jpg',
          duration: '10:00',
          viewCount: '1,000',
          likeCount: '100',
          commentCount: '10',
          spreadRate: 50,
          url: 'https://www.youtube.com/watch?v=video1',
          tags: [],
          topics: []
        }
      ];

      mockGetChannelVideosComplete.mockResolvedValue({
        success: true,
        videos: mockVideos,
        nextPageToken: null,
        totalResults: 1,
        method: 'playlistItems'
      } as any);

      const request = new NextRequest(
        'http://localhost:3000/api/youtube/videos?apiKey=testKey&channelUrl=@test'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(mockGetChannelVideosComplete).toHaveBeenCalled();
      // expect(mockGetChannelVideos).not.toHaveBeenCalled(); // getChannelVideos関数は削除済み

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('maxResultsパラメータが正しく処理されること', async () => {
      mockGetChannelVideosComplete.mockResolvedValue({
        success: true,
        videos: [],
        nextPageToken: null,
        totalResults: 0,
        method: 'playlistItems'
      } as any);

      const request = new NextRequest(
        'http://localhost:3000/api/youtube/videos?apiKey=testKey&channelUrl=@test&mode=complete&maxResults=100'
      );
      await GET(request);

      expect(mockGetChannelVideosComplete).toHaveBeenCalledWith(
        'testChannelId',
        'testKey',
        '', // pageToken
        {
          maxVideos: 100,
          includeDeleted: false
        }
      );
    });

    it.skip('pageTokenパラメータがfastモードで正しく処理されること', async () => {
      // mockGetChannelVideos.mockResolvedValue({
      //   success: true,
      //   videos: [],
      //   nextPageToken: null,
      //   totalResults: 0
      // });

      const request = new NextRequest(
        'http://localhost:3000/api/youtube/videos?apiKey=testKey&channelUrl=@test&mode=fast&pageToken=token123'
      );
      await GET(request);

      // expect(mockGetChannelVideos).toHaveBeenCalledWith(
      //   'testChannelId',
      //   'testKey',
      //   'token123',
      //   50
      // );
    });
  });

  describe('エラーハンドリング', () => {
    it('チャンネルID取得に失敗した場合、エラーを返すこと', async () => {
      mockGetChannelId.mockResolvedValue({
        success: false,
        message: 'チャンネルが見つかりません'
      });

      const request = new NextRequest(
        'http://localhost:3000/api/youtube/videos?apiKey=testKey&channelUrl=@invalid'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe('チャンネルが見つかりません');
    });

    it('動画取得に失敗した場合、エラーを返すこと', async () => {
      mockGetChannelId.mockResolvedValue({
        success: true,
        channelId: 'testChannelId'
      });

      mockGetChannelVideosComplete.mockResolvedValue({
        success: false,
        message: 'APIクォータを超過しました'
      });

      const request = new NextRequest(
        'http://localhost:3000/api/youtube/videos?apiKey=testKey&channelUrl=@test&mode=complete'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe('APIクォータを超過しました');
    });

    it('予期しないエラーの場合、500エラーを返すこと', async () => {
      mockGetChannelId.mockRejectedValue(new Error('Network error'));

      const request = new NextRequest(
        'http://localhost:3000/api/youtube/videos?apiKey=testKey&channelUrl=@test'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toBe('動画情報の取得中にエラーが発生しました');
    });
  });

  describe('統計情報の計算', () => {
    it('統計情報が正しく計算されること', async () => {
      mockGetChannelId.mockResolvedValue({
        success: true,
        channelId: 'testChannelId'
      });

      const mockVideos = [
        {
          id: 'video1',
          title: 'テスト動画1',
          viewCount: '1,000',
          likeCount: '100',
          commentCount: '10',
          spreadRate: 50
        },
        {
          id: 'video2',
          title: 'テスト動画2',
          viewCount: '2,000',
          likeCount: '200',
          commentCount: '20',
          spreadRate: 100
        }
      ];

      mockGetChannelVideosComplete.mockResolvedValue({
        success: true,
        videos: mockVideos,
        nextPageToken: null,
        totalResults: 2,
        method: 'playlistItems'
      } as any);

      mockCalculateChannelStats.mockResolvedValue({
        success: true,
        stats: {
          totalVideos: 2,
          totalViews: 3000,
          avgViews: 1500,
          avgLikes: 150,
          avgComments: 15,
          avgSpreadRate: 75,
          mostViewedVideo: mockVideos[1] as any,
          mostLikedVideo: mockVideos[1] as any
        }
      });

      const request = new NextRequest(
        'http://localhost:3000/api/youtube/videos?apiKey=testKey&channelUrl=@test&mode=complete'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(mockCalculateChannelStats).toHaveBeenCalledWith(mockVideos);
      expect(data.stats).toBeDefined();
      expect(data.stats.totalVideos).toBe(2);
      expect(data.stats.avgSpreadRate).toBe(75);
    });

    it('統計情報の計算に失敗してもレスポンスを返すこと', async () => {
      mockGetChannelId.mockResolvedValue({
        success: true,
        channelId: 'testChannelId'
      });

      mockGetChannelVideosComplete.mockResolvedValue({
        success: true,
        videos: [],
        nextPageToken: null,
        totalResults: 0,
        method: 'playlistItems'
      } as any);

      mockCalculateChannelStats.mockResolvedValue({
        success: false,
        message: '統計情報の計算に失敗しました'
      });

      const request = new NextRequest(
        'http://localhost:3000/api/youtube/videos?apiKey=testKey&channelUrl=@test&mode=complete'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.stats).toBeNull();
    });
  });
});
