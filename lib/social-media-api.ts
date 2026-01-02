import axios from 'axios';
import { prisma } from './prisma';
import { Platform } from '@prisma/client';

interface ProfileData {
  username: string;
  fullName?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  profilePicture?: string;
  isVerified?: boolean;
  secUid?: string;
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

export interface FetchPostsResult {
  posts: PostData[];
  nextCursor?: string;
}

export class SocialMediaAPI {
  private apiConfig: {
    key: string;
    instagramHost: string;
    tikTokHost: string;
    youTubeHost: string;
    lastFetched: number;
  } | null = null;

  private async getRapidApiConfig() {
    // Check in-memory cache (5 minutes)
    if (this.apiConfig && Date.now() - this.apiConfig.lastFetched < 5 * 60 * 1000) {
      return this.apiConfig;
    }

    // Fetch from DB
    const settings = await prisma.adminSettings.findFirst();
    
    // Fallback to env vars if not in DB
    const key = settings?.rapidApiKey || process.env.RAPIDAPI_KEY;
    const instagramHost = settings?.rapidApiInstagramHost || process.env.RAPIDAPI_INSTAGRAM_HOST || 'instagram120.p.rapidapi.com';
    const tikTokHost = 'tiktok-api23.p.rapidapi.com'; // Using specific host as requested
    const youTubeHost = settings?.rapidApiYouTubeHost || process.env.RAPIDAPI_YOUTUBE_HOST || 'youtube-data.p.rapidapi.com';

    this.apiConfig = {
      key: key || '',
      instagramHost,
      tikTokHost,
      youTubeHost,
      lastFetched: Date.now()
    };

    return this.apiConfig;
  }

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
      const data = cached.profileData as ProfileData;
      // Self-healing: if profile picture is invalid, invalidate cache
      if (data.profilePicture && (typeof data.profilePicture !== 'string' || data.profilePicture.includes('[object Object]'))) {
          console.log('Cached profile has invalid picture, refreshing...');
          return null;
      }
      return data;
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

  async fetchPosts(platform: Platform, username: string, cursor?: string): Promise<FetchPostsResult> {
    // Only check cache for initial page, and skip for Instagram to ensure we get fresh cursor for pagination
    if (!cursor && platform !== 'INSTAGRAM') {
      const cached = await prisma.socialProfile.findUnique({
        where: {
          platform_username: {
            platform,
            username: username.toLowerCase(),
          },
        },
      });

      if (cached && cached.posts && cached.expiresAt > new Date()) {
        return { posts: cached.posts as PostData[] };
      }
    }

    let result: FetchPostsResult;

    switch (platform) {
      case 'INSTAGRAM':
        result = await this.fetchInstagramPosts(username, cursor);
        break;
      case 'TIKTOK':
        result = await this.fetchTikTokVideos(username, cursor);
        break;
      case 'YOUTUBE':
        result = await this.fetchYouTubeVideos(username, cursor);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Update cache with posts (only for first page)
    if (!cursor) {
      const profileData = await this.getCachedProfile(platform, username) || {
        username,
      };
      await this.cacheProfile(platform, username, profileData, result.posts);
    }

    return result;
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

  // Helper to extract URL from potential object or array
  private extractUrl(source: any): string {
    if (!source) return '';
    if (typeof source === 'string') return source;
    if (Array.isArray(source)) return source[0] || '';
    if (typeof source === 'object') {
        return source.url_list ? (this.extractUrl(source.url_list)) : (source.url || '');
    }
    return '';
  }

  // Instagram Methods
  private async fetchInstagramProfile(username: string): Promise<ProfileData> {
    const config = await this.getRapidApiConfig();
    if (!config.key) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      // Fetch profile info using POST to /api/instagram/profile
      const profileResponse = await axios.post(
        `https://${config.instagramHost}/api/instagram/profile`,
        { username },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': config.key,
            'X-RapidAPI-Host': config.instagramHost,
          },
        }
      );
      
      const profileData = profileResponse.data.result;
      
      if (!profileData) {
         throw new Error('No profile data returned from API');
      }

      return {
        username: profileData.username || username,
        fullName: profileData.full_name,
        bio: profileData.biography,
        followerCount: profileData.edge_followed_by?.count || profileData.follower_count || 0,
        followingCount: profileData.edge_follow?.count || profileData.following_count || 0,
        postCount: profileData.edge_owner_to_timeline_media?.count || profileData.media_count || 0,
        profilePicture: this.extractUrl(profileData.profile_pic_url_hd) || this.extractUrl(profileData.profile_pic_url),
        isVerified: profileData.is_verified || false,
        isPrivate: profileData.is_private || false,
      };
    } catch (error: any) {
      console.error('Instagram API Error:', error.message);
      
      // MOCK DATA FALLBACK for Development/Testing when API is down/unsubscribed
      /*
      if (process.env.NODE_ENV === 'development' || error.response?.status === 403 || error.response?.status === 502) {
        console.log('Returning mock profile data');
        return {
          username: username,
          fullName: "Test User",
          bio: "This is a mock profile (API unavailable)",
          followerCount: 1234,
          followingCount: 567,
          postCount: 42,
          profilePicture: "https://via.placeholder.com/150",
          isVerified: false,
        };
      }
      */
      
      throw new Error(`Failed to fetch Instagram profile: ${error.message}`);
    }
  }

