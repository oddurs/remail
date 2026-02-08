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
  isSpam?: boolean;
  isTrash?: boolean;
  snoozeUntil?: string;
  labels?: string[];
  /** Thread-level AI summary — newline-separated bullet points */
  summary?: string;
  /** 2-3 suggested reply chips for the last message */
  suggestedReplies?: string[];
  /** AI category confidence 0.0–1.0 (default 0.95) */
  categoryConfidence?: number;
  /** AI priority score 0.0–1.0 (default 0.5) */
  priorityScore?: number;
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
    summary: "• Sarah reviewed auth module PR — token refresh looks good\n• Needs error handling for expired refresh tokens\n• Retry count should be configurable",
    suggestedReplies: ["Thanks for the review! I'll fix those.", "Good catch, will update the PR", "Agreed, let me make it configurable"],
    categoryConfidence: 0.97,
    priorityScore: 0.9,
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
    suggestedReplies: ["Thanks Mom! Can't wait to try it", "This looks amazing, making it this weekend!", "Love the coffee trick!"],
    categoryConfidence: 0.94,
    priorityScore: 0.6,
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
    suggestedReplies: ["Sounds great, I'm in!", "Let me check my calendar", "Can we do Saturday instead?"],
    categoryConfidence: 0.78,
    priorityScore: 0.7,
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
    suggestedReplies: ["I'll review it today", "Looks great, adding my comments now", "Can we discuss Thursday?"],
    categoryConfidence: 0.96,
    priorityScore: 0.85,
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
    summary: "• Rachel recommended 'Tomorrow, and Tomorrow, and Tomorrow' by Gabrielle Zevin\n• Also started 'The Three-Body Problem'\n• Both shared book recommendations after loving Project Hail Mary",
    categoryConfidence: 0.82,
    priorityScore: 0.4,
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
    categoryConfidence: 0.99,
    priorityScore: 0.7,
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
    categoryConfidence: 0.98,
    priorityScore: 0.4,
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
    categoryConfidence: 0.99,
    priorityScore: 0.5,
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
    categoryConfidence: 0.97,
    priorityScore: 0.5,
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
    categoryConfidence: 0.93,
    priorityScore: 0.65,
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
    categoryConfidence: 0.99,
    priorityScore: 0.45,
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
    categoryConfidence: 0.96,
    priorityScore: 0.3,
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
    categoryConfidence: 0.98,
    priorityScore: 0.2,
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
    categoryConfidence: 0.97,
    priorityScore: 0.2,
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
    labels: ["Receipts"],
    categoryConfidence: 0.92,
    priorityScore: 0.3,
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
    categoryConfidence: 0.95,
    priorityScore: 0.2,
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
    summary: "• Action items from design system meeting distributed\n• Dark mode palette debate: deep navy vs cooler slate\n• Sarah prefers deep navy — requested mockup comparison",
    suggestedReplies: ["I'll have the comparison ready by tomorrow", "Good point, let me mock both up", "Going with deep navy, will share today"],
    categoryConfidence: 0.95,
    priorityScore: 0.5,
  },

  // ─── Trash ──────────────────────────────────────────────────────
  {
    contactIndex: 8, // The Verge
    subject: "CES 2026: Everything announced this week",
    category: "forums",
    isTrash: true,
    categoryConfidence: 0.93,
    priorityScore: 0.15,
    messages: [
      {
        fromContactIndex: 8,
        bodyHtml:
          "<p><strong>CES 2026 Roundup</strong></p><p>It was a massive week in Las Vegas. Here's everything that mattered:</p><ul><li><strong>Samsung</strong> unveiled a rollable phone that extends from 6\" to 8\"</li><li><strong>Sony</strong> showed off PlayStation VR3 with full-body tracking</li><li><strong>John Deere</strong> (yes, really) announced an AI-powered autonomous mower</li><li><strong>LG</strong> demoed a transparent OLED TV you can see through when it's off</li></ul><p>The theme of the show? AI is in everything now — even your toaster.</p><p><a href='#'>Read the full roundup</a></p>",
        bodyText:
          "CES 2026 Roundup: Samsung rollable phone, Sony PS VR3, LG transparent OLED, and AI is in everything now — even your toaster.",
        hoursAgo: 168,
        isRead: true,
      },
    ],
  },
  {
    contactIndex: 5, // LinkedIn
    subject: "You appeared in 12 searches this week",
    category: "social",
    isTrash: true,
    categoryConfidence: 0.97,
    priorityScore: 0.15,
    messages: [
      {
        fromContactIndex: 5,
        bodyHtml:
          "<p>Hi Neil,</p><p>You appeared in <strong>12 searches</strong> this week.</p><p>Your profile was viewed by people at:</p><ul><li>Google</li><li>Stripe</li><li>Figma</li></ul><p>Tip: Adding a project to your Featured section can increase views by 3x.</p><p><a href='#'>See who viewed your profile</a></p>",
        bodyText:
          "You appeared in 12 searches this week. Your profile was viewed by people at Google, Stripe, Figma.",
        hoursAgo: 144,
        isRead: true,
      },
    ],
  },
  {
    contactIndex: 17, // Uber Eats
    subject: "Get 40% off your next order!",
    category: "promotions",
    isTrash: true,
    categoryConfidence: 0.99,
    priorityScore: 0.1,
    messages: [
      {
        fromContactIndex: 17,
        bodyHtml:
          "<p>We miss you, Neil! 🍔</p><p>It's been a while since your last order. Come back and enjoy <strong>40% off</strong> your next meal — up to $15 off.</p><p>Use code: <strong>COMEBACK40</strong></p><p>Valid through February 14, 2026. Min order $20.</p><p><a href='#'>Order now</a></p>",
        bodyText:
          "We miss you, Neil! It's been a while. Get 40% off your next meal. Use code: COMEBACK40. Valid through February 14, 2026.",
        hoursAgo: 72,
        isRead: true,
      },
    ],
  },

  // ─── Spam ──────────────────────────────────────────────────────
  {
    contactIndex: 18, // Prince Abubakar Tunde
    subject: "URGENT: $47.5 Million USD Transfer - Your Assistance Required",
    category: "promotions",
    isSpam: true,
    categoryConfidence: 0.99,
    priorityScore: 0.1,
    messages: [
      {
        fromContactIndex: 18,
        bodyHtml:
          "<p>Dear Beloved Friend,</p><p>I am <strong>Prince Abubakar Tunde</strong>, the cousin of Nigerian Astronaut, Air Force Major Abubakar Tunde. He is the first African in space and he has been stuck on the Soviet International Space Station since 1990.</p><p>We need <strong>$47.5 Million USD</strong> to fund a rescue mission. If you can provide your bank details to facilitate the transfer, you will receive <strong>20% ($9.5M)</strong> as a commission.</p><p>Please respond with UTMOST URGENCY as time is of the essence.</p><p>Yours faithfully,<br>Prince Abubakar Tunde</p>",
        bodyText:
          "Dear Beloved Friend, I am Prince Abubakar Tunde. We need $47.5 Million USD to fund a rescue mission. You will receive 20% as commission. Please respond with UTMOST URGENCY.",
        hoursAgo: 36,
        isRead: false,
      },
    ],
  },
  {
    contactIndex: 19, // Digital Growth Experts
    subject: "Your website is LOSING money every day!!!",
    category: "promotions",
    isSpam: true,
    categoryConfidence: 0.99,
    priorityScore: 0.1,
    messages: [
      {
        fromContactIndex: 19,
        bodyHtml:
          "<p>Hi there,</p><p>I was looking at your website and I noticed some CRITICAL issues with your SEO that are costing you THOUSANDS of dollars every single day!!!</p><p>Our team of EXPERT analysts found:</p><ul><li>❌ 47 broken backlinks</li><li>❌ Missing meta descriptions on 12 pages</li><li>❌ Page speed score of 23/100</li><li>❌ You're INVISIBLE on Google!!!</li></ul><p>We can fix ALL of this for a special one-time price of $299 (normally $2,999).</p><p>ACT NOW - this offer expires in 24 HOURS!!!</p><p>Digital Growth Experts<br>Guaranteed Page 1 Rankings*</p>",
        bodyText:
          "I was looking at your website and found CRITICAL SEO issues costing you THOUSANDS. 47 broken backlinks, missing meta descriptions. Special price $299. ACT NOW!",
        hoursAgo: 24,
        isRead: false,
      },
    ],
  },
  {
    contactIndex: 19, // Digital Growth Experts
    subject: "Congratulations!! You've been selected as our WINNER 🎉🎉🎉",
    category: "promotions",
    isSpam: true,
    categoryConfidence: 0.99,
    priorityScore: 0.1,
    messages: [
      {
        fromContactIndex: 19,
        bodyHtml:
          "<p>🎉🎉🎉 CONGRATULATIONS!!! 🎉🎉🎉</p><p>You have been RANDOMLY SELECTED as the <strong>GRAND PRIZE WINNER</strong> of our monthly giveaway!</p><p>Your prize: <strong>Apple MacBook Pro M4 Max (64GB)</strong></p><p>To claim your prize, simply:</p><ol><li>Click the link below</li><li>Enter your shipping address</li><li>Pay a small $4.99 processing fee</li></ol><p><a href='#'>CLAIM YOUR PRIZE NOW!!!</a></p><p>⚠️ You have 48 hours to claim or your prize will be given to someone else!</p>",
        bodyText:
          "CONGRATULATIONS! You have been RANDOMLY SELECTED as the GRAND PRIZE WINNER! Prize: MacBook Pro M4 Max. Click to claim. Pay $4.99 processing fee. 48 hours to claim!",
        hoursAgo: 12,
        isRead: false,
      },
    ],
  },

  // ─── Snoozed ───────────────────────────────────────────────────
  {
    contactIndex: 7, // Chase Bank
    subject: "Payment reminder: Account ending 4829",
    category: "updates",
    snoozeUntil: "+5d",
    labels: ["Finance"],
    categoryConfidence: 0.99,
    priorityScore: 0.7,
    messages: [
      {
        fromContactIndex: 7,
        bodyHtml:
          "<p>Dear Customer,</p><p>This is a friendly reminder that your payment of <strong>$2,891.34</strong> for account ending in <strong>4829</strong> is due on <strong>February 15, 2026</strong>.</p><p>To avoid late fees, please ensure your payment is received by the due date.</p><p><a href='#'>Make a payment</a> | <a href='#'>Set up AutoPay</a></p><p>Thank you for being a valued Chase customer.</p>",
        bodyText:
          "Reminder: Payment of $2,891.34 for account ending 4829 is due February 15, 2026. Make a payment or set up AutoPay to avoid late fees.",
        hoursAgo: 18,
        isRead: true,
      },
    ],
  },
  {
    contactIndex: 20, // Marcus Johnson
    subject: "LAN party this weekend??",
    category: "primary",
    snoozeUntil: "+2d",
    suggestedReplies: ["Count me in! What should I bring?", "Sounds fun but can't this weekend", "Rocket League, yes! I'm in"],
    categoryConfidence: 0.75,
    priorityScore: 0.6,
    messages: [
      {
        fromContactIndex: 20,
        bodyHtml:
          "<p>Yo Neil!</p><p>Remember those all-night LAN parties we used to have in college? I'm trying to get the squad back together this weekend. Got my garage set up with like 6 monitors and a mini fridge full of Mountain Dew. Very 2005 vibes.</p><p>So far confirmed:</p><ul><li>Me</li><li>Jake</li><li>Priya</li></ul><p>We're thinking Saturday starting at 7pm. Bring your rig or I have a spare laptop. Games TBD but definitely some Rocket League and maybe Factorio if we're feeling ambitious.</p><p>You in?? 🎮</p>",
        bodyText:
          "Remember those LAN parties from college? Getting the squad together this weekend. My garage, Saturday at 7pm. Bring your rig. Rocket League and Factorio. You in??",
        hoursAgo: 14,
        isRead: false,
      },
    ],
  },

  // ─── Starred + Personal ────────────────────────────────────────
  {
    contactIndex: 15, // Dad
    subject: "Proud of you, kid",
    category: "primary",
    isStarred: true,
    labels: ["Personal"],
    suggestedReplies: ["Thanks Dad! Italian place sounds perfect", "Love you too, Dad! Let's do Saturday", "Ha! The dinosaur website was a masterpiece"],
    categoryConfidence: 0.94,
    priorityScore: 0.8,
    messages: [
      {
        fromContactIndex: 15,
        bodyHtml:
          "<p>Hey Neil,</p><p>Your mom told me about the promotion. Senior Engineer! I don't fully understand what you do with all that computer stuff (something about \"reacting\" to things?) but I know it's important and I know you work really hard at it.</p><p>I still remember when you were 8 and you made that little website about dinosaurs on our old Dell. The one with the Comic Sans and the spinning globe GIF. I printed it out and it's still in my desk drawer, believe it or not.</p><p>Anyway, I just wanted to say I'm really proud of you. You've come a long way from that dinosaur website (though I thought it was pretty good).</p><p>Let's get dinner this weekend to celebrate? Mom wants to go to that Italian place you like.</p><p>Love,<br>Dad</p><p>P.S. Can you help me figure out why my printer only prints in blue? Your mom thinks it's broken but I think it's a setting.</p>",
        bodyText:
          "Hey Neil, your mom told me about the promotion. Senior Engineer! I still remember when you were 8 and made that dinosaur website. I'm really proud of you. Let's get dinner to celebrate?",
        hoursAgo: 36,
        isRead: true,
      },
    ],
  },
  {
    contactIndex: 2, // Mom
    subject: "Thanksgiving plans",
    category: "primary",
    isStarred: true,
    labels: ["Personal"],
    summary: "• Coming home for Thanksgiving — flying in Wednesday, leaving Sunday\n• Bringing mushroom Wellington instead of tofurkey\n• Dad will pick up from airport — need to send flight details",
    categoryConfidence: 0.85,
    priorityScore: 0.6,
    messages: [
      {
        fromContactIndex: 2,
        bodyHtml:
          "<p>Hi sweetie!</p><p>It's not too early to start thinking about Thanksgiving! Dad and I were wondering if you're planning to come home this year. Uncle Jerry and Aunt Lisa are coming too, and they're bringing the grandkids.</p><p>Also, are you still doing that vegetarian thing? I need to know for the menu. Last year I made that tofurkey and nobody ate it except you (and I think you were just being polite).</p><p>Let me know your plans when you can!</p><p>Love,<br>Mom</p>",
        bodyText:
          "Hi sweetie! Not too early to think about Thanksgiving. Are you coming home? Uncle Jerry and Aunt Lisa are coming. Are you still doing that vegetarian thing? Love, Mom",
        hoursAgo: 40,
        isRead: true,
      },
      {
        fromContactIndex: -1,
        bodyHtml:
          "<p>Hi Mom! Yes I'm definitely coming home for Thanksgiving! I'll fly in Wednesday night and leave Sunday.</p><p>And yes, still vegetarian 😄 but you really don't need to make a tofurkey. I'll bring a dish! I've been making this really good mushroom Wellington that I think everyone will like.</p><p>Can't wait to see everyone!</p>",
        bodyText:
          "Yes I'm definitely coming home for Thanksgiving! I'll fly in Wednesday night. Still vegetarian but I'll bring a mushroom Wellington. Can't wait!",
        hoursAgo: 38,
        isRead: true,
      },
      {
        fromContactIndex: 2,
        bodyHtml:
          "<p>Wonderful!! That mushroom thing sounds fancy. Dad says he'll pick you up from the airport — just send us your flight details when you book.</p><p>Love you! 💕</p>",
        bodyText:
          "Wonderful! That mushroom thing sounds fancy. Dad says he'll pick you up from the airport. Love you!",
        hoursAgo: 37,
        isRead: true,
      },
    ],
  },

  // ─── Important + Work ──────────────────────────────────────────
  {
    contactIndex: 0, // Sarah Chen
    subject: "URGENT: Production API latency spike",
    category: "primary",
    isImportant: true,
    labels: ["Work"],
    summary: "• P1 incident: API P95 latency jumped from 200ms to 3.2s\n• Root cause: missing composite index on org_id + created_at\n• David deploying fix — asked Neil to monitor dashboards",
    suggestedReplies: ["On it, monitoring now", "Dashboards look stable, fix is working", "I see the latency dropping, nice catch"],
    categoryConfidence: 0.98,
    priorityScore: 1.0,
    messages: [
      {
        fromContactIndex: 0,
        bodyHtml:
          "<p>🚨 <strong>P1 Incident</strong></p><p>We're seeing a major latency spike on the production API. P95 response times jumped from 200ms to 3.2s starting around 2:15 PM.</p><p><strong>Impact:</strong> All dashboard users are affected. Customer-facing API returning 504s intermittently.</p><p><strong>Initial investigation:</strong> Looks like it might be related to the new query that went out with this morning's deploy. The <code>user_analytics</code> table is doing a full table scan.</p><p>Can someone from the backend team take a look ASAP? I've started a war room in Slack #incident-20260207.</p>",
        bodyText:
          "P1 Incident: Major latency spike on production API. P95 from 200ms to 3.2s. Dashboard users affected, 504s intermittently. Might be related to new query doing full table scan on user_analytics.",
        hoursAgo: 4,
        isRead: false,
      },
      {
        fromContactIndex: 10, // David Kim
        bodyHtml:
          "<p>On it. I found the issue — the migration added an index on <code>user_id</code> but the query is filtering by <code>org_id + created_at</code>. Adding a composite index now.</p><p>ETA for fix: ~15 minutes. I'll deploy directly to prod after testing on staging.</p><p>@Neil can you monitor the dashboards while I push this?</p>",
        bodyText:
          "Found the issue. Migration added index on user_id but query filters by org_id + created_at. Adding composite index now. ETA 15 min. Neil can you monitor dashboards?",
        hoursAgo: 3,
        isRead: false,
      },
    ],
  },
  {
    contactIndex: 10, // David Kim
    subject: "Performance review self-assessments due Friday",
    category: "primary",
    isImportant: true,
    labels: ["Work"],
    suggestedReplies: ["Thanks for the reminder, will complete tomorrow", "Already started, will finish by Thursday", "Quick question — how many peer nominations minimum?"],
    categoryConfidence: 0.96,
    priorityScore: 0.85,
    messages: [
      {
        fromContactIndex: 10,
        bodyHtml:
          "<p>Hi team,</p><p>Quick reminder that <strong>performance review self-assessments</strong> are due this <strong>Friday by 5 PM</strong>.</p><p>Please make sure to:</p><ul><li>Fill out the self-assessment form in Workday</li><li>Include at least 3 specific accomplishments from this quarter</li><li>Add any peer review nominations (minimum 2)</li><li>Note any growth areas or goals for next quarter</li></ul><p>If you haven't started yet, I'd recommend blocking off an hour tomorrow to work on it. These are important for your career growth conversations.</p><p>Let me know if you have any questions!</p><p>David</p>",
        bodyText:
          "Reminder: Performance review self-assessments due Friday by 5 PM. Fill out form in Workday, include 3 accomplishments, add peer review nominations. Block time tomorrow if you haven't started.",
        hoursAgo: 22,
        isRead: false,
      },
    ],
  },

  // ─── Travel ────────────────────────────────────────────────────
  {
    contactIndex: 16, // Airbnb
    subject: "Booking confirmed - Joshua Tree, CA",
    category: "updates",
    labels: ["Travel"],
    categoryConfidence: 0.93,
    priorityScore: 0.55,
    messages: [
      {
        fromContactIndex: 16,
        bodyHtml:
          "<p>Your booking is confirmed! 🏡</p><p><strong>Desert Stargazer Cabin</strong></p><table><tr><td>Check-in:</td><td>March 14, 2026 (3:00 PM)</td></tr><tr><td>Check-out:</td><td>March 17, 2026 (11:00 AM)</td></tr><tr><td>Guests:</td><td>2</td></tr><tr><td>Address:</td><td>742 Desert Vista Rd, Joshua Tree, CA 92252</td></tr></table><p><strong>Total:</strong> $487.00 (3 nights × $139 + $70 cleaning + $0 service fee)</p><p>Your host <strong>Maria</strong> says: \"Welcome! The cabin has a private hot tub and unobstructed views of the night sky. I'll send lockbox instructions the day before check-in.\"</p><p><a href='#'>View booking details</a></p>",
        bodyText:
          "Booking confirmed: Desert Stargazer Cabin, Joshua Tree. Check-in March 14, check-out March 17. Total: $487.00. Private hot tub, stargazing views.",
        hoursAgo: 60,
        isRead: true,
      },
    ],
  },
  {
    contactIndex: 1, // Alex Rivera
    subject: "Joshua Tree trip planning",
    category: "primary",
    labels: ["Travel"],
    summary: "• Alex researched hikes: Ryan Mountain, Skull Rock, Cholla Cactus Garden\n• Plan: Ryan Mountain sunset day 1, La Copine brunch day 2\n• Cabin booked with hot tub — planning Milky Way photography",
    categoryConfidence: 0.76,
    priorityScore: 0.5,
    messages: [
      {
        fromContactIndex: 1,
        bodyHtml:
          "<p>Dude I'm so excited for Joshua Tree!! 🌵 I've been doing some research on hikes:</p><ul><li><strong>Ryan Mountain Trail</strong> — 3 miles, best sunset views in the park</li><li><strong>Skull Rock Loop</strong> — easy 1.7 miles, super photogenic</li><li><strong>Cholla Cactus Garden</strong> — short walk but apparently insane at golden hour</li><li><strong>Keys View</strong> — drive up, can see all the way to the Salton Sea</li></ul><p>Also found this amazing taco stand in Yucca Valley called <strong>La Copine</strong> — it's actually a fancy brunch place but people rave about it.</p><p>Want to do Ryan Mountain for sunset on day 1?</p>",
        bodyText:
          "So excited for Joshua Tree! Researched hikes: Ryan Mountain, Skull Rock Loop, Cholla Cactus Garden, Keys View. Found a great spot called La Copine. Ryan Mountain sunset day 1?",
        hoursAgo: 48,
        isRead: true,
      },
      {
        fromContactIndex: -1,
        bodyHtml:
          "<p>This all looks amazing! Ryan Mountain sunset on day 1 is a perfect plan. I'll pack my good camera for Cholla Cactus Garden at golden hour too.</p><p>La Copine for brunch day 2? Then Skull Rock after.</p><p>Also I booked the cabin — it has a hot tub and apparently incredible stargazing. Going to try to get some long exposure shots of the Milky Way 📸</p>",
        bodyText:
          "This all looks amazing! Ryan Mountain day 1 perfect. La Copine brunch day 2 then Skull Rock. Booked a cabin with hot tub. Going to try Milky Way long exposure shots.",
        hoursAgo: 46,
        isRead: true,
      },
    ],
  },

  // ─── Receipts ──────────────────────────────────────────────────
  {
    contactIndex: 17, // Uber Eats
    subject: "Your order from Sushi Roku - Receipt",
    category: "promotions",
    labels: ["Receipts"],
    categoryConfidence: 0.88,
    priorityScore: 0.2,
    messages: [
      {
        fromContactIndex: 17,
        bodyHtml:
          "<p><strong>Order Receipt</strong></p><p>Restaurant: Sushi Roku<br>Order #: UE-8834-2026</p><table><tr><td>Spicy Tuna Roll (x2)</td><td>$18.00</td></tr><tr><td>Salmon Sashimi</td><td>$14.00</td></tr><tr><td>Miso Soup</td><td>$4.00</td></tr><tr><td>Edamame</td><td>$5.00</td></tr><tr><td>Subtotal</td><td>$41.00</td></tr><tr><td>Delivery Fee</td><td>$3.99</td></tr><tr><td>Service Fee</td><td>$5.12</td></tr><tr><td>Tip</td><td>$8.00</td></tr><tr><td><strong>Total</strong></td><td><strong>$58.11</strong></td></tr></table><p>Paid with Visa ending in 4829</p>",
        bodyText:
          "Order Receipt - Sushi Roku. Spicy Tuna Roll x2, Salmon Sashimi, Miso Soup, Edamame. Total: $58.11. Paid with Visa ending 4829.",
        hoursAgo: 20,
        isRead: true,
      },
    ],
  },
  {
    contactIndex: 12, // Amazon
    subject: "Your order has been delivered",
    category: "promotions",
    labels: ["Receipts"],
    categoryConfidence: 0.92,
    priorityScore: 0.25,
    messages: [
      {
        fromContactIndex: 12,
        bodyHtml:
          "<p>Your package has been delivered! 📦</p><p><strong>Order #112-9988776-5544332</strong></p><p>Sony WH-1000XM5 Wireless Headphones - Black<br>Delivered to: Front door</p><p><a href='#'>View delivery photo</a> | <a href='#'>Rate your delivery</a></p><p>Not what you expected? <a href='#'>Return or replace items</a></p>",
        bodyText:
          "Your package has been delivered! Sony WH-1000XM5 Wireless Headphones - Black. Delivered to front door.",
        hoursAgo: 84,
        isRead: true,
      },
    ],
  },

  // ─── Personal / Sent visibility ────────────────────────────────
  {
    contactIndex: 20, // Marcus Johnson
    subject: "Long time no see",
    category: "primary",
    labels: ["Personal"],
    summary: "• Reconnected over old hackathon memories — the chocolate pasta recipe app\n• Marcus's startup just closed Series B in Denver\n• Planning to meet up in SF next month at board game cafe",
    suggestedReplies: ["Board game cafe sounds perfect!", "Congrats on the Series B! Can't wait", "I'll keep the photos secret, promise 😂"],
    categoryConfidence: 0.83,
    priorityScore: 0.6,
    messages: [
      {
        fromContactIndex: -1,
        bodyHtml:
          "<p>Marcus! Dude, it's been way too long. I was just looking at old photos from senior year and found that one of us at the hackathon where we built that terrible recipe app in 24 hours. Good times.</p><p>How's life in Denver? Are you still at that startup? I saw on LinkedIn you got promoted — congrats!</p><p>We should catch up properly. You ever come out to the Bay Area?</p>",
        bodyText:
          "Marcus! It's been way too long. Found old hackathon photos. How's Denver? Congrats on the promotion! We should catch up. You ever come to the Bay Area?",
        hoursAgo: 32,
        isRead: true,
      },
      {
        fromContactIndex: 20,
        bodyHtml:
          "<p>NEIL!! Man, that recipe app was SO bad 😂 Didn't it recommend putting chocolate in everything? Including pasta?</p><p>Denver is great — yeah still at the startup, we just closed our Series B actually! Things are wild. I'm actually going to be in SF next month for a conference. Let's definitely grab drinks! Maybe hit up that board game cafe in the Mission?</p><p>Also I can't believe you still have those hackathon photos. Please do not post them anywhere lol</p>",
        bodyText:
          "NEIL! That recipe app was SO bad, it put chocolate in pasta! Denver is great, just closed Series B. I'll be in SF next month — let's grab drinks! Don't post those photos lol",
        hoursAgo: 28,
        isRead: true,
      },
    ],
  },
  {
    contactIndex: 13, // Rachel Torres
    subject: "That hiking trail I mentioned",
    category: "primary",
    labels: ["Personal"],
    summary: "• Shared Purisima Creek Redwoods trail — 7 miles, 1,700ft elevation\n• Rachel wants to go Saturday morning at 7am\n• She's been training for a half marathon",
    suggestedReplies: ["Saturday 7am works! I'll bring snacks", "Great plan, let's carpool from the city", "I'm in! Should we invite anyone else?"],
    categoryConfidence: 0.77,
    priorityScore: 0.55,
    messages: [
      {
        fromContactIndex: -1,
        bodyHtml:
          "<p>Hey Rachel! Here's that trail I was telling you about at lunch:</p><p><strong>Purisima Creek Redwoods</strong> — it's in Half Moon Bay, about 40 min from the city. The loop is ~7 miles and goes through old-growth redwoods down to the coast. Best on a foggy morning when the trees are all misty.</p><p>AllTrails link: <a href='#'>alltrails.com/trail/purisima-creek</a></p><p>Fair warning: the elevation change is no joke (~1,700ft) so bring plenty of water. But the views at the top are worth it!</p>",
        bodyText:
          "Here's that trail: Purisima Creek Redwoods in Half Moon Bay. 7 mile loop through old-growth redwoods. 1,700ft elevation change. Best on a foggy morning. Bring water!",
        hoursAgo: 30,
        isRead: true,
      },
      {
        fromContactIndex: 13,
        bodyHtml:
          "<p>This looks incredible!! Adding it to my list for this weekend. 1,700ft is intense but I've been training for that half marathon so I think I can handle it 💪</p><p>Want to come? Saturday morning, early start (7am?) to beat the crowds?</p>",
        bodyText:
          "This looks incredible! Adding it to my list. 1,700ft is intense but I've been training. Want to come? Saturday 7am to beat crowds?",
        hoursAgo: 27,
        isRead: true,
      },
    ],
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
