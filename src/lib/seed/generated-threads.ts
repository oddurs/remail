/**
 * Programmatic thread generator for scaling seed data.
 * Generates ~200 realistic thread templates deterministically (no randomness).
 * Combined with the 36 hand-written templates, this produces ~660 total emails.
 */

import type { EmailTemplate } from "./emails";

// ─── Subject Pools ─────────────────────────────────────────────────────────────

const PRIMARY_SUBJECTS = [
  "Re: Team standup notes",
  "Quick question about the API",
  "Lunch tomorrow?",
  "Meeting follow-up",
  "Can you review this?",
  "Project timeline update",
  "Office move logistics",
  "Coffee chat this week?",
  "Feedback on my presentation",
  "Re: Client meeting recap",
  "New hire onboarding checklist",
  "Thoughts on the redesign?",
  "Running late to standup",
  "Happy birthday!",
  "Re: Budget approval",
  "Interview debrief - backend candidate",
  "Parking situation downtown",
  "Re: Laptop replacement request",
  "Team dinner Friday?",
  "Quick sync about the migration",
  "Vacation coverage plan",
  "Re: Sprint retro action items",
  "Conference talk proposal draft",
  "Moving to the new office next week",
  "Re: Benefits enrollment deadline",
  "Need your input on the RFC",
  "Product roadmap brainstorm",
  "Re: Can we reschedule?",
  "Side project idea",
  "Weekend volunteering event",
];

const UPDATES_SUBJECTS = [
  "Your order has shipped",
  "Build failed: main branch",
  "PR merged: fix auth flow",
  "Weekly report ready",
  "New login from Chrome on Mac",
  "Payment received - $1,250.00",
  "Your subscription renews tomorrow",
  "Account security alert",
  "Scheduled maintenance tonight",
  "Your refund has been processed",
  "New device signed in",
  "Invoice #INV-2026-0342",
  "Backup completed successfully",
  "Your DNS changes are live",
  "SSL certificate expiring soon",
  "Monthly usage summary",
  "System update available",
  "Your export is ready to download",
  "Password changed successfully",
  "New comment on your PR #78",
  "CI/CD pipeline recovered",
  "Storage quota at 80%",
  "Weekly security digest",
  "Your transfer is complete",
  "Service status: all systems operational",
];

const PROMOTIONS_SUBJECTS = [
  "50% off this weekend only",
  "Your exclusive member offer",
  "New arrivals you'll love",
  "Flash sale ends tonight",
  "Points balance update: 12,450 pts",
  "Last chance: free shipping",
  "Introducing our latest collection",
  "You left something in your cart",
  "Upgrade to Premium - 30% off",
  "Seasonal clearance event",
  "Buy one get one free",
  "Your reward is waiting",
  "Members-only early access",
  "Deal of the day: 70% off",
  "New restaurant opening near you",
];

const SOCIAL_SUBJECTS = [
  "Alex liked your post",
  "New connection request from Jamie",
  "Event invitation: Tech Meetup",
  "Tagged in a photo",
  "Group message: Weekend plans",
  "Someone commented on your photo",
  "Reminder: Sarah's birthday tomorrow",
  "New follower: Design Community",
  "You were mentioned in a post",
  "Event update: location changed",
  "New message from Book Club group",
  "Weekly highlights from your network",
  "Your post reached 100 likes",
  "Invitation: React Conf 2026",
  "Community digest: This week's top posts",
];

const FORUMS_SUBJECTS = [
  "Re: Best practices for testing",
  "Weekly digest: React community",
  "New discussion: TypeScript 6.0 features",
  "Community announcement: new moderators",
  "Hot topic: Server components vs SPAs",
  "Tutorial: Building with Rust and WASM",
  "Re: Help with CSS grid layout",
  "Poll: Favorite code editor in 2026",
  "Job board: 15 new remote positions",
  "Re: Database indexing strategies",
  "Showcase: My weekend side project",
  "Discussion: AI pair programming tools",
  "Best resources for learning Go",
  "Re: Debugging memory leaks in Node",
  "Monthly newsletter: Frontend trends",
];

// ─── Body Pools ────────────────────────────────────────────────────────────────

interface BodyTemplate {
  html: string;
  text: string;
}

