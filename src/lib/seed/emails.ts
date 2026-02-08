/**
 * Email thread templates for seed data.
 * Each template defines a thread with one or more messages.
 */

export interface EmailTemplate {
  /** Index into CONTACT_TEMPLATES for the sender */
  contactIndex: number;
  subject: string;
  category: "primary" | "social" | "promotions" | "updates" | "forums";
  messages: Array<{
    /** Index into CONTACT_TEMPLATES. Use -1 for "self" (the session user). */
    fromContactIndex: number;
    bodyHtml: string;
    bodyText: string;
    /** Hours ago this was sent (relative to seed time) */
    hoursAgo: number;
    isRead: boolean;
  }>;
  isStarred?: boolean;
  isImportant?: boolean;
  labels?: string[];
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  // ─── Primary ─────────────────────────────────────────────────────
  {
    contactIndex: 0, // Sarah Chen
    subject: "Re: Code review for auth module",
    category: "primary",
    messages: [
      {
        fromContactIndex: -1,
        bodyHtml:
          "<p>Hey Sarah, can you take a look at the auth module PR when you get a chance? I refactored the token refresh logic and added retry handling.</p><p>PR link: <a href='#'>github.com/project/pull/87</a></p>",
        bodyText:
          "Hey Sarah, can you take a look at the auth module PR when you get a chance? I refactored the token refresh logic and added retry handling.",
        hoursAgo: 26,
        isRead: true,
      },
      {
        fromContactIndex: 0,
        bodyHtml:
          "<p>Hey, I left some comments on the PR. The token refresh logic looks good but I think we should add error handling for the edge case where the refresh token itself has expired. Also, the retry count should probably be configurable.</p><p>Other than that, nice refactor! The code is much cleaner now.</p>",
        bodyText:
          "Hey, I left some comments on the PR. The token refresh logic looks good but I think we should add error handling for the edge case where the refresh token itself has expired. Also, the retry count should probably be configurable. Other than that, nice refactor! The code is much cleaner now.",
        hoursAgo: 2,
        isRead: false,
      },
    ],
    isStarred: true,
    labels: ["Work"],
  },
  {
    contactIndex: 2, // Mom
    subject: "Grandma's recipe",
    category: "primary",
    messages: [
      {
        fromContactIndex: 2,
        bodyHtml:
          "<p>Hi sweetie!</p><p>I finally found grandma's old recipe book in the attic. Here's the chocolate cake recipe you asked about:</p><ul><li>2 cups flour</li><li>2 cups sugar</li><li>3/4 cup cocoa powder</li><li>2 tsp baking soda</li><li>1 tsp salt</li><li>2 eggs</li><li>1 cup buttermilk</li><li>1 cup hot coffee (grandma's secret!)</li><li>1/2 cup vegetable oil</li><li>2 tsp vanilla</li></ul><p>Bake at 350 for 30-35 minutes. The coffee is what makes it so moist!</p><p>Love you,<br>Mom</p>",
        bodyText:
          "Hi sweetie! I finally found grandma's old recipe book in the attic. Here's the chocolate cake recipe you asked about. The coffee is what makes it so moist! Love you, Mom",
        hoursAgo: 28,
        isRead: true,
      },
    ],
    isStarred: true,
  },
  {
    contactIndex: 1, // Alex Rivera
    subject: "Weekend plans?",
    category: "primary",
    messages: [
      {
        fromContactIndex: 1,
        bodyHtml:
          "<p>Hey! Are you free this Saturday? Thinking about checking out that new ramen place downtown. Let me know if you're in.</p><p>Also, did you see the new Dune trailer? Looks incredible.</p>",
        bodyText:
          "Hey! Are you free this Saturday? Thinking about checking out that new ramen place downtown. Let me know if you're in. Also, did you see the new Dune trailer? Looks incredible.",
        hoursAgo: 5,
        isRead: false,
      },
    ],
  },
  {
    contactIndex: 10, // David Kim
    subject: "Q1 planning doc - feedback needed",
    category: "primary",
    messages: [
      {
        fromContactIndex: 10,
        bodyHtml:
          "<p>Hi team,</p><p>I've put together the Q1 planning document with our proposed OKRs and project timeline. Would love everyone's feedback before the leadership review on Friday.</p><p>Key highlights:</p><ul><li>3 major feature launches planned</li><li>Performance improvements target: 40% faster page loads</li><li>Design system v2 rollout</li><li>Mobile app beta</li></ul><p>Doc link: <a href='#'>docs.google.com/planning-q1</a></p><p>Please add your comments directly in the doc. Let's sync Thursday to discuss.</p><p>Thanks,<br>David</p>",
        bodyText:
          "Hi team, I've put together the Q1 planning document with our proposed OKRs and project timeline. Would love everyone's feedback before the leadership review on Friday.",
        hoursAgo: 8,
        isRead: false,
      },
    ],
    isImportant: true,
    labels: ["Work"],
  },
  {
    contactIndex: 13, // Rachel Torres
    subject: "Re: Book recommendation",
    category: "primary",
    messages: [
      {
        fromContactIndex: -1,
        bodyHtml:
          "<p>Have you read anything good lately? I just finished Project Hail Mary and it was amazing.</p>",
        bodyText:
          "Have you read anything good lately? I just finished Project Hail Mary and it was amazing.",
        hoursAgo: 72,
        isRead: true,
      },
      {
        fromContactIndex: 13,
        bodyHtml:
          '<p>Oh I LOVED that book! Andy Weir is so good at making science accessible and fun.</p><p>I just finished "Tomorrow, and Tomorrow, and Tomorrow" by Gabrielle Zevin. It\'s about two friends who design video games together over decades. Sounds niche but it\'s really about creativity, friendship, and loss. Highly recommend!</p><p>Also started reading "The Three-Body Problem" - only 100 pages in but it\'s wild so far.</p>',
        bodyText:
          "Oh I LOVED that book! Andy Weir is so good at making science accessible and fun. I just finished Tomorrow, and Tomorrow, and Tomorrow by Gabrielle Zevin. Highly recommend!",
        hoursAgo: 48,
        isRead: true,
      },
      {
        fromContactIndex: -1,
        bodyHtml:
          "<p>Adding both to my list! Three-Body Problem has been on my radar forever. Let me know how it goes.</p>",
        bodyText:
          "Adding both to my list! Three-Body Problem has been on my radar forever. Let me know how it goes.",
        hoursAgo: 46,
        isRead: true,
      },
    ],
  },

