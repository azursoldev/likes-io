
const { socialMediaAPI } = require('./lib/social-media-api');

async function testFetch() {
  try {
    const username = 'alizahid2250';
    console.log(`Fetching posts for ${username}...`);
    const result = await socialMediaAPI.fetchTikTokVideos(username);
    console.log(`Fetched ${result.posts.length} posts.`);
    console.log('Next Cursor:', result.nextCursor);
    if (result.posts.length > 0) {
        console.log('First post:', result.posts[0].url);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testFetch();
