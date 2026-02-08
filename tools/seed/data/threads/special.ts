import type { ThreadTemplate } from "../../types";

/** Drafts, snoozed, spam, trash (~6 threads) */
export const SPECIAL_THREADS: ThreadTemplate[] = [
  // ─── Drafts ──────────────────────────────────────────────────────
  {
    id: "draft-weekend-reply",
    subject: "Re: Weekend plans?",
    category: "primary",
    contactId: "alex-rivera",
    messages: [
      {
        from: "self",
        bodyHtml: "<p>Yeah I'm totally down for ramen! Saturday works. What time were you thinking? I'm free after 12.</p><p>And yes, the Dune trailer looks</p>",
        bodyText: "Yeah I'm totally down for ramen! Saturday works. What time were you thinking? I'm free after 12. And yes, the Dune trailer looks",
        hoursAgo: 1,
        isRead: true,
      },
    ],
    flags: { isDraft: true },
  },
  {
    id: "draft-blog-post",
    subject: "Draft: Building Accessible Design Systems",
    category: "primary",
    contactId: "mentor-anna",
    messages: [
      {
        from: "self",
        bodyHtml: "<p>Hey Anna,</p><p>Here's the draft of my blog post on accessible design systems. I've incorporated your feedback from the talk proposal — leading with the failure story and focusing on design decisions.</p><p>Would love your thoughts before I publish. Key sections:</p><ol><li>The $2M accessibility lawsuit that changed our approach</li><li>Color contrast isn't enough — semantic structure matters more</li><li>Testing with real assistive technology users</li></ol><p>Full draft attached.</p>",
        bodyText: "Draft blog post on accessible design systems. Incorporated your feedback. Key sections: accessibility lawsuit, semantic structure, testing with AT users.",
        hoursAgo: 3,
        isRead: true,
      },
    ],
    flags: { isDraft: true },
  },
  // ─── Snoozed ─────────────────────────────────────────────────────
  {
    id: "snoozed-flight-checkin",
    subject: "Check in now for your flight to Tokyo",
    category: "updates",
    contactId: "united-airlines",
    messages: [
      {
        from: "united-airlines",
        bodyHtml: "<p><strong>Online check-in is open!</strong></p><p><strong>Flight:</strong> UA 837<br><strong>Route:</strong> SFO → NRT (Tokyo Narita)<br><strong>Date:</strong> April 12, 2026<br><strong>Departure:</strong> 1:15 PM PST<br><strong>Seat:</strong> 23A (Window)</p><p>Check in now to confirm your seat and save time at the airport.</p><p><a href='#'>Check in now</a></p>",
        bodyText: "Online check-in open for UA 837 SFO→NRT April 12, 1:15 PM. Seat 23A. Check in now.",
        hoursAgo: 8,
        isRead: true,
      },
    ],
    flags: { snoozeHours: 48 },
    labels: ["Travel"],
  },
  {
    id: "snoozed-tax-deadline",
    subject: "Re: Tax documents",
    category: "primary",
    contactId: "dad",
    messages: [
      {
        from: "self",
        bodyHtml: "<p>Thanks Dad! I'll gather everything this weekend. My W-2 is already in the HR portal. Still waiting on the 1098-E from my student loan servicer.</p><p>Can we do a video call next Saturday to go through everything together?</p>",
        bodyText: "I'll gather everything this weekend. W-2 ready, waiting on 1098-E. Can we video call next Saturday?",
        hoursAgo: 110,
        isRead: true,
      },
      {
        from: "dad",
        bodyHtml: "<p>Saturday works! Let's do 10am. I'll have TurboTax set up and ready to go. Make sure you have all your documents in one folder.</p><p>Also — don't forget about the Roth IRA contribution deadline. April 15 for the 2025 tax year. Worth maxing it out if you can.</p>",
        bodyText: "Saturday 10am works. I'll have TurboTax ready. Don't forget Roth IRA contribution deadline April 15 for 2025 tax year.",
        hoursAgo: 105,
        isRead: true,
      },
    ],
    flags: { snoozeHours: 72 },
    labels: ["Finance"],
  },
  // ─── Spam ────────────────────────────────────────────────────────
  {
    id: "spam-crypto-scam",
    subject: "URGENT: You've won 5.0 BTC! Claim now!",
    category: "promotions",
    contactId: "amazon",
    messages: [
      {
        from: "amazon",
        bodyHtml: "<p>Dear Lucky Winner,</p><p>You have been selected to receive <strong>5.0 BTC (worth $478,000)</strong> from our annual giveaway! Click below to claim your prize immediately!</p><p><a href='#'>CLAIM YOUR BITCOIN NOW</a></p><p>This offer expires in 24 hours. Don't miss out!</p><p>Note: A small processing fee of $49.99 is required.</p>",
        bodyText: "You've won 5.0 BTC! Claim now. Processing fee of $49.99 required. Expires in 24 hours.",
        hoursAgo: 140,
        isRead: false,
      },
    ],
    flags: { isSpam: true },
  },
  // ─── Trash ───────────────────────────────────────────────────────
  {
    id: "trash-old-newsletter",
    subject: "Your weekly productivity tips",
    category: "promotions",
    contactId: "doordash",
    messages: [
      {
        from: "doordash",
        bodyHtml: "<p>Top 5 productivity hacks you need to try:</p><ol><li>Wake up at 5 AM (every successful CEO does it)</li><li>Use the Pomodoro technique</li><li>Delete social media from your phone</li><li>Cold showers boost focus by 300%</li><li>Meditate for 20 minutes daily</li></ol><p>Sponsored by: Our new Productivity Bowl, only $14.99.</p>",
        bodyText: "Top 5 productivity hacks: wake up at 5 AM, Pomodoro, delete social media, cold showers, meditate. Sponsored by our Productivity Bowl $14.99.",
        hoursAgo: 200,
        isRead: true,
      },
    ],
    flags: { isTrash: true },
  },
];