  // ─── Updates ─────────────────────────────────────────────────────
  {
    contactIndex: 3, // GitHub
    subject: "[gmail-redesign] Pull request #42: Add compose modal",
    category: "updates",
    messages: [
      {
        fromContactIndex: 3,
        bodyHtml:
          "<p><strong>mergify[bot]</strong> commented on pull request <a href='#'>#42</a>:</p><p>This PR has been approved and will be merged automatically when all checks pass.</p><hr><p><strong>CI Status:</strong> All checks passed<br><strong>Reviews:</strong> 2 approved<br><strong>Merge method:</strong> Squash and merge</p>",
        bodyText:
          "mergify[bot] commented: This PR has been approved and will be merged automatically when all checks pass.",
        hoursAgo: 3,
        isRead: false,
      },
    ],
    labels: ["Work"],
  },
  {
    contactIndex: 4, // Jira
    subject: "[PROJ-1234] Sprint review meeting notes",
    category: "updates",
    messages: [
      {
        fromContactIndex: 4,
        bodyHtml:
          "<p><strong>Sprint 23 Review - Summary</strong></p><p>Completed:</p><ul><li>AUTH-89: Token refresh refactor</li><li>UI-234: Compose modal implementation</li><li>BUG-567: Fix thread sorting regression</li></ul><p>Carried over:</p><ul><li>PERF-12: Image lazy loading</li></ul><p>Velocity: 34 points (up from 29)</p><p>Next sprint starts Monday.</p>",
        bodyText:
          "Sprint 23 review completed. Key highlights: Authentication module shipped, 3 bugs fixed, velocity improved by 15%.",
        hoursAgo: 30,
        isRead: true,
      },
    ],
    labels: ["Work"],
  },
  {
    contactIndex: 7, // Chase Bank
    subject: "Your January statement is ready",
    category: "updates",
    messages: [
      {
        fromContactIndex: 7,
        bodyHtml:
          "<p>Dear Customer,</p><p>Your monthly statement for account ending in <strong>4829</strong> is now available.</p><table><tr><td>Statement Period:</td><td>Jan 1 - Jan 31, 2026</td></tr><tr><td>Previous Balance:</td><td>$3,245.67</td></tr><tr><td>Payments:</td><td>-$3,245.67</td></tr><tr><td>New Charges:</td><td>$2,891.34</td></tr><tr><td><strong>New Balance:</strong></td><td><strong>$2,891.34</strong></td></tr></table><p>Payment due: February 15, 2026</p><p><a href='#'>View full statement</a></p>",
        bodyText:
          "Your monthly statement for account ending in 4829 is now available. New Balance: $2,891.34. Payment due: February 15, 2026.",
        hoursAgo: 10,
        isRead: true,
      },
    ],
    labels: ["Finance"],
  },
  {
    contactIndex: 9, // Dr. Patel
    subject: "Appointment reminder - February 15",
    category: "updates",
    messages: [
      {
        fromContactIndex: 9,
        bodyHtml:
          "<p>Dear Patient,</p><p>This is a reminder that you have an appointment scheduled:</p><p><strong>Date:</strong> February 15, 2026<br><strong>Time:</strong> 2:00 PM<br><strong>Provider:</strong> Dr. Anita Patel<br><strong>Type:</strong> Annual checkup</p><p>Please arrive 10 minutes early. If you need to reschedule, please call us at (555) 123-4567 at least 24 hours in advance.</p><p>Patel Healthcare Associates</p>",
        bodyText:
          "Reminder: Appointment on February 15, 2026 at 2:00 PM with Dr. Anita Patel. Annual checkup. Please arrive 10 minutes early.",
        hoursAgo: 70,
        isRead: true,
      },
    ],
  },
  {
    contactIndex: 11, // Figma
    subject: "New comment on 'Dashboard Redesign v3'",
    category: "updates",
    messages: [
      {
        fromContactIndex: 11,
        bodyHtml:
          "<p><strong>Sarah Chen</strong> left a comment on <a href='#'>Dashboard Redesign v3</a>:</p><blockquote>\"Love the new card layout! Can we try a version with slightly more padding between the metric cards? Also, the chart colors might need adjustment for the dark theme.\"</blockquote><p><a href='#'>View in Figma</a></p>",
        bodyText:
          "Sarah Chen left a comment on Dashboard Redesign v3: Love the new card layout! Can we try a version with slightly more padding between the metric cards?",
        hoursAgo: 6,
        isRead: false,
      },
    ],
    labels: ["Work"],
  },
  {
    contactIndex: 14, // Vercel
    subject: "Deployment successful: gmail-redesign (production)",
    category: "updates",
    messages: [
      {
        fromContactIndex: 14,
        bodyHtml:
          "<p><strong>Deployment Summary</strong></p><p>Project: gmail-redesign<br>Environment: Production<br>Status: <span style='color: green'>Ready</span><br>URL: <a href='#'>gmail-redesign.vercel.app</a></p><p>Commit: <code>feat: add email list view with category tabs</code><br>Branch: main<br>Duration: 42s</p>",
        bodyText:
          "Deployment successful for gmail-redesign (production). Status: Ready. Duration: 42s.",
        hoursAgo: 4,
        isRead: true,
      },
    ],
  },

