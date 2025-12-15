import axios from 'axios';
import { prisma } from './prisma';
import { Platform } from '@prisma/client';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_INSTAGRAM_HOST = process.env.RAPIDAPI_INSTAGRAM_HOST || 'instagram-data1.p.rapidapi.com';
const RAPIDAPI_TIKTOK_HOST = process.env.RAPIDAPI_TIKTOK_HOST || 'tiktok-data.p.rapidapi.com';
const RAPIDAPI_YOUTUBE_HOST = process.env.RAPIDAPI_YOUTUBE_HOST || 'youtube-data.p.rapidapi.com';

interface ProfileData {
  username: string;
  fullName?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  profilePicture?: string;
  isVerified?: boolean;
  [key: string]: any;
}

interface PostData {
  id: string;
  url: string;
  thumbnail?: string;
  caption?: string;
  likes?: number;
  comments?: number;
  views?: number;
  timestamp?: string;
  [key: string]: any;
}

export class SocialMediaAPI {
  private getCacheKey(platform: Platform, username: string): string {
    return `${platform}:${username}`;
  }

  private async getCachedProfile(platform: Platform, username: string): Promise<ProfileData | null> {
    const cached = await prisma.socialProfile.findUnique({
      where: {
        platform_username: {
          platform,
          username: username.toLowerCase(),
        },
      },
    });

    if (cached && cached.expiresAt > new Date()) {
      return cached.profileData as ProfileData;
    }

    return null;
  }

  private async cacheProfile(
    platform: Platform,
    username: string,
    profileData: ProfileData,
    posts?: PostData[]
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Cache for 1 hour

    await prisma.socialProfile.upsert({
      where: {
        platform_username: {
          platform,
          username: username.toLowerCase(),
        },
      },
      update: {
        profileData: profileData as any,
        posts: posts ? (posts as any) : undefined,
        cachedAt: new Date(),
        expiresAt,
      },
      create: {
        platform,
        username: username.toLowerCase(),
        profileData: profileData as any,
        posts: posts ? (posts as any) : undefined,
        expiresAt,
      },
    });
  }

  async fetchProfile(platform: Platform, username: string): Promise<ProfileData> {
    // Check cache first
    const cached = await this.getCachedProfile(platform, username);
    if (cached) {
      return cached;
    }

    // Fetch from API based on platform
    let profileData: ProfileData;

    switch (platform) {
      case 'INSTAGRAM':
        profileData = await this.fetchInstagramProfile(username);
        break;
      case 'TIKTOK':
        profileData = await this.fetchTikTokProfile(username);
        break;
      case 'YOUTUBE':
        profileData = await this.fetchYouTubeChannel(username);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Cache the result
    await this.cacheProfile(platform, username, profileData);

    return profileData;
  }

  async fetchPosts(platform: Platform, username: string): Promise<PostData[]> {
    const cached = await prisma.socialProfile.findUnique({
      where: {
        platform_username: {
          platform,
          username: username.toLowerCase(),
        },
      },
    });

    if (cached && cached.posts && cached.expiresAt > new Date()) {
      return cached.posts as PostData[];
    }

    let posts: PostData[];

    switch (platform) {
      case 'INSTAGRAM':
        posts = await this.fetchInstagramPosts(username);
        break;
      case 'TIKTOK':
        posts = await this.fetchTikTokVideos(username);
        break;
      case 'YOUTUBE':
        posts = await this.fetchYouTubeVideos(username);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Update cache with posts
    const profileData = await this.getCachedProfile(platform, username) || {
      username,
    };
    await this.cacheProfile(platform, username, profileData, posts);

    return posts;
  }

  async validateUrl(platform: Platform, url: string): Promise<{ valid: boolean; id?: string; username?: string }> {
    try {
      switch (platform) {
        case 'INSTAGRAM':
          return this.validateInstagramUrl(url);
        case 'TIKTOK':
          return this.validateTikTokUrl(url);
        case 'YOUTUBE':
          return this.validateYouTubeUrl(url);
        default:
          return { valid: false };
      }
    } catch (error) {
      return { valid: false };
    }
  }

  // Instagram Methods
  private async fetchInstagramProfile(username: string): Promise<ProfileData> {
    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      const response = await axios.get(
        `https://${RAPIDAPI_INSTAGRAM_HOST}/user/info`,
        {
          params: { username },
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_INSTAGRAM_HOST,
          },
        }
      );

      const data = response.data;
      return {
        username: data.username || username,
        fullName: data.full_name,
        bio: data.biography,
        followerCount: data.edge_followed_by?.count || data.follower_count,
        followingCount: data.edge_follow?.count || data.following_count,
        postCount: data.edge_owner_to_timeline_media?.count || data.media_count,
        profilePicture: data.profile_pic_url_hd || data.profile_pic_url,
        isVerified: data.is_verified,
      };
    } catch (error: any) {
      console.error('Instagram API Error:', error.message);
      throw new Error(`Failed to fetch Instagram profile: ${error.message}`);
    }
  }

  private async fetchInstagramPosts(username: string): Promise<PostData[]> {
    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      const response = await axios.get(
        `https://${RAPIDAPI_INSTAGRAM_HOST}/user/posts`,
        {
          params: { username, limit: 12 },
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_INSTAGRAM_HOST,
          },
        }
      );