const PRIMARY_BODIES: BodyTemplate[] = [
  {
    html: "<p>Hey, just wanted to follow up on our conversation from yesterday. I think we should move forward with option B — it's simpler and we can always iterate later.</p><p>Let me know what you think!</p>",
    text: "Hey, just wanted to follow up on our conversation from yesterday. I think we should move forward with option B — it's simpler and we can always iterate later. Let me know what you think!",
  },
  {
    html: "<p>Thanks for sending this over! I took a look and have a few thoughts:</p><ul><li>The overall structure looks great</li><li>We might want to reconsider the timeline for phase 2</li><li>Can we add a section on risk mitigation?</li></ul><p>Happy to discuss in person if easier.</p>",
    text: "Thanks for sending this over! I took a look and have a few thoughts: the overall structure looks great, we might want to reconsider the timeline for phase 2, and can we add a section on risk mitigation?",
  },
  {
    html: "<p>Sure, that works for me! I'll block off my calendar. Should we invite anyone else from the team?</p>",
    text: "Sure, that works for me! I'll block off my calendar. Should we invite anyone else from the team?",
  },
  {
    html: "<p>I've been thinking about this more and I have a slightly different take. What if we approached it from the user's perspective first? We could do some quick user interviews before committing to a direction.</p><p>I know it adds a bit of time upfront but I think it'll save us from rework later.</p>",
    text: "I've been thinking about this more and I have a slightly different take. What if we approached it from the user's perspective first? We could do some quick user interviews before committing to a direction.",
  },
  {
    html: "<p>Sounds good! I'm free anytime after 2pm. The cafe on 3rd street has good wifi if you want to work from there.</p>",
    text: "Sounds good! I'm free anytime after 2pm. The cafe on 3rd street has good wifi if you want to work from there.",
  },
  {
    html: "<p>Quick update: I finished the first draft and shared it in the Google Doc. Feel free to leave comments directly. I highlighted the sections I'm less sure about in yellow.</p><p>No rush on reviewing — sometime this week is fine.</p>",
    text: "Quick update: I finished the first draft and shared it in the Google Doc. Feel free to leave comments directly. I highlighted the sections I'm less sure about in yellow. No rush — sometime this week is fine.",
  },
  {
    html: "<p>Hey! Random question — do you still have that book about design systems I lent you last month? No rush, just realized I might need to reference it for a presentation I'm working on.</p>",
    text: "Hey! Random question — do you still have that book about design systems I lent you last month? No rush, just realized I might need to reference it for a presentation.",
  },
  {
    html: "<p>Great work on the presentation yesterday! The stakeholders seemed really impressed, especially with the demo. I think we're in a good position for the green light.</p><p>One thing to keep in mind — they asked about the security audit timeline, so we should have a clear answer for the follow-up meeting.</p>",
    text: "Great work on the presentation yesterday! The stakeholders seemed really impressed, especially with the demo. One thing — they asked about the security audit timeline, so we should have an answer ready.",
  },
  {
    html: "<p>Can we push our 1:1 to Thursday? I have a conflict tomorrow afternoon that just came up. Same time works, just a different day.</p>",
    text: "Can we push our 1:1 to Thursday? I have a conflict tomorrow afternoon that just came up. Same time works, just a different day.",
  },
  {
    html: "<p>I just saw the news about the acquisition — wow! What does this mean for our team? I have a bunch of questions but I'm sure everyone does. Maybe we should set up a Q&A session?</p>",
    text: "I just saw the news about the acquisition — wow! What does this mean for our team? I have a bunch of questions but I'm sure everyone does. Maybe we should set up a Q&A session?",
  },
  {
    html: "<p>Here's the summary from today's meeting:</p><ol><li>We agreed on the new feature scope</li><li>Design review scheduled for next Tuesday</li><li>Need volunteers for the documentation sprint</li></ol><p>Action items are in the shared doc. Please add your name next to any items you can take on.</p>",
    text: "Here's the summary from today's meeting: 1. Agreed on new feature scope 2. Design review next Tuesday 3. Need volunteers for documentation sprint. Action items in the shared doc.",
  },
  {
    html: "<p>Thanks for the recommendation! I started watching it last night and couldn't stop. Already on episode 3. No spoilers please!</p>",
    text: "Thanks for the recommendation! I started watching it last night and couldn't stop. Already on episode 3. No spoilers please!",
  },
  {
    html: "<p>I'm putting together the agenda for our offsite next month. Any topics you'd like to cover? I want to make sure we address everyone's concerns.</p><p>Current list:</p><ul><li>Team goals for Q2</li><li>Process improvements</li><li>Open discussion</li></ul>",
    text: "I'm putting together the agenda for our offsite next month. Any topics you'd like to cover? Current list: Team goals for Q2, Process improvements, Open discussion.",
  },
  {
    html: "<p>Just a heads up — I'll be working from home tomorrow. My car is in the shop and the bus takes forever. I'll be online all day though, so ping me anytime.</p>",
    text: "Just a heads up — I'll be working from home tomorrow. My car is in the shop. I'll be online all day though, so ping me anytime.",
  },
  {
    html: "<p>Do you have the contact info for that freelance designer we worked with last quarter? I have a small project that would be perfect for them. The one who did the icon set — they were really good.</p>",
    text: "Do you have the contact info for that freelance designer we worked with last quarter? I have a small project that would be perfect for them. The one who did the icon set.",
  },
];

