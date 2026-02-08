import type { ThreadTemplate } from "../../types";

/** Newsletters, community, tech digests (~6 threads) */
export const FORUM_THREADS: ThreadTemplate[] = [
  {
    id: "verge-design-language",
    subject: "Tech news: Apple's new design language",
    category: "forums",
    contactId: "the-verge",
    messages: [
      {
        from: "the-verge",
        bodyHtml: "<p><strong>This week in tech:</strong></p><p>Apple unveiled a radical new design system at their developer conference, moving away from the flat aesthetic that has defined iOS for over a decade. The new \"Spatial Design\" language brings depth, texture, and physicality back to interfaces.</p><p>Google responded with updates to Material You, emphasizing adaptive color and dynamic theming. Meanwhile, Microsoft is quietly shipping Fluent 3 across its product line.</p><p>The design world is buzzing: are we entering a post-flat era?</p><p><a href='#'>Read the full story</a></p>",
        bodyText: "Apple unveils radical new design system, Google responds with Material You updates, and why everyone is talking about the post-flat era.",
        hoursAgo: 55,
        isRead: true,
      },
    ],
  },
  {
    id: "verge-ai-roundup",
    subject: "AI Roundup: Claude 4.5, GPT-5, and the agent wars",
    category: "forums",
    contactId: "the-verge",
    messages: [
      {
        from: "the-verge",
        bodyHtml: "<p><strong>AI Roundup — February 2026</strong></p><p>The AI landscape is moving faster than ever:</p><ul><li><strong>Anthropic</strong> launched Claude 4.5 with extended thinking and tool use that actually works</li><li><strong>OpenAI</strong> previewed GPT-5 with native multimodal reasoning</li><li><strong>Google</strong> integrated Gemini 2.0 deep into Android and Workspace</li></ul><p>But the real story is agents. Every major lab is betting that autonomous AI agents — not chatbots — are the next platform shift. Early adopters report 3-5x productivity gains on coding tasks.</p><p><a href='#'>Read the full analysis</a></p>",
        bodyText: "AI Roundup: Claude 4.5, GPT-5, Gemini 2.0. The real story is agents — every lab betting on autonomous AI as the next platform shift.",
        hoursAgo: 30,
        isRead: true,
      },
    ],
  },
  {
    id: "hn-digest-weekly",
    subject: "Top stories this week on Hacker News",
    category: "forums",
    contactId: "hacker-news",
    messages: [
      {
        from: "hacker-news",
        bodyHtml: "<p><strong>Hacker News Weekly Digest</strong></p><ol><li><strong>Show HN: I built a SQLite-based email client</strong> (723 points, 284 comments)</li><li><strong>Why we moved from Kubernetes back to bare metal</strong> (651 points, 312 comments)</li><li><strong>The hidden cost of JavaScript frameworks</strong> (589 points, 445 comments)</li><li><strong>Ask HN: What's your stack for side projects in 2026?</strong> (502 points, 387 comments)</li><li><strong>Postgres just added native vector search</strong> (478 points, 156 comments)</li></ol><p><a href='#'>View all top stories</a></p>",
        bodyText: "Top HN stories: SQLite email client (723pts), K8s to bare metal (651pts), JS framework costs (589pts), 2026 side project stacks (502pts).",
        hoursAgo: 42,
        isRead: true,
      },
    ],
  },
  {
    id: "bytes-newsletter-weekly",
    subject: "Bytes: React 20 signals, Bun 2.0, and TypeScript drama",
    category: "forums",
    contactId: "bytes-newsletter",
    messages: [
      {
        from: "bytes-newsletter",
        bodyHtml: "<p><strong>Bytes.dev — Your weekly JS newsletter</strong></p><p><strong>React 20 signals: The hot takes are wrong</strong><br>Everyone lost their minds when React announced signals support. But if you actually read the RFC (we did, so you don't have to), it's more nuanced than Twitter thinks. Signals are opt-in, hooks aren't going anywhere, and the performance gains are real.</p><p><strong>Bun 2.0 is here</strong><br>Jarred Sumner's runtime hit 2.0 with native SQLite, improved Node.js compat, and a bundler that's actually fast. The ecosystem gap is closing.</p><p><strong>TypeScript 6.0 beta drama</strong><br>The proposal to remove enums sparked a 500-comment GitHub issue. Never change, TC39.</p>",
        bodyText: "Bytes.dev: React 20 signals (hot takes are wrong), Bun 2.0 with native SQLite, TypeScript 6.0 beta enum drama.",
        hoursAgo: 58,
        isRead: true,
      },
    ],
  },
  {
    id: "tldr-daily",
    subject: "TLDR: Cloudflare blocks largest DDoS ever, AI agents go mainstream",
    category: "forums",
    contactId: "tldr-newsletter",
    messages: [
      {
        from: "tldr-newsletter",
        bodyHtml: "<p><strong>TLDR — Your daily tech newsletter</strong></p><p><strong>Big Tech & Startups</strong></p><ul><li>Cloudflare blocked a 7.1 Tbps DDoS attack, the largest ever recorded</li><li>Anthropic's Claude Code shipped agent mode with file editing and terminal access</li><li>Figma acquired an AI startup for $350M to power auto-layout suggestions</li></ul><p><strong>Dev Tools</strong></p><ul><li>Astro 5.0 launched with server islands and improved partial hydration</li><li>Deno 3 adds full npm compatibility without configuration</li></ul><p><a href='#'>Read more</a></p>",
        bodyText: "TLDR: Cloudflare blocks 7.1 Tbps DDoS, Claude Code ships agent mode, Figma acquires AI startup, Astro 5.0 launches.",
        hoursAgo: 14,
        isRead: false,
      },
    ],
  },
  {
    id: "hn-digest-monthly",
    subject: "Ask HN: Best tech talks of 2025?",
    category: "forums",
    contactId: "hacker-news",
    messages: [
      {
        from: "hacker-news",
        bodyHtml: "<p><strong>Ask HN: Best tech talks of 2025?</strong> (347 points)</p><p>Top recommendations from the community:</p><ul><li>\"The Art of Code\" by Dylan Beattie — a classic, rewatchable yearly</li><li>\"Scaling Instagram's Backend\" — the new one from their principal engineer</li><li>\"Why SQLite?\" by Richard Hipp at FOSDEM — made people rethink their database choices</li><li>\"Building AI Agents That Actually Work\" from Anthropic's dev day</li></ul><p><a href='#'>Full thread (234 comments)</a></p>",
        bodyText: "Best tech talks of 2025: Art of Code, Scaling Instagram, Why SQLite by Richard Hipp, Building AI Agents by Anthropic.",
        hoursAgo: 90,
        isRead: true,
      },
    ],
  },
];