      const posts = response.data?.data || response.data || [];
      return posts.map((post: any) => ({
        id: post.shortcode || post.id,
        url: `https://www.instagram.com/p/${post.shortcode || post.id}/`,
        thumbnail: post.display_url || post.thumbnail_url,
        caption: post.caption?.text || post.caption,
        likes: post.edge_media_preview_like?.count || post.like_count,
        comments: post.edge_media_to_comment?.count || post.comment_count,
        timestamp: post.taken_at_timestamp || post.timestamp,
      }));
    } catch (error: any) {
      console.error('Instagram Posts API Error:', error.message);
      return [];
    }
  }

  private validateInstagramUrl(url: string): { valid: boolean; id?: string; username?: string } {
    const patterns = [
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return { valid: true, id: match[1] };
      }
    }

    const usernameMatch = url.match(/instagram\.com\/([A-Za-z0-9_.]+)/);
    if (usernameMatch && !usernameMatch[1].includes('/')) {
      return { valid: true, username: usernameMatch[1] };
    }

    return { valid: false };
  }

  // TikTok Methods
  private async fetchTikTokProfile(username: string): Promise<ProfileData> {
    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      const response = await axios.get(
        `https://${RAPIDAPI_TIKTOK_HOST}/user/info`,
        {
          params: { username: username.replace('@', '') },
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_TIKTOK_HOST,
          },
        }
      );

      const data = response.data;
      return {
        username: data.uniqueId || username,
        fullName: data.nickname,
        bio: data.signature,
        followerCount: data.followerCount || data.follower_count,
        followingCount: data.followingCount || data.following_count,
        postCount: data.videoCount || data.video_count,
        profilePicture: data.avatarLarger || data.avatar,
        isVerified: data.verified || false,
      };
    } catch (error: any) {
      console.error('TikTok API Error:', error.message);
      throw new Error(`Failed to fetch TikTok profile: ${error.message}`);
    }
  }

  private async fetchTikTokVideos(username: string): Promise<PostData[]> {
    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      const response = await axios.get(
        `https://${RAPIDAPI_TIKTOK_HOST}/user/videos`,
        {
          params: { username: username.replace('@', ''), limit: 12 },
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_TIKTOK_HOST,
          },
        }
      );

      const videos = response.data?.data || response.data?.videos || [];
      return videos.map((video: any) => ({
        id: video.id || video.aweme_id,
        url: `https://www.tiktok.com/@${username.replace('@', '')}/video/${video.id || video.aweme_id}`,
        thumbnail: video.cover || video.cover_url,
        caption: video.desc || video.description,
        likes: video.statistics?.digg_count || video.like_count,
        comments: video.statistics?.comment_count || video.comment_count,
        views: video.statistics?.play_count || video.view_count,
        timestamp: video.createTime || video.created_at,
      }));
    } catch (error: any) {
      console.error('TikTok Videos API Error:', error.message);
      return [];
    }
  }

  private validateTikTokUrl(url: string): { valid: boolean; id?: string; username?: string } {
    const videoMatch = url.match(/tiktok\.com\/@([^\/]+)\/video\/(\d+)/);
    if (videoMatch) {
      return { valid: true, id: videoMatch[2], username: videoMatch[1] };
    }

    const usernameMatch = url.match(/tiktok\.com\/@([^\/\?]+)/);
    if (usernameMatch) {
      return { valid: true, username: usernameMatch[1] };
    }

    return { valid: false };
  }

  // YouTube Methods
  private async fetchYouTubeChannel(usernameOrId: string): Promise<ProfileData> {
    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      const response = await axios.get(
        `https://${RAPIDAPI_YOUTUBE_HOST}/channel/info`,
        {
          params: { 
            id: usernameOrId.startsWith('@') ? undefined : usernameOrId,
            username: usernameOrId.startsWith('@') ? usernameOrId.replace('@', '') : undefined,
          },
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_YOUTUBE_HOST,
          },
        }
      );

      const data = response.data;
      return {
        username: data.customUrl || data.handle || usernameOrId,
        fullName: data.title || data.name,
        bio: data.description,
        followerCount: data.subscriberCount || data.subscriber_count,
        profilePicture: data.avatar || data.thumbnail,
        isVerified: data.verified || false,
      };
    } catch (error: any) {
      console.error('YouTube API Error:', error.message);
      throw new Error(`Failed to fetch YouTube channel: ${error.message}`);
    }
  }

  private async fetchYouTubeVideos(channelId: string): Promise<PostData[]> {
    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      const response = await axios.get(
        `https://${RAPIDAPI_YOUTUBE_HOST}/channel/videos`,
        {
          params: { id: channelId, limit: 12 },
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_YOUTUBE_HOST,
          },
        }
      );

      const videos = response.data?.data || response.data?.videos || [];
      return videos.map((video: any) => ({
        id: video.videoId || video.id,
        url: `https://www.youtube.com/watch?v=${video.videoId || video.id}`,
        thumbnail: video.thumbnail || video.thumbnails?.default?.url,
        caption: video.title,
        likes: video.likeCount || video.likes,
        comments: video.commentCount || video.comments,
        views: video.viewCount || video.views,
        timestamp: video.publishedAt || video.published_at,
      }));
    } catch (error: any) {
      console.error('YouTube Videos API Error:', error.message);
      return [];
    }
  }

  private validateYouTubeUrl(url: string): { valid: boolean; id?: string; username?: string } {
    const videoMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
    if (videoMatch) {
      return { valid: true, id: videoMatch[1] };
    }

    const channelMatch = url.match(/youtube\.com\/(?:channel\/|@)([^\/\?]+)/);
    if (channelMatch) {
      return { valid: true, username: channelMatch[1] };
    }

    return { valid: false };
  }
}

export const socialMediaAPI = new SocialMediaAPI();