const UPDATES_BODIES: BodyTemplate[] = [
  {
    html: "<p>Your order <strong>#ORD-2026-8834</strong> has shipped and is on its way.</p><p>Estimated delivery: <strong>3-5 business days</strong></p><p><a href='#'>Track your package</a></p>",
    text: "Your order #ORD-2026-8834 has shipped. Estimated delivery: 3-5 business days.",
  },
  {
    html: "<p><strong>Build Status: Failed</strong></p><p>Branch: <code>main</code><br>Commit: <code>a3f8c2d</code><br>Error: Test suite failed — 3 tests failing in <code>auth.test.ts</code></p><p><a href='#'>View build logs</a></p>",
    text: "Build failed on main branch. 3 tests failing in auth.test.ts. View build logs for details.",
  },
  {
    html: "<p>Your pull request has been merged.</p><p><strong>PR #142: Fix authentication token refresh</strong><br>Merged by: sarah-chen<br>Branch: <code>fix/auth-refresh</code> → <code>main</code></p>",
    text: "PR #142: Fix authentication token refresh has been merged by sarah-chen into main.",
  },
  {
    html: "<p>Your weekly activity report is ready.</p><p><strong>This week:</strong></p><ul><li>12 tasks completed</li><li>3 PRs merged</li><li>2 code reviews</li></ul><p><a href='#'>View full report</a></p>",
    text: "Weekly activity report: 12 tasks completed, 3 PRs merged, 2 code reviews. View full report.",
  },
  {
    html: "<p><strong>Security Notice</strong></p><p>We detected a new sign-in to your account.</p><p>Device: Chrome on macOS<br>Location: San Francisco, CA<br>Time: Today at 2:34 PM</p><p>If this wasn't you, <a href='#'>secure your account</a>.</p>",
    text: "New sign-in detected. Chrome on macOS from San Francisco, CA at 2:34 PM. If this wasn't you, secure your account.",
  },
  {
    html: "<p>Payment received!</p><p>Amount: <strong>$1,250.00</strong><br>From: Acme Corp<br>Reference: INV-2026-0891</p><p><a href='#'>View transaction details</a></p>",
    text: "Payment received: $1,250.00 from Acme Corp. Reference: INV-2026-0891.",
  },
  {
    html: "<p>Your subscription will renew tomorrow.</p><p>Plan: <strong>Pro ($19.99/mo)</strong><br>Next billing date: Tomorrow<br>Payment method: Visa ending in 4829</p><p><a href='#'>Manage subscription</a></p>",
    text: "Your Pro subscription ($19.99/mo) renews tomorrow. Payment method: Visa ending 4829.",
  },
  {
    html: "<p><strong>Scheduled Maintenance</strong></p><p>We'll be performing routine maintenance tonight from <strong>2:00 AM - 4:00 AM EST</strong>. You may experience brief interruptions during this window.</p><p>No action required on your part.</p>",
    text: "Scheduled maintenance tonight 2:00 AM - 4:00 AM EST. Brief interruptions possible. No action required.",
  },
  {
    html: "<p>Your refund of <strong>$45.99</strong> has been processed.</p><p>Order: #ORD-2026-7721<br>Refund method: Original payment method<br>Expected: 3-5 business days</p>",
    text: "Refund of $45.99 processed for order #ORD-2026-7721. Expected in 3-5 business days.",
  },
  {
    html: "<p><strong>Invoice #INV-2026-0342</strong></p><p>Amount due: <strong>$2,400.00</strong><br>Due date: March 1, 2026<br>Client: Acme Corp</p><p><a href='#'>View invoice</a> | <a href='#'>Download PDF</a></p>",
    text: "Invoice #INV-2026-0342. Amount due: $2,400.00 by March 1, 2026. Client: Acme Corp.",
  },
  {
    html: "<p>Your SSL certificate for <strong>example.com</strong> expires in 14 days.</p><p>Expiration: February 22, 2026<br>Auto-renewal: Enabled</p><p>No action needed if auto-renewal is on.</p>",
    text: "SSL certificate for example.com expires in 14 days (Feb 22). Auto-renewal is enabled.",
  },
  {
    html: "<p><strong>Monthly Usage Summary</strong></p><p>API calls: 42,891 / 100,000<br>Storage: 2.1 GB / 10 GB<br>Bandwidth: 15.3 GB / 50 GB</p><p>You're well within your plan limits.</p>",
    text: "Monthly usage: 42,891 API calls, 2.1 GB storage, 15.3 GB bandwidth. Within plan limits.",
  },
  {
    html: "<p>Your data export is ready to download.</p><p>File: <code>export-2026-02-08.csv</code><br>Size: 4.2 MB<br>Records: 12,456</p><p><a href='#'>Download export</a> (available for 7 days)</p>",
    text: "Data export ready: export-2026-02-08.csv (4.2 MB, 12,456 records). Download within 7 days.",
  },
  {
    html: "<p>Your password was successfully changed.</p><p>Time: Today at 10:15 AM<br>Device: Chrome on macOS</p><p>If you didn't make this change, <a href='#'>contact support immediately</a>.</p>",
    text: "Password changed successfully at 10:15 AM from Chrome on macOS. Contact support if this wasn't you.",
  },
  {
    html: "<p><strong>Storage Alert</strong></p><p>You've used <strong>80%</strong> of your storage quota.</p><p>Used: 8.0 GB / 10 GB<br>Largest files: build artifacts (3.2 GB)</p><p><a href='#'>Manage storage</a> | <a href='#'>Upgrade plan</a></p>",
    text: "Storage quota at 80% (8.0 GB / 10 GB). Largest files: build artifacts (3.2 GB). Consider managing storage or upgrading.",
  },
];