  private async fetchInstagramPosts(username: string, cursor?: string): Promise<FetchPostsResult> {
    const config = await this.getRapidApiConfig();
    if (!config.key) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      console.log(`Fetching Instagram posts for ${username} using ${config.instagramHost}/api/instagram/posts with cursor: ${cursor || 'none'}`);
      
      // Updated logic based on user provided PHP snippet: POST request to /api/instagram/posts
      const response = await axios.post(
        `https://${config.instagramHost}/api/instagram/posts`,
        {
          username: username,
          maxId: cursor || ''
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': config.key,
            'X-RapidAPI-Host': config.instagramHost,
          },
        }
      );

      // Debug logging
      console.log('Instagram Posts API Response Status:', response.status);
      
      // Attempt to parse response based on common structures from this API family
      let postsData = [];
      let nextCursor: string | undefined;
      
      if (Array.isArray(response.data)) {
        postsData = response.data;
      } else if (response.data?.result?.edges) {
        postsData = response.data.result.edges;
        if (response.data.result.page_info?.has_next_page) {
            nextCursor = response.data.result.page_info.end_cursor;
        }
      } else if (response.data?.data) {
        postsData = response.data.data;
      } else if (response.data?.items) {
        postsData = response.data.items;
      } else {
        console.log('Unknown response structure:', Object.keys(response.data));
      }

      const posts = postsData.map((item: any) => {
        // Handle different API structures (direct post object or edge/node structure)
        const post = item.node ? item.node : item;
        
        const shortcode = post.shortcode || post.code || post.id || post.pk;
        
        // Try to find the best quality image
        // Priority:
        // 1. image_versions2.candidates[0] (Highest quality usually)
        // 2. display_url (Standard fallback)
        // 3. thumbnail_url (Sometimes used)
        // 4. video_versions[0] (If it's a video and no image found)
        
        let thumbnail = '';
        
        if (post.image_versions2?.candidates?.length > 0) {
           thumbnail = post.image_versions2.candidates[0].url;
        } else if (post.carousel_media?.[0]?.image_versions2?.candidates?.length > 0) {
           // Handle carousel first item if main image is missing
           thumbnail = post.carousel_media[0].image_versions2.candidates[0].url;
        } else {
           thumbnail = post.display_url || 
                       post.thumbnail_url || 
                       post.video_versions?.[0]?.url ||
                       '';
        }
                         
        return {
          id: shortcode,
          url: `https://www.instagram.com/p/${shortcode}/`,
          thumbnail: thumbnail,
          caption: post.caption?.text || post.caption || '',
          likes: post.edge_media_preview_like?.count || post.like_count || 0,
          comments: post.edge_media_to_comment?.count || post.comment_count || 0,
          views: post.video_view_count || post.view_count || post.play_count || 0,
          timestamp: post.taken_at_timestamp || post.taken_at || post.timestamp,
        };
      });

