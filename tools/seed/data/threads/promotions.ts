import type { ThreadTemplate } from "../../types";

/** Shopping, subscriptions, marketing (~10 threads) */
export const PROMOTION_THREADS: ThreadTemplate[] = [
  {
    id: "spotify-wrapped",
    subject: "Your 2025 Wrapped is here!",
    category: "promotions",
    contactId: "spotify",
    messages: [
      {
        from: "spotify",
        bodyHtml: "<p>Your year in music is ready!</p><p><strong>42,000 minutes</strong> listened<br><strong>Top Artist:</strong> Radiohead<br><strong>Top Song:</strong> Everything In Its Right Place<br><strong>Top Genre:</strong> Alternative Rock<br><strong>Listening Personality:</strong> The Adventurer</p><p>You were in the top 2% of Radiohead listeners worldwide.</p><p><a href='#'>See your full Wrapped</a></p>",
        bodyText: "Your year in music: 42,000 minutes listened. Top Artist: Radiohead. Top Song: Everything In Its Right Place.",
        hoursAgo: 120,
        isRead: true,
      },
    ],
  },
  {
    id: "spotify-discover",
    subject: "Your Discover Weekly is ready",
    category: "promotions",
    contactId: "spotify",
    messages: [
      {
        from: "spotify",
        bodyHtml: "<p>Fresh picks, just for you.</p><p>Your Discover Weekly playlist has been updated with 30 new tracks based on your listening. This week's highlights:</p><ul><li>\"Dissolve\" by Absofacto</li><li>\"Notion\" by The Rare Occasions</li><li>\"Heat Waves\" by Glass Animals</li></ul><p><a href='#'>Listen now</a></p>",
        bodyText: "Discover Weekly updated. 30 new tracks: Dissolve by Absofacto, Notion by The Rare Occasions, Heat Waves by Glass Animals.",
        hoursAgo: 65,
        isRead: true,
      },
    ],
  },
  {
    id: "amazon-shipped",
    subject: "Your order has shipped!",
    category: "promotions",
    contactId: "amazon",
    messages: [
      {
        from: "amazon",
        bodyHtml: "<p>Great news! Your order has shipped.</p><p><strong>Order #112-4567890-1234567</strong></p><p>Mechanical Keyboard - Keychron Q1 Pro<br>Estimated delivery: <strong>February 10, 2026</strong></p><p><a href='#'>Track your package</a></p>",
        bodyText: "Your order has shipped! Mechanical Keyboard - Keychron Q1 Pro. Estimated delivery: February 10, 2026.",
        hoursAgo: 16,
        isRead: true,
      },
    ],
    labels: ["Receipts"],
  },
  {
    id: "amazon-deals",
    subject: "Deals we think you'll love",
    category: "promotions",
    contactId: "amazon",
    messages: [
      {
        from: "amazon",
        bodyHtml: "<p>Based on your recent browsing:</p><ul><li><strong>Sony WH-1000XM5</strong> — $278 (was $349) — 20% off</li><li><strong>Anker USB-C Hub</strong> — $29.99 (was $45) — Lightning deal</li><li><strong>Logitech MX Master 3S</strong> — $79 (was $99)</li></ul><p>These deals end in 12 hours.</p><p><a href='#'>Shop now</a></p>",
        bodyText: "Deals: Sony WH-1000XM5 $278, Anker USB-C Hub $29.99, Logitech MX Master 3S $79. Ends in 12 hours.",
        hoursAgo: 38,
        isRead: true,
      },
    ],
  },
  {
    id: "amazon-review-request",
    subject: "How was your recent purchase?",
    category: "promotions",
    contactId: "amazon",
    messages: [
      {
        from: "amazon",
        bodyHtml: "<p>We'd love your feedback!</p><p>You recently purchased: <strong>\"Designing Data-Intensive Applications\" by Martin Kleppmann</strong></p><p>How would you rate this item?</p><p>Your reviews help other customers make informed decisions.</p><p><a href='#'>Write a review</a></p>",
        bodyText: "Rate your recent purchase: Designing Data-Intensive Applications by Martin Kleppmann. Write a review.",
        hoursAgo: 200,
        isRead: true,
      },
    ],
  },
  {
    id: "apple-receipt",
    subject: "Your receipt from Apple",
    category: "promotions",
    contactId: "apple",
    messages: [
      {
        from: "apple",
        bodyHtml: "<p><strong>Apple Receipt</strong></p><p><strong>iCloud+ 200GB</strong><br>Monthly subscription<br>$2.99</p><p>Billed to: Visa ending in 4829<br>Date: February 1, 2026</p><p><a href='#'>View receipt</a> | <a href='#'>Manage subscriptions</a></p>",
        bodyText: "Apple receipt: iCloud+ 200GB monthly subscription $2.99. Billed Feb 1, 2026.",
        hoursAgo: 168,
        isRead: true,
      },
    ],
    labels: ["Receipts"],
  },
  {
    id: "doordash-promo",
    subject: "You've earned $10 off your next order!",
    category: "promotions",
    contactId: "doordash",
    messages: [
      {
        from: "doordash",
        bodyHtml: "<p>We miss you!</p><p>It's been a while since your last order. Here's <strong>$10 off</strong> your next delivery of $25+.</p><p>Use code: <strong>COMEBACK10</strong><br>Expires: February 15, 2026</p><p>Popular near you:</p><ul><li>Nobu Sushi — 4.8 stars, 25 min</li><li>Tartine Bakery — 4.9 stars, 20 min</li><li>Burma Superstar — 4.7 stars, 30 min</li></ul><p><a href='#'>Order now</a></p>",
        bodyText: "We miss you! $10 off your next order of $25+ with code COMEBACK10. Expires Feb 15.",
        hoursAgo: 85,
        isRead: true,
      },
    ],
  },
  {
    id: "airbnb-saved-search",
    subject: "Prices dropped for your saved search: Kyoto",
    category: "promotions",
    contactId: "airbnb",
    messages: [
      {
        from: "airbnb",
        bodyHtml: "<p>Good news! Prices dropped for places in <strong>Kyoto</strong> for your dates (April 14-17).</p><ul><li><strong>Traditional Machiya in Gion</strong> — $89/night (was $120) — Superhost</li><li><strong>Modern Loft near Fushimi Inari</strong> — $72/night (was $95)</li><li><strong>Cozy Studio with Garden View</strong> — $65/night (was $85)</li></ul><p><a href='#'>View all results</a></p>",
        bodyText: "Prices dropped for Kyoto (April 14-17): Traditional Machiya $89/night, Modern Loft $72/night, Cozy Studio $65/night.",
        hoursAgo: 20,
        isRead: false,
      },
    ],
    labels: ["Travel"],
  },
  {
    id: "uber-receipt",
    subject: "Your trip receipt",
    category: "promotions",
    contactId: "uber",
    messages: [
      {
        from: "uber",
        bodyHtml: "<p><strong>Trip Receipt</strong></p><p><strong>Date:</strong> February 7, 2026<br><strong>Route:</strong> 1455 Market St → SFO Airport<br><strong>Distance:</strong> 12.4 miles<br><strong>Duration:</strong> 28 minutes</p><table><tr><td>Base fare</td><td>$3.20</td></tr><tr><td>Distance</td><td>$12.40</td></tr><tr><td>Time</td><td>$8.96</td></tr><tr><td>Airport surcharge</td><td>$5.60</td></tr><tr><td><strong>Total</strong></td><td><strong>$30.16</strong></td></tr></table><p>Paid with Visa ending in 4829</p>",
        bodyText: "Uber trip receipt: 1455 Market St to SFO Airport. 12.4 miles, 28 min. Total: $30.16.",
        hoursAgo: 26,
        isRead: true,
      },
    ],
    labels: ["Receipts"],
  },
  {
    id: "stripe-payment",
    subject: "Payment receipt for Vercel Pro",
    category: "promotions",
    contactId: "stripe",
    messages: [
      {
        from: "stripe",
        bodyHtml: "<p><strong>Payment Receipt</strong></p><p>Your payment to <strong>Vercel Inc.</strong> was successful.</p><table><tr><td>Description</td><td>Vercel Pro Plan (Monthly)</td></tr><tr><td>Amount</td><td>$20.00</td></tr><tr><td>Date</td><td>February 1, 2026</td></tr><tr><td>Card</td><td>Visa ending in 4829</td></tr></table><p><a href='#'>View receipt</a> | <a href='#'>Manage billing</a></p>",
        bodyText: "Payment receipt: Vercel Pro Plan $20.00/month. Feb 1, 2026. Visa ending in 4829.",
        hoursAgo: 170,
        isRead: true,
      },
    ],
    labels: ["Receipts"],
  },
];