const PROMOTIONS_BODIES: BodyTemplate[] = [
  {
    html: "<p>This weekend only — take <strong>50% off</strong> everything in store and online.</p><p>Use code: <strong>WEEKEND50</strong></p><p>Ends Sunday at midnight. <a href='#'>Shop now</a></p>",
    text: "50% off everything this weekend. Use code: WEEKEND50. Ends Sunday at midnight.",
  },
  {
    html: "<p>As a valued member, you've earned an exclusive offer:</p><p><strong>$20 off your next purchase of $75+</strong></p><p>This offer was made just for you based on your shopping history.</p><p><a href='#'>Redeem now</a></p>",
    text: "Exclusive member offer: $20 off your next purchase of $75+. Made just for you.",
  },
  {
    html: "<p>Check out what just dropped:</p><ul><li>Spring Collection 2026</li><li>Limited edition collaborations</li><li>Restocked best-sellers</li></ul><p>Free shipping on orders over $50. <a href='#'>Browse new arrivals</a></p>",
    text: "New arrivals: Spring Collection 2026, limited edition collaborations, restocked best-sellers. Free shipping over $50.",
  },
  {
    html: "<p><strong>Flash Sale — 6 hours left!</strong></p><p>Up to 70% off select items. Our biggest sale of the season.</p><p>Top picks selling fast. <a href='#'>Shop the sale</a></p>",
    text: "Flash sale: up to 70% off select items. 6 hours left. Our biggest sale of the season.",
  },
  {
    html: "<p>Your points balance: <strong>12,450 points</strong></p><p>You're only 550 points away from a <strong>$25 reward</strong>!</p><p>Earn 2x points on all purchases this week. <a href='#'>View rewards</a></p>",
    text: "Points balance: 12,450. Only 550 away from a $25 reward! Earn 2x points this week.",
  },
  {
    html: "<p>Free shipping on ALL orders — no minimum required!</p><p>This weekend only. <a href='#'>Start shopping</a></p><p>Plus, returns are always free within 30 days.</p>",
    text: "Free shipping on all orders this weekend — no minimum required. Free returns within 30 days.",
  },
  {
    html: "<p>Introducing our <strong>latest collection</strong> — designed for modern living.</p><p>Clean lines. Sustainable materials. Timeless style.</p><p><a href='#'>Explore the collection</a></p>",
    text: "Introducing our latest collection — clean lines, sustainable materials, timeless style.",
  },
  {
    html: "<p>You left something behind!</p><p>Your cart still has <strong>2 items</strong> waiting for you.</p><p>Complete your order now and get <strong>10% off</strong> with code: <strong>COMEBACK10</strong></p><p><a href='#'>Return to cart</a></p>",
    text: "You left 2 items in your cart. Complete your order now and get 10% off with code COMEBACK10.",
  },
  {
    html: "<p>Ready to upgrade? Get <strong>30% off Premium</strong> for your first year.</p><p>Unlock:</p><ul><li>Unlimited storage</li><li>Priority support</li><li>Advanced analytics</li></ul><p><a href='#'>Upgrade now</a></p>",
    text: "Upgrade to Premium: 30% off first year. Unlimited storage, priority support, advanced analytics.",
  },
  {
    html: "<p><strong>End of Season Sale</strong></p><p>Up to 60% off winter styles. Make room for spring!</p><p>Hundreds of items added. <a href='#'>Shop clearance</a></p>",
    text: "End of season sale: up to 60% off winter styles. Hundreds of items added to clearance.",
  },
  {
    html: "<p>Buy one, get one free on all accessories!</p><p>Mix and match from our entire collection.</p><p>In store and online. <a href='#'>Shop BOGO</a></p>",
    text: "Buy one get one free on all accessories. Mix and match. In store and online.",
  },
  {
    html: "<p>Your <strong>$15 reward</strong> is waiting!</p><p>Redeem it on your next purchase — no minimum required.</p><p>Expires: February 28, 2026. <a href='#'>Redeem now</a></p>",
    text: "Your $15 reward is waiting! No minimum required. Expires February 28, 2026.",
  },
  {
    html: "<p>Members get <strong>early access</strong> to our biggest sale of the year!</p><p>Starting tomorrow — 48 hours before everyone else.</p><p><a href='#'>Preview the deals</a></p>",
    text: "Members-only early access to our biggest sale — 48 hours before everyone else. Starting tomorrow.",
  },
  {
    html: "<p><strong>Deal of the Day</strong></p><p>Sony WF-1000XM5 earbuds — <del>$299.99</del> <strong>$89.99</strong> (70% off)</p><p>Today only. While supplies last. <a href='#'>Buy now</a></p>",
    text: "Deal of the day: Sony WF-1000XM5 earbuds $89.99 (70% off, was $299.99). Today only.",
  },
  {
    html: "<p>A new restaurant just opened near you!</p><p><strong>Sakura Ramen House</strong> — Authentic Japanese ramen, hand-pulled noodles.</p><p>Grand opening special: <strong>20% off</strong> your first order. <a href='#'>Order now</a></p>",
    text: "New restaurant: Sakura Ramen House near you. Grand opening special: 20% off your first order.",
  },
];