  // ─── Social ──────────────────────────────────────────────────────
  {
    contactIndex: 5, // LinkedIn
    subject: "3 new job recommendations for you",
    category: "social",
    messages: [
      {
        fromContactIndex: 5,
        bodyHtml:
          "<p>Based on your profile, we think you'd be a great fit for:</p><ol><li><strong>Senior Frontend Engineer</strong> at Stripe - San Francisco, CA (Remote OK)</li><li><strong>Design Engineer</strong> at Vercel - Anywhere</li><li><strong>Staff Software Engineer</strong> at Linear - Remote</li></ol><p><a href='#'>View all recommendations</a></p><p>You also have 5 new profile views this week.</p>",
        bodyText:
          "Based on your profile: Senior Frontend Engineer at Stripe, Design Engineer at Vercel, Staff Software Engineer at Linear.",
        hoursAgo: 50,
        isRead: true,
      },
    ],
  },
  {
    contactIndex: 5, // LinkedIn
    subject: "David Kim endorsed you for TypeScript",
    category: "social",
    messages: [
      {
        fromContactIndex: 5,
        bodyHtml:
          "<p><strong>David Kim</strong> has endorsed you for <strong>TypeScript</strong>.</p><p>You now have 24 endorsements for this skill.</p><p><a href='#'>View your profile</a></p>",
        bodyText:
          "David Kim has endorsed you for TypeScript. You now have 24 endorsements for this skill.",
        hoursAgo: 96,
        isRead: true,
      },
    ],
  },

  // ─── Promotions ──────────────────────────────────────────────────
  {
    contactIndex: 6, // Spotify
    subject: "Your 2025 Wrapped is here!",
    category: "promotions",
    messages: [
      {
        fromContactIndex: 6,
        bodyHtml:
          "<p>Your year in music is ready!</p><p><strong>42,000 minutes</strong> listened<br><strong>Top Artist:</strong> Radiohead<br><strong>Top Song:</strong> Everything In Its Right Place<br><strong>Top Genre:</strong> Alternative Rock<br><strong>Listening Personality:</strong> The Adventurer</p><p>You were in the top 2% of Radiohead listeners worldwide.</p><p><a href='#'>See your full Wrapped</a></p>",
        bodyText:
          "Your year in music: 42,000 minutes listened. Top Artist: Radiohead. Top Song: Everything In Its Right Place.",
        hoursAgo: 120,
        isRead: true,
      },
    ],
  },
  {
    contactIndex: 12, // Amazon
    subject: "Your order has shipped!",
    category: "promotions",
    messages: [
      {
        fromContactIndex: 12,
        bodyHtml:
          "<p>Great news! Your order has shipped.</p><p><strong>Order #112-4567890-1234567</strong></p><p>Mechanical Keyboard - Keychron Q1 Pro<br>Estimated delivery: <strong>February 10, 2026</strong></p><p><a href='#'>Track your package</a></p>",
        bodyText:
          "Your order has shipped! Mechanical Keyboard - Keychron Q1 Pro. Estimated delivery: February 10, 2026.",
        hoursAgo: 16,
        isRead: true,
      },
    ],
  },