      return { posts, nextCursor };

    } catch (error: any) {
      console.error('Instagram Posts API Error:', error.message);
      if (error.response) {
        console.error('Error details:', error.response.status, JSON.stringify(error.response.data));
      }
      return { posts: [] };
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
    const config = await this.getRapidApiConfig();
    if (!config.key) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      const response = await axios.get(
        `https://${config.tikTokHost}/api/user/info-with-region`,
        {
          params: { uniqueId: username.replace('@', '') },
          headers: {
            'X-RapidAPI-Key': config.key,
            'X-RapidAPI-Host': config.tikTokHost,
          },
        }
      );

      const data = response.data;
      
      // Check for soft errors (200 OK but with error message)
      if (data.code && data.code !== 0 && data.code !== 200) {
         // Treat specific codes as "Not Found" if we knew them, but for now generic error
         // If msg says "not found", throw specific error
         const msg = (data.msg || data.message || '').toLowerCase();
         if (msg.includes('not found') || msg.includes('doesn\'t exist')) {
            throw new Error('User not found');
         }
         throw new Error(data.msg || data.message || 'TikTok API returned error code');
      }

      // If we don't get a uniqueId or similar identifier, assume invalid response or user not found
      if (!data.data && !data.userInfo) {
          throw new Error('User not found or invalid response format');
      }

      let userData = data.data || data.userInfo || data;
      
      // Capture stats source before potentially reassigning userData
      const statsSource = data.stats || data.statsV2 || userData.stats;

      // Handle nested user object (e.g. data.userInfo.user or data.user)
      if (userData.user) {
        userData = userData.user;
      }

      // Handle nested stats object
      const statsData = statsSource || userData.stats || userData;

      return {
        username: userData.uniqueId || username,
        fullName: userData.nickname || userData.fullName,
        bio: userData.signature || userData.bio,
        followerCount: statsData.followerCount || userData.followerCount || 0,
        followingCount: statsData.followingCount || userData.followingCount || 0,
        postCount: statsData.videoCount || statsData.postCount || userData.videoCount || 0,
        profilePicture: this.extractUrl(userData.avatarThumb) || this.extractUrl(userData.avatarMedium) || this.extractUrl(userData.avatarLarger) || this.extractUrl(userData.avatar) || this.extractUrl(userData.profilePicture),
        isVerified: userData.verified || false,
        secUid: userData.secUid || userData.sec_uid,
      };
    } catch (error: any) {
      console.error('TikTok API Error:', error.message);
      if (error.response) {
        console.error('TikTok API Response:', error.response.data);
        
        // If the API explicitly returns 404, it means the user was not found
        if (error.response.status === 404) {
           throw new Error('User not found');
        }
      }

      // If we explicitly threw a "User not found" error above, rethrow it
      if (error.message && (
          error.message.includes('User not found') || 
          error.message.includes('invalid response format') ||
          error.message.includes('doesn\'t exist')
      )) {
          throw error;
      }

      // Only fallback for non-404 errors (likely API key issues, rate limits, or server errors)
      // This ensures we don't validate non-existent users when the API is actually working but just returning 404
      console.log('Using TikTok Fallback Profile due to API error (non-404)');
      return {
        username: username.replace('@', ''),
        fullName: "TikTok User",
        bio: "Profile details unavailable",
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        profilePicture: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7086326622432657414~c5_100x100.jpeg",
        isVerified: false,
      };
    }
  }

  private async fetchTikTokVideos(username: string, cursor?: string): Promise<FetchPostsResult> {
    const config = await this.getRapidApiConfig();
    if (!config.key) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      // Step 1: Get User Info to get the secUid
      // The posts endpoint requires secUid for reliable results
      let secUid: string | undefined;
      
      try {
        // We call the private method directly to ensure we get fresh data (skipping cache check in public fetchProfile)
        const profile = await this.fetchTikTokProfile(username);
        secUid = profile.secUid;
        if (secUid) {
            console.log(`Found secUid for ${username}: ${secUid}`);
        } else {
            console.warn(`No secUid found in profile for ${username}`);
        }
      } catch (e) {
        console.warn('Error fetching profile for secUid:', e);
      }

      // Step 2: Fetch posts using secUid (preferred) or uniqueId (fallback)
      const params: any = {
        count: 100, // Increased to 100 to show more posts
        cursor: cursor || '0'
      };

      if (secUid) {
        params.secUid = secUid;
      } else {
        params.uniqueId = username.replace('@', '');
      }
      
      console.log(`Fetching TikTok posts with params:`, params);

      const response = await axios.get(
        `https://${config.tikTokHost}/api/user/posts`,
        {
          params,
          headers: {
            'X-RapidAPI-Key': config.key,
            'X-RapidAPI-Host': config.tikTokHost,
          },
        }
      );

      const data = response.data;
      const videos = data.data?.itemList || data.data?.videos || data.itemList || data.videos || [];
      const nextCursor = data.data?.cursor || data.cursor;

      const posts = videos.map((video: any) => ({
        id: video.id || video.video_id || video.aweme_id,
        url: `https://www.tiktok.com/@${video.author?.uniqueId || username.replace('@', '')}/video/${video.id || video.video_id || video.aweme_id}`,
        thumbnail: this.extractUrl(video.video?.cover) || this.extractUrl(video.video?.originCover) || this.extractUrl(video.cover) || this.extractUrl(video.cover_url) || this.extractUrl(video.origin_cover),
        caption: video.title || video.desc || video.description,
        likes: Number(video.stats?.diggCount || video.stats?.likeCount || video.digg_count || video.statistics?.digg_count || 0),
        comments: Number(video.comment_count || video.statistics?.comment_count || 0),
        views: Number(video.stats?.playCount || video.stats?.viewCount || video.play_count || video.statistics?.play_count || 0),
        timestamp: video.create_time || video.createTime || 0,
      }));

      return { 
        posts,
        nextCursor: nextCursor ? String(nextCursor) : undefined
      };
    } catch (error: any) {
      console.error('TikTok Videos API Error:', error.message);
      return { posts: [] };
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
    const config = await this.getRapidApiConfig();
    if (!config.key) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      const response = await axios.get(
        `https://${config.youTubeHost}/channel/info`,
        {
          params: { 
            id: usernameOrId.startsWith('@') ? undefined : usernameOrId,
            username: usernameOrId.startsWith('@') ? usernameOrId.replace('@', '') : undefined,
          },
          headers: {
            'X-RapidAPI-Key': config.key,
            'X-RapidAPI-Host': config.youTubeHost,
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

  private async fetchYouTubeVideos(channelId: string, cursor?: string): Promise<FetchPostsResult> {
    const config = await this.getRapidApiConfig();
    if (!config.key) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    try {
      const response = await axios.get(
        `https://${config.youTubeHost}/channel/videos`,
        {
          params: { id: channelId, limit: 12 },
          headers: {
            'X-RapidAPI-Key': config.key,
            'X-RapidAPI-Host': config.youTubeHost,
          },
        }
      );

      const videos = response.data?.data || response.data?.videos || [];
      const posts = videos.map((video: any) => ({
        id: video.videoId || video.id,
        url: `https://www.youtube.com/watch?v=${video.videoId || video.id}`,
        thumbnail: video.thumbnail || video.thumbnails?.default?.url,
        caption: video.title,
        likes: video.likeCount || video.likes,
        comments: video.commentCount || video.comments,
        views: video.viewCount || video.views,
        timestamp: video.publishedAt || video.published_at,
      }));

      return { posts };
    } catch (error: any) {
      console.error('YouTube Videos API Error:', error.message);
      return { posts: [] };
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