const SOCIAL_BODIES: BodyTemplate[] = [
  {
    html: "<p><strong>Alex Rivera</strong> liked your post: \"Just shipped a major feature...\"</p><p><a href='#'>View your post</a></p>",
    text: "Alex Rivera liked your post: \"Just shipped a major feature...\"",
  },
  {
    html: "<p><strong>Jamie Lee</strong> wants to connect with you.</p><p>\"Hey, we met at the React meetup last week. Would love to stay in touch!\"</p><p><a href='#'>Accept</a> | <a href='#'>Ignore</a></p>",
    text: "Jamie Lee wants to connect: \"Hey, we met at the React meetup last week. Would love to stay in touch!\"",
  },
  {
    html: "<p>You're invited to <strong>SF Tech Meetup: AI & Design</strong></p><p>Date: February 20, 2026 at 6:30 PM<br>Location: WeWork Mission St<br>RSVP: 45 going</p><p><a href='#'>RSVP</a></p>",
    text: "Invited to SF Tech Meetup: AI & Design. Feb 20 at 6:30 PM, WeWork Mission St. 45 going.",
  },
  {
    html: "<p><strong>Rachel Torres</strong> tagged you in a photo from <strong>Team Offsite 2026</strong>.</p><p><a href='#'>View photo</a></p>",
    text: "Rachel Torres tagged you in a photo from Team Offsite 2026.",
  },
  {
    html: "<p>New message in <strong>Weekend Crew</strong>:</p><p><strong>Marcus:</strong> \"Who's down for hiking Saturday? Weather looks perfect.\"</p><p><a href='#'>Reply in group</a></p>",
    text: "Marcus in Weekend Crew: \"Who's down for hiking Saturday? Weather looks perfect.\"",
  },
  {
    html: "<p><strong>David Kim</strong> commented on your photo: \"Great shot! Where was this taken?\"</p><p><a href='#'>View comment</a></p>",
    text: "David Kim commented on your photo: \"Great shot! Where was this taken?\"",
  },
  {
    html: "<p>Reminder: <strong>Sarah Chen's</strong> birthday is tomorrow!</p><p>Don't forget to wish them well.</p><p><a href='#'>Send a message</a></p>",
    text: "Reminder: Sarah Chen's birthday is tomorrow! Don't forget to wish them well.",
  },
  {
    html: "<p><strong>Design Community</strong> started following you.</p><p>They have 15K followers and post about UI/UX trends daily.</p><p><a href='#'>Follow back</a></p>",
    text: "Design Community (15K followers) started following you. They post about UI/UX trends daily.",
  },
  {
    html: "<p>You were mentioned in a post by <strong>Alex Rivera</strong>:</p><p>\"Huge shoutout to @neil for helping debug the auth issue. Real team player!\"</p><p><a href='#'>View post</a></p>",
    text: "Alex mentioned you: \"Huge shoutout to @neil for helping debug the auth issue. Real team player!\"",
  },
  {
    html: "<p><strong>Event Update</strong></p><p>The location for <strong>Frontend Conf 2026</strong> has changed:</p><p>New venue: <strong>Moscone Center, Hall B</strong><br>Date remains: March 15-16, 2026</p><p><a href='#'>View updated details</a></p>",
    text: "Frontend Conf 2026 location changed to Moscone Center, Hall B. Dates remain March 15-16.",
  },
  {
    html: "<p>New message in <strong>Book Club</strong>:</p><p><strong>Rachel:</strong> \"Finished the book! Anyone want to discuss over coffee this weekend?\"</p><p><a href='#'>View conversation</a></p>",
    text: "Rachel in Book Club: \"Finished the book! Anyone want to discuss over coffee this weekend?\"",
  },
  {
    html: "<p>Your weekly highlights from your network:</p><ul><li>Sarah got promoted to Staff Engineer</li><li>David shared an article about React 20</li><li>3 connections have work anniversaries</li></ul><p><a href='#'>See all updates</a></p>",
    text: "Weekly highlights: Sarah promoted to Staff Engineer, David shared about React 20, 3 work anniversaries.",
  },
  {
    html: "<p>Your post reached <strong>100 likes</strong>!</p><p>\"Excited to share our new open-source design system...\"</p><p>This is your most popular post this month. <a href='#'>View insights</a></p>",
    text: "Your post about the open-source design system reached 100 likes — your most popular this month.",
  },
  {
    html: "<p>You're invited to <strong>React Conf 2026</strong>!</p><p>Date: April 10-12, 2026<br>Location: Las Vegas, NV<br>Early bird pricing: $299 (save $200)</p><p><a href='#'>Register now</a></p>",
    text: "Invited to React Conf 2026! April 10-12 in Las Vegas. Early bird: $299 (save $200).",
  },
  {
    html: "<p><strong>This week's top posts</strong> from communities you follow:</p><ol><li>\"Why I switched from REST to tRPC\" — 342 upvotes</li><li>\"CSS Subgrid is a game changer\" — 289 upvotes</li><li>\"Building offline-first apps\" — 201 upvotes</li></ol><p><a href='#'>Browse all</a></p>",
    text: "Top posts: \"Why I switched from REST to tRPC\" (342 upvotes), \"CSS Subgrid is a game changer\" (289), \"Building offline-first apps\" (201).",
  },
];

