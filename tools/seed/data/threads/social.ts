import type { ThreadTemplate } from "../../types";

/** LinkedIn, social media notifications (~8 threads) */
export const SOCIAL_THREADS: ThreadTemplate[] = [
  {
    id: "linkedin-jobs",
    subject: "3 new job recommendations for you",
    category: "social",
    contactId: "linkedin",
    messages: [
      {
        from: "linkedin",
        bodyHtml: "<p>Based on your profile, we think you'd be a great fit for:</p><ol><li><strong>Senior Frontend Engineer</strong> at Stripe - San Francisco, CA (Remote OK)</li><li><strong>Design Engineer</strong> at Vercel - Anywhere</li><li><strong>Staff Software Engineer</strong> at Linear - Remote</li></ol><p><a href='#'>View all recommendations</a></p><p>You also have 5 new profile views this week.</p>",
        bodyText: "Based on your profile: Senior Frontend Engineer at Stripe, Design Engineer at Vercel, Staff Software Engineer at Linear.",
        hoursAgo: 50,
        isRead: true,
      },
    ],
  },
  {
    id: "linkedin-endorsement",
    subject: "David Kim endorsed you for TypeScript",
    category: "social",
    contactId: "linkedin",
    messages: [
      {
        from: "linkedin",
        bodyHtml: "<p><strong>David Kim</strong> has endorsed you for <strong>TypeScript</strong>.</p><p>You now have 24 endorsements for this skill.</p><p><a href='#'>View your profile</a></p>",
        bodyText: "David Kim has endorsed you for TypeScript. You now have 24 endorsements for this skill.",
        hoursAgo: 96,
        isRead: true,
      },
    ],
  },
  {
    id: "linkedin-connection",
    subject: "Anna Kowalski wants to connect",
    category: "social",
    contactId: "linkedin",
    messages: [
      {
        from: "linkedin",
        bodyHtml: "<p><strong>Anna Kowalski</strong> sent you a connection request.</p><p>\"Hi! Was great chatting at the React meetup last week. Would love to stay in touch!\"</p><p><strong>Anna Kowalski</strong><br>VP of Engineering at TechFounders<br>500+ connections</p><p><a href='#'>Accept</a> | <a href='#'>Ignore</a></p>",
        bodyText: "Anna Kowalski sent a connection request: \"Great chatting at the React meetup. Would love to stay in touch!\"",
        hoursAgo: 36,
        isRead: false,
      },
    ],
  },
  {
    id: "linkedin-post-engagement",
    subject: "Your post is getting traction!",
    category: "social",
    contactId: "linkedin",
    messages: [
      {
        from: "linkedin",
        bodyHtml: "<p>Your post about <strong>\"Why I switched from Redux to Zustand\"</strong> is performing well:</p><ul><li><strong>2,847</strong> impressions</li><li><strong>142</strong> reactions</li><li><strong>28</strong> comments</li><li><strong>15</strong> reposts</li></ul><p>Top comment by <strong>Dan Abramov</strong>: \"Interesting perspective! Though I'd argue the comparison isn't quite apples to apples...\"</p><p><a href='#'>View post</a></p>",
        bodyText: "Your Redux vs Zustand post: 2,847 impressions, 142 reactions, 28 comments. Top comment by Dan Abramov.",
        hoursAgo: 72,
        isRead: true,
      },
    ],
  },
  {
    id: "twitter-trending",
    subject: "Trending in your network: React 20 announcement",
    category: "social",
    contactId: "twitter",
    messages: [
      {
        from: "twitter",
        bodyHtml: "<p>Trending topics in your network:</p><p><strong>#React20</strong> — 45.2K posts<br>React team announced the roadmap for React 20 with built-in signals support. The developer community has opinions.</p><p>Popular post from <strong>@dan_abramov</strong>:<br>\"Signals aren't replacing hooks. They're complementing them. Here's what this actually means...\"</p><p><a href='#'>See what's happening</a></p>",
        bodyText: "Trending: #React20 — React 20 roadmap with signals support. 45.2K posts. Dan Abramov: \"Signals aren't replacing hooks.\"",
        hoursAgo: 18,
        isRead: true,
      },
    ],
  },
  {
    id: "twitter-mention",
    subject: "@techwriter mentioned you in a tweet",
    category: "social",
    contactId: "twitter",
    messages: [
      {
        from: "twitter",
        bodyHtml: "<p><strong>@techwriter</strong> mentioned you:</p><blockquote>\"Just read @you's blog post on building accessible design systems. This is the kind of practical guide the industry needs. Bookmarked.\"</blockquote><p>12 likes, 3 retweets</p><p><a href='#'>View tweet</a></p>",
        bodyText: "@techwriter mentioned you: \"Just read your blog post on accessible design systems. Practical guide the industry needs.\"",
        hoursAgo: 55,
        isRead: true,
      },
    ],
  },
  {
    id: "instagram-activity",
    subject: "You have 3 new followers and 12 new likes",
    category: "social",
    contactId: "instagram",
    messages: [
      {
        from: "instagram",
        bodyHtml: "<p>Here's your weekly Instagram activity:</p><ul><li><strong>3 new followers</strong> this week</li><li><strong>12 new likes</strong> on your recent posts</li><li><strong>2 comments</strong> on your sunset photo</li></ul><p>Your most popular post this week got 47 likes.</p><p><a href='#'>Open Instagram</a></p>",
        bodyText: "Weekly activity: 3 new followers, 12 new likes, 2 comments. Most popular post: 47 likes.",
        hoursAgo: 40,
        isRead: true,
      },
    ],
  },
  {
    id: "linkedin-skill-assessment",
    subject: "Take the React.js Skill Assessment",
    category: "social",
    contactId: "linkedin",
    messages: [
      {
        from: "linkedin",
        bodyHtml: "<p>Stand out to recruiters!</p><p>Take the <strong>React.js Skill Assessment</strong> and earn a badge on your profile. Members with skill badges are 20% more likely to get hired.</p><p>Topics covered:</p><ul><li>Components and Props</li><li>Hooks and State Management</li><li>Performance Optimization</li><li>Testing</li></ul><p><a href='#'>Start assessment</a></p>",
        bodyText: "Take the React.js Skill Assessment and earn a badge. Members with badges are 20% more likely to get hired.",
        hoursAgo: 110,
        isRead: true,
      },
    ],
  },
];
