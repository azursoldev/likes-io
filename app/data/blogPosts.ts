export type BlogPost = {
  id: string;
  slug: string;
  category: string;
  categoryColor?: string;
  title: string;
  description: string;
  content: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  date: string;
  publishedDate?: string;
  readTime: string;
  imageUrl?: string;
  featured?: boolean;
  sections?: Array<{
    id: string;
    title: string;
  }>;
};

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "the-2024-instagram-algorithm-deep-dive-for-creators",
    category: "DEEP DIVE",
    title: "The 2024 Instagram Algorithm: A Deep Dive for Creators",
    description: "Tired of guessing what works? We're pulling back the curtain on the Instagram algorithm. Learn about the key ranking signals for Reels, Stories, and the feed to maximize your reach.",
    author: "Olivia Chen",
    authorAvatar: "OC",
    authorBio: "Olivia is a social media strategist with over 8 years of experience helping brands and creators grow their presence on Instagram. She specializes in algorithm optimization and content strategy.",
    date: "September 5, 2024",
    publishedDate: "September 1, 2024",
    readTime: "8 min read",
    featured: true,
    sections: [
      { id: "core-principle", title: "Core Principle: It's All About User Interest" },
      { id: "ranking-signals", title: "Ranking Signals for the Main Feed" },
      { id: "reels-algorithm", title: "The Reels Algorithm: The Entertainment Engine" },
      { id: "stories-ranking", title: "How Stories Are Ranked" },
      { id: "faq", title: "Frequently Asked Questions" },
      { id: "checklist", title: "Actionable Checklist for 2024 Instagram Growth" },
    ],
    content: `
      <p>Tired of guessing what works? We're pulling back the curtain on the Instagram algorithm. Learn the key ranking signals for Reels, Stories, and the feed to maximize your reach.</p>

      <h2 id="core-principle">Core Principle: It's All About User Interest</h2>
      <p>The Instagram algorithm is fundamentally designed to predict and serve content that users will find interesting, engaging, and relevant. Every ranking signal feeds into this core mission.</p>
      <p>Instagram analyzes thousands of signals, but the most important ones include:</p>
      <ul>
        <li>User engagement history</li>
        <li>Content type preferences</li>
        <li>Time spent viewing content</li>
        <li>Relationship signals (accounts you interact with most)</li>
      </ul>

      <h2 id="ranking-signals">Ranking Signals for the Main Feed</h2>
      <p>For the main feed, Instagram prioritizes content based on several key factors:</p>
      <ul>
        <li><strong>Interest:</strong> How likely you are to care about the post based on past behavior</li>
        <li><strong>Recency:</strong> When the post was shared</li>
        <li><strong>Relationship:</strong> How often you interact with the account</li>
        <li><strong>Frequency:</strong> How often you open Instagram</li>
        <li><strong>Following:</strong> How many accounts you follow</li>
        <li><strong>Usage:</strong> How long you spend on Instagram</li>
      </ul>

      <h2 id="reels-algorithm">The Reels Algorithm: The Entertainment Engine</h2>
      <p>Reels have their own ranking system optimized for entertainment and discovery:</p>
      <ul>
        <li><strong>Watch time:</strong> How much of the Reel you watched</li>
        <li><strong>Completion rate:</strong> Did you watch until the end?</li>
        <li><strong>Likes, comments, and shares:</strong> Engagement signals</li>
        <li><strong>Audio trends:</strong> Using trending audio can boost reach</li>
        <li><strong>Creator engagement:</strong> Whether you follow or interact with the creator</li>
      </ul>
      <p><strong>Note:</strong> Unlike the feed, Reels prioritizes discovery over relationships, giving smaller creators a better chance to go viral.</p>

      <h2 id="stories-ranking">How Stories Are Ranked</h2>
      <p>Stories appear based on:</p>
      <ul>
        <li>Your interaction history with the account</li>
        <li>How recently the story was posted</li>
        <li>How often you view that account's stories</li>
        <li>Stickers and interactive elements (polls, questions) increase visibility</li>
      </ul>

      <h2 id="faq">Frequently Asked Questions</h2>
      <h3>Does posting at a specific time matter?</h3>
      <p>While timing can help, the algorithm is sophisticated enough that consistently good content will find its audience regardless of posting time. Focus on quality over timing.</p>

      <h3>Should I use hashtags?</h3>
      <p>Yes, but use them strategically. 5-10 relevant hashtags are more effective than 30 random ones. Mix popular and niche hashtags.</p>

      <h3>How does the algorithm handle shadowbanning?</h3>
      <p>Instagram doesn't officially "shadowban" accounts, but they may reduce reach for accounts that violate community guidelines or use inauthentic engagement tactics.</p>

      <h2 id="checklist">Actionable Checklist for 2024 Instagram Growth</h2>
      <ul>
        <li>✓ Post consistently (at least 3-4 times per week)</li>
        <li>✓ Create content that encourages saves and shares</li>
        <li>✓ Use trending audio for Reels</li>
        <li>✓ Engage authentically with your audience (reply to comments and DMs)</li>
        <li>✓ Experiment with different content formats (feed posts, Reels, Stories)</li>
        <li>✓ Analyze your insights to understand what resonates with your audience</li>
        <li>✓ Collaborate with other creators in your niche</li>
        <li>✓ Use interactive stickers in Stories to boost engagement</li>
      </ul>
    `,
  },
  {
    id: "2",
    slug: "5-content-pillars-every-successful-brand-needs-on-instagram",
    category: "Content Strategy",
    title: "5 Content Pillars Every Successful Brand Needs on Instagram",
    description: "Stop posting randomly. Discover how to build a powerful content strategy around 5 key pillars that will attract, engage, and convert your target audience.",
    author: "Benjamin Carter",
    authorAvatar: "BC",
    authorBio: "Benjamin is a content strategist who has helped over 200 brands develop winning Instagram strategies. He's passionate about helping businesses build authentic connections with their audience.",
    date: "September 2, 2024",
    publishedDate: "September 2, 2024",
    readTime: "6 min read",
    content: `<p>Stop posting randomly. Discover how to build a powerful content strategy around 5 key pillars that will attract, engage, and convert your target audience.</p>

      <h2>Why Content Pillars Matter</h2>
      <p>A content pillar strategy helps you maintain consistency while providing value to your audience. Here are the 5 essential pillars:</p>

      <h2>1. Educational Content</h2>
      <p>Teach your audience something valuable. Share tips, tutorials, and insights related to your industry.</p>

      <h2>2. Entertaining Content</h2>
      <p>Keep your audience engaged with fun, relatable, or humorous content that aligns with your brand voice.</p>

      <h2>3. Inspirational Content</h2>
      <p>Motivate your audience with success stories, behind-the-scenes content, or motivational quotes.</p>

      <h2>4. Promotional Content</h2>
      <p>Showcase your products or services, but balance this with other pillar content (aim for 20% promotional, 80% value-driven).</p>

      <h2>5. User-Generated Content</h2>
      <p>Share content created by your customers. This builds community and social proof.</p>
    `,
  },
  {
    id: "3",
    slug: "beyond-the-follower-count-the-real-power-of-social-proof",
    category: "Growth Hacking",
    title: "Beyond the Follower Count: The Real Power of Social Proof",
    description: "Why does social proof matter more than ever? Learn the psychology behind it and how to leverage likes and views to build trust and credibility with new visitors.",
    author: "Sophia Rodriguez",
    authorAvatar: "SR",
    authorBio: "Sophia is a marketing psychologist specializing in consumer behavior and social proof strategies. She helps brands understand and leverage psychological triggers for growth.",
    date: "August 28, 2024",
    publishedDate: "August 28, 2024",
    readTime: "5 min read",
    content: `<p>Why does social proof matter more than ever? Learn the psychology behind it and how to leverage likes and views to build trust and credibility with new visitors.</p>

      <h2>The Psychology of Social Proof</h2>
      <p>Humans are inherently social creatures who look to others for cues on how to behave. This psychological principle drives much of our decision-making online.</p>

      <h2>Types of Social Proof</h2>
      <p>There are several types of social proof that can influence your audience:</p>
      <ul>
        <li>Likes and engagement metrics</li>
        <li>Follower counts</li>
        <li>Testimonials and reviews</li>
        <li>User-generated content</li>
        <li>Celebrity or influencer endorsements</li>
      </ul>
    `,
  },
  {
    id: "4",
    slug: "from-1k-to-50k-followers-in-90-days-likes-io-case-study",
    category: "Case Study",
    title: "From 1k to 50k Followers in 90 Days: A Likes.io Case Study",
    description: "We break down the exact strategy a small e-commerce brand used, combining our services with organic tactics, to achieve explosive growth and a 200% increase in sales.",
    author: "Liam Goldberg",
    authorAvatar: "LG",
    authorBio: "Liam is a growth strategist who specializes in helping e-commerce brands scale their social media presence. He's worked with over 50 brands to achieve significant growth.",
    date: "August 21, 2024",
    publishedDate: "August 21, 2024",
    readTime: "7 min read",
    content: `<p>We break down the exact strategy a small e-commerce brand used, combining our services with organic tactics, to achieve explosive growth and a 200% increase in sales.</p>

      <h2>The Challenge</h2>
      <p>This e-commerce brand had great products but struggled with initial visibility on Instagram.</p>

      <h2>The Strategy</h2>
      <p>By combining strategic engagement boosts with consistent, high-quality content, they were able to break through the algorithm barrier.</p>

      <h2>The Results</h2>
      <p>In just 90 days, they achieved:</p>
      <ul>
        <li>49,000 new followers</li>
        <li>200% increase in sales</li>
        <li>10x improvement in organic reach</li>
      </ul>
    `,
  },
  {
    id: "5",
    slug: "is-your-instagram-bio-costing-you-followers-how-to-fix-it",
    category: "Profile Tips",
    title: "Is Your Instagram Bio Costing You Followers? How to Fix It.",
    description: "Your bio is your brand's elevator pitch. We provide a simple, effective template and tips to optimize your bio for maximum impact and follower conversion.",
    author: "Ava Nguyen",
    authorAvatar: "AN",
    authorBio: "Ava is a profile optimization expert who has helped hundreds of creators and brands optimize their Instagram presence for maximum conversion.",
    date: "August 15, 2024",
    publishedDate: "August 15, 2024",
    readTime: "4 min read",
    content: `<p>Your bio is your brand's elevator pitch. We provide a simple, effective template and tips to optimize your bio for maximum impact and follower conversion.</p>

      <h2>The Perfect Bio Template</h2>
      <p>Here's a proven structure that works for most brands:</p>
      <ol>
        <li>Hook (one compelling line)</li>
        <li>What you do (clear value proposition)</li>
        <li>Who you help (target audience)</li>
        <li>Call to action</li>
      </ol>
    `,
  },
  {
    id: "6",
    slug: "tiktok-vs-instagram-reels-where-should-you-focus-in-2024",
    category: "Platform Analysis",
    title: "TikTok vs. Instagram Reels: Where Should You Focus in 2024?",
    description: "The ultimate showdown. We analyze the pros, cons, and key audience differences between TikTok and Reels to help you decide where to invest your creative energy.",
    author: "Sophia Rodriguez",
    authorAvatar: "SR",
    authorBio: "Sophia is a marketing psychologist specializing in consumer behavior and social proof strategies. She helps brands understand and leverage psychological triggers for growth.",
    date: "August 11, 2024",
    publishedDate: "August 11, 2024",
    readTime: "6 min read",
    content: `<p>The ultimate showdown. We analyze the pros, cons, and key audience differences between TikTok and Reels to help you decide where to invest your creative energy.</p>

      <h2>TikTok: The Entertainment Powerhouse</h2>
      <p>TikTok excels at raw, authentic content and viral discovery.</p>

      <h2>Instagram Reels: The Integrated Ecosystem</h2>
      <p>Reels benefit from Instagram's larger ecosystem and better integration with other features.</p>
    `,
  },
  {
    id: "7",
    slug: "the-technical-side-of-trust-why-our-service-is-safe",
    category: "Security",
    title: "The Technical Side of Trust: Why Our Service is Safe",
    description: "Go behind the scenes with our Head of Technology to understand the secure methods we use to deliver engagement, ensuring your account's safety is always the top priority.",
    author: "Noah Kim",
    authorAvatar: "NK",
    authorBio: "Noah is the Head of Technology at Likes.io, with over 12 years of experience in secure platform development and account safety protocols.",
    date: "August 2, 2024",
    publishedDate: "August 2, 2024",
    readTime: "5 min read",
    content: `<p>Go behind the scenes with our Head of Technology to understand the secure methods we use to deliver engagement, ensuring your account's safety is always the top priority.</p>

      <h2>Our Security Protocols</h2>
      <p>We implement industry-leading security measures to protect your account.</p>

      <h2>No Password Required</h2>
      <p>We never ask for your password, using only your username and post links.</p>
    `,
  },
];

// Helper function to get a blog post by ID
export function getBlogPostById(id: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.id === id);
}

// Helper function to get a blog post by slug
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}

// Helper function to get all blog posts
export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

// Helper function to get featured blog post
export function getFeaturedBlogPost(): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.featured);
}