const FORUMS_BODIES: BodyTemplate[] = [
  {
    html: "<p><strong>@devuser42</strong> replied to your post:</p><p>\"I've been using the testing library approach and it's been great. The key is to test behavior, not implementation details. Here's a pattern I've found useful...\"</p><p><a href='#'>View reply</a></p>",
    text: "devuser42 replied: \"I've been using the testing library approach. The key is to test behavior, not implementation details.\"",
  },
  {
    html: "<p><strong>Weekly Digest: React Community</strong></p><ul><li>42 new discussions</li><li>128 new comments</li><li>Top post: \"Server Components in production — lessons learned\" (156 upvotes)</li></ul><p><a href='#'>Read the digest</a></p>",
    text: "React Weekly: 42 discussions, 128 comments. Top: \"Server Components in production\" (156 upvotes).",
  },
  {
    html: "<p>New discussion started by <strong>@typescript_fan</strong>:</p><p>\"TypeScript 6.0 just dropped and the new pattern matching syntax is incredible. Has anyone tried it in production yet?\"</p><p>23 replies so far. <a href='#'>Join discussion</a></p>",
    text: "New discussion: TypeScript 6.0 pattern matching syntax. 23 replies. Join the discussion.",
  },
  {
    html: "<p><strong>Community Announcement</strong></p><p>We're excited to welcome 3 new moderators to the community! Thank you for volunteering your time to help keep our discussions productive and welcoming.</p><p><a href='#'>Meet the new mods</a></p>",
    text: "Community announcement: 3 new moderators welcomed. Thanks for keeping discussions productive and welcoming.",
  },
  {
    html: "<p><strong>Hot Topic:</strong> \"Are server components making SPAs obsolete?\"</p><p>This thread has 89 replies and counting. Top perspectives from both sides of the debate.</p><p><a href='#'>Read the discussion</a></p>",
    text: "Hot topic: \"Are server components making SPAs obsolete?\" 89 replies. Read top perspectives.",
  },
  {
    html: "<p><strong>New Tutorial:</strong> Building a Real-Time Chat App with Rust and WebAssembly</p><p>Step-by-step guide covering setup, message handling, and deployment.</p><p>Difficulty: Intermediate | Time: 2 hours</p><p><a href='#'>Start tutorial</a></p>",
    text: "New tutorial: Real-time chat with Rust and WASM. Step-by-step, intermediate, 2 hours.",
  },
  {
    html: "<p><strong>@css_wizard</strong> asked for help:</p><p>\"I'm trying to create a responsive grid layout that switches from 3 columns to 1 on mobile, but CSS grid's auto-fit isn't behaving as expected. Any ideas?\"</p><p>8 replies. <a href='#'>Help out</a></p>",
    text: "css_wizard needs help with responsive CSS grid auto-fit. 8 replies so far.",
  },
  {
    html: "<p><strong>Poll Results: Favorite Code Editor in 2026</strong></p><ol><li>VS Code — 45%</li><li>Cursor — 28%</li><li>Neovim — 15%</li><li>Zed — 8%</li><li>Other — 4%</li></ol><p>1,234 votes total. <a href='#'>See full results</a></p>",
    text: "Poll results: VS Code 45%, Cursor 28%, Neovim 15%, Zed 8%. 1,234 votes.",
  },
  {
    html: "<p><strong>15 New Remote Positions</strong></p><p>Curated from this week's job postings:</p><ul><li>Senior React Developer — $180K-220K</li><li>DevOps Engineer — $160K-200K</li><li>Product Designer — $140K-180K</li></ul><p><a href='#'>View all positions</a></p>",
    text: "15 new remote jobs: Senior React ($180-220K), DevOps ($160-200K), Product Designer ($140-180K).",
  },
  {
    html: "<p><strong>@perf_guru</strong> shared insights on database indexing:</p><p>\"The most common mistake I see is adding indexes for every query. Instead, focus on your top 10 slowest queries and work backwards from there.\"</p><p>34 upvotes. <a href='#'>Read more</a></p>",
    text: "perf_guru on indexing: \"Focus on your top 10 slowest queries and work backwards.\" 34 upvotes.",
  },
  {
    html: "<p><strong>Weekend Project Showcase</strong></p><p><strong>@maker_neil</strong> shared: \"Built a CLI tool that generates API documentation from TypeScript types. It's open source!\"</p><p>67 stars on GitHub. <a href='#'>Check it out</a></p>",
    text: "Weekend showcase: CLI tool for API docs from TypeScript types. 67 GitHub stars.",
  },
  {
    html: "<p><strong>Discussion: AI Pair Programming Tools</strong></p><p>\"I've been using AI-assisted coding for 6 months now. It's changed how I work — not by writing code for me, but by helping me think through problems differently.\"</p><p>56 replies. <a href='#'>Join in</a></p>",
    text: "AI pair programming discussion: \"Changed how I work — helps think through problems differently.\" 56 replies.",
  },
  {
    html: "<p><strong>Best Resources for Learning Go in 2026</strong></p><p>Community-curated list:</p><ol><li>\"Go by Example\" (updated for 1.23)</li><li>Effective Go — still the gold standard</li><li>\"Let's Go\" by Alex Edwards</li></ol><p><a href='#'>See full list (28 resources)</a></p>",
    text: "Best Go resources: Go by Example, Effective Go, Let's Go by Alex Edwards. 28 resources total.",
  },
  {
    html: "<p><strong>@node_debugger</strong> posted a debugging guide:</p><p>\"Here's how I tracked down a memory leak that was causing our Node.js service to crash every 4 hours. TL;DR: it was event listeners that were never removed.\"</p><p><a href='#'>Read the post-mortem</a></p>",
    text: "Memory leak debugging: Node.js service crashing every 4 hours. Root cause: unremoved event listeners.",
  },
  {
    html: "<p><strong>Frontend Trends — February 2026</strong></p><ul><li>Signal-based reactivity is going mainstream</li><li>Web components getting a second wind</li><li>CSS anchor positioning lands in all browsers</li><li>WASM-based bundlers gaining traction</li></ul><p><a href='#'>Read the full newsletter</a></p>",
    text: "Frontend trends: Signal-based reactivity mainstream, web components revival, CSS anchor positioning, WASM bundlers.",
  },
];