  // ─── Forums ──────────────────────────────────────────────────────
  {
    contactIndex: 8, // The Verge
    subject: "Tech news: Apple's new design language",
    category: "forums",
    messages: [
      {
        fromContactIndex: 8,
        bodyHtml:
          "<p><strong>This week in tech:</strong></p><p>Apple unveiled a radical new design system at their developer conference, moving away from the flat aesthetic that has defined iOS for over a decade. The new \"Spatial Design\" language brings depth, texture, and physicality back to interfaces.</p><p>Google responded with updates to Material You, emphasizing adaptive color and dynamic theming. Meanwhile, Microsoft is quietly shipping Fluent 3 across its product line.</p><p>The design world is buzzing: are we entering a post-flat era?</p><p><a href='#'>Read the full story</a></p>",
        bodyText:
          "This week in tech: Apple unveils a radical new design system, Google responds with Material You updates, and why everyone is talking about the post-flat era.",
        hoursAgo: 55,
        isRead: true,
      },
    ],
  },

  // ─── More Primary (threads with depth) ───────────────────────────
  {
    contactIndex: 0, // Sarah Chen
    subject: "Design system meeting - action items",
    category: "primary",
    messages: [
      {
        fromContactIndex: 0,
        bodyHtml:
          "<p>Hey team, here are the action items from today's design system meeting:</p><ol><li><strong>Color tokens:</strong> Finalize the dark mode palette by EOW (assigned: you)</li><li><strong>Component audit:</strong> Review all Button variants for consistency (assigned: David)</li><li><strong>Documentation:</strong> Update Storybook with new spacing scale (assigned: me)</li><li><strong>Typography:</strong> Test Google Sans vs Inter rendering on Windows (assigned: Rachel)</li></ol><p>Next sync: Thursday 2pm. Let me know if I missed anything.</p>",
        bodyText:
          "Action items from design system meeting: 1. Finalize dark mode palette 2. Review Button variants 3. Update Storybook 4. Test font rendering on Windows.",
        hoursAgo: 52,
        isRead: true,
      },
      {
        fromContactIndex: -1,
        bodyHtml:
          "<p>Thanks Sarah! I'll have the dark mode palette ready by Wednesday. Quick question - are we going with the deep navy (#1a1a2e) or the cooler slate (#1e293b) for the base dark background?</p>",
        bodyText:
          "Thanks Sarah! I'll have the dark mode palette ready by Wednesday. Quick question - are we going with the deep navy or the cooler slate for the base dark background?",
        hoursAgo: 50,
        isRead: true,
      },
      {
        fromContactIndex: 0,
        bodyHtml:
          "<p>I'd lean toward the deep navy - it feels warmer and more distinctive. The slate is nice but reads a bit too \"default dark mode\". Let's see both in context though, maybe mock up a quick comparison?</p>",
        bodyText:
          "I'd lean toward the deep navy - it feels warmer and more distinctive. Let's see both in context though.",
        hoursAgo: 49,
        isRead: true,
      },
    ],
    labels: ["Work"],
  },

  // ─── Draft ───────────────────────────────────────────────────────
  {
    contactIndex: 1, // Alex (but this is a draft FROM self)
    subject: "Re: Weekend plans?",
    category: "primary",
    messages: [
      {
        fromContactIndex: -1,
        bodyHtml:
          "<p>Yeah I'm totally down for ramen! Saturday works. What time were you thinking? I'm free after 12.</p><p>And yes, the Dune trailer looks</p>",
        bodyText:
          "Yeah I'm totally down for ramen! Saturday works. What time were you thinking? I'm free after 12. And yes, the Dune trailer looks",
        hoursAgo: 1,
        isRead: true,
      },
    ],
  },
];

/**
 * Index of the draft template in EMAIL_TEMPLATES.
 * The last template is always the draft.
 */
export const DRAFT_TEMPLATE_INDEX = EMAIL_TEMPLATES.length - 1;