// ─── Reply Body Pools ──────────────────────────────────────────────────────────

const REPLY_BODIES: BodyTemplate[] = [
  {
    html: "<p>Thanks for the update! I'll take a look and get back to you by end of day.</p>",
    text: "Thanks for the update! I'll take a look and get back to you by end of day.",
  },
  {
    html: "<p>Sounds good to me. Let me know if you need anything else from my end.</p>",
    text: "Sounds good to me. Let me know if you need anything else from my end.",
  },
  {
    html: "<p>Great point. I hadn't thought of it that way. Let me reconsider and circle back.</p>",
    text: "Great point. I hadn't thought of it that way. Let me reconsider and circle back.",
  },
  {
    html: "<p>I agree with this approach. Should we loop in the rest of the team?</p>",
    text: "I agree with this approach. Should we loop in the rest of the team?",
  },
  {
    html: "<p>Perfect, that works for me! See you then.</p>",
    text: "Perfect, that works for me! See you then.",
  },
  {
    html: "<p>Thanks! I'll add this to our backlog and we can prioritize it next sprint.</p>",
    text: "Thanks! I'll add this to our backlog and we can prioritize it next sprint.",
  },
  {
    html: "<p>Just following up on this — any updates?</p>",
    text: "Just following up on this — any updates?",
  },
  {
    html: "<p>Got it. I'll handle this today and send over the results by tomorrow morning.</p>",
    text: "Got it. I'll handle this today and send over the results by tomorrow morning.",
  },
];

// ─── Contact Indices ───────────────────────────────────────────────────────────

// Map categories to appropriate contactIndex values from CONTACT_TEMPLATES
// Personal contacts: 0=Sarah, 1=Alex, 2=Mom, 10=David, 13=Rachel, 15=Dad, 20=Marcus
// Service contacts: 3=GitHub, 4=Jira, 5=LinkedIn, 6=Spotify, 7=Chase, 8=Verge, 9=DrPatel,
//                   11=Figma, 12=Amazon, 14=Vercel, 16=Airbnb, 17=UberEats
const CATEGORY_CONTACTS: Record<string, number[]> = {
  primary: [0, 1, 10, 13, 20],       // Sarah, Alex, David, Rachel, Marcus
  updates: [3, 4, 7, 9, 11, 14],     // GitHub, Jira, Chase, DrPatel, Figma, Vercel
  promotions: [6, 12, 17],           // Spotify, Amazon, UberEats
  social: [5],                        // LinkedIn
  forums: [8],                        // The Verge
};

const USER_LABEL_NAMES = ["Work", "Personal", "Finance", "Travel", "Receipts"];

// ─── Generator ─────────────────────────────────────────────────────────────────

export function generateThreadTemplates(): EmailTemplate[] {
  const templates: EmailTemplate[] = [];

  const categoryConfig: Array<{
    category: EmailTemplate["category"];
    count: number;
    subjects: string[];
    bodies: BodyTemplate[];
  }> = [
    { category: "primary", count: 80, subjects: PRIMARY_SUBJECTS, bodies: PRIMARY_BODIES },
    { category: "updates", count: 50, subjects: UPDATES_SUBJECTS, bodies: UPDATES_BODIES },
    { category: "promotions", count: 30, subjects: PROMOTIONS_SUBJECTS, bodies: PROMOTIONS_BODIES },
    { category: "social", count: 20, subjects: SOCIAL_SUBJECTS, bodies: SOCIAL_BODIES },
    { category: "forums", count: 20, subjects: FORUMS_SUBJECTS, bodies: FORUMS_BODIES },
  ];

  let globalIndex = 0;

  for (const config of categoryConfig) {
    const contacts = CATEGORY_CONTACTS[config.category];

    for (let i = 0; i < config.count; i++) {
      const subjectIndex = i % config.subjects.length;
      const bodyIndex = i % config.bodies.length;
      const contactIndex = contacts[i % contacts.length];

      // Deterministic message count distribution based on index
      // 60% single, 25% two, 10% three, 5% four-five
      const msgBucket = globalIndex % 20;
      let messageCount: number;
      if (msgBucket < 12) messageCount = 1;        // 60%
      else if (msgBucket < 17) messageCount = 2;    // 25%
      else if (msgBucket < 19) messageCount = 3;    // 10%
      else messageCount = 4 + (globalIndex % 2);    // 5% → 4 or 5

      // Build messages
      const messages: EmailTemplate["messages"] = [];
      // hoursAgo spread across 1–720 (30 days), deterministic from globalIndex
      const baseHoursAgo = 1 + ((globalIndex * 37 + 13) % 720);

      for (let m = 0; m < messageCount; m++) {
        const isFirst = m === 0;
        const isFromSelf = m % 2 === 1; // odd messages are replies from self
        const body = isFirst
          ? config.bodies[bodyIndex]
          : REPLY_BODIES[(globalIndex + m) % REPLY_BODIES.length];

        messages.push({
          fromContactIndex: isFromSelf ? -1 : contactIndex,
          bodyHtml: body.html,
          bodyText: body.text,
          hoursAgo: baseHoursAgo - m * 2, // each reply 2 hours after previous
          isRead: isFirst ? globalIndex % 10 >= 3 : true, // ~30% unread (first message)
        });
      }

      // Properties
      const isStarred = globalIndex % 10 === 0;           // ~10%
      const isImportant = globalIndex % 7 === 0;          // ~15%

      // Labels: ~20% get a user label
      const labels: string[] = [];
      if (globalIndex % 5 === 0) {
        labels.push(USER_LABEL_NAMES[globalIndex % USER_LABEL_NAMES.length]);
      }

      // Subject suffix to ensure uniqueness for repeated subjects
      const cycleNum = Math.floor(i / config.subjects.length);
      const subject = cycleNum > 0
        ? `${config.subjects[subjectIndex]} (${cycleNum + 1})`
        : config.subjects[subjectIndex];

      const template: EmailTemplate = {
        contactIndex,
        subject,
        category: config.category,
        messages,
        ...(isStarred && { isStarred: true }),
        ...(isImportant && { isImportant: true }),
        ...(labels.length > 0 && { labels }),
        categoryConfidence: 0.85 + (globalIndex % 10) * 0.01, // 0.85-0.94
        priorityScore: 0.3 + (globalIndex % 7) * 0.1,         // 0.3-0.9
      };

      templates.push(template);
      globalIndex++;
    }
  }

  return templates;
}
