import type { ThreadTemplate } from "../../types";

/** Dev tools, finance, calendar, deployment notifications (~20 threads) */
export const UPDATE_THREADS: ThreadTemplate[] = [
  {
    id: "github-pr-compose",
    subject: "[gmail-redesign] Pull request #42: Add compose modal",
    category: "updates",
    contactId: "github",
    messages: [
      {
        from: "github",
        bodyHtml: "<p><strong>mergify[bot]</strong> commented on pull request <a href='#'>#42</a>:</p><p>This PR has been approved and will be merged automatically when all checks pass.</p><hr><p><strong>CI Status:</strong> All checks passed<br><strong>Reviews:</strong> 2 approved<br><strong>Merge method:</strong> Squash and merge</p>",
        bodyText: "mergify[bot] commented: This PR has been approved and will be merged automatically when all checks pass.",
        hoursAgo: 3,
        isRead: false,
      },
    ],
    labels: ["Work"],
  },
  {
    id: "github-pr-search",
    subject: "[gmail-redesign] Pull request #45: Wire full-text search",
    category: "updates",
    contactId: "github",
    messages: [
      {
        from: "github",
        bodyHtml: "<p><strong>sarah-chen</strong> requested changes on pull request <a href='#'>#45</a>:</p><blockquote>The search debounce is set to 100ms — that's going to hammer the database. Let's bump it to 300ms. Also, we should add a loading skeleton while results are fetching.</blockquote>",
        bodyText: "sarah-chen requested changes on PR #45: search debounce too low at 100ms, bump to 300ms. Add loading skeleton.",
        hoursAgo: 8,
        isRead: false,
      },
    ],
    labels: ["Work"],
  },
  {
    id: "github-issue-perf",
    subject: "[gmail-redesign] Issue #38: Page load > 3s on mobile",
    category: "updates",
    contactId: "github",
    messages: [
      {
        from: "github",
        bodyHtml: "<p><strong>d-kim</strong> opened issue <a href='#'>#38</a>:</p><p>Lighthouse score on mobile is 62. Main bottlenecks:</p><ul><li>Unoptimized images (no next/image)</li><li>Large JS bundle (340kb gzipped)</li><li>No code splitting on thread view</li></ul><p>Target: Lighthouse > 90, LCP < 1.5s</p><p>Labels: <code>performance</code>, <code>priority: high</code></p>",
        bodyText: "d-kim opened issue #38: Lighthouse mobile score 62. Bottlenecks: unoptimized images, large JS bundle, no code splitting. Target: >90, LCP <1.5s.",
        hoursAgo: 50,
        isRead: true,
      },
    ],
    labels: ["Work"],
  },
  {
    id: "github-security-alert",
    subject: "[gmail-redesign] Security alert: next@15.0.3",
    category: "updates",
    contactId: "github",
    messages: [
      {
        from: "github",
        bodyHtml: "<p><strong>Dependabot</strong> found a vulnerability in <code>next@15.0.3</code>:</p><p><strong>Severity:</strong> High<br><strong>CVE:</strong> CVE-2025-XXXX<br><strong>Summary:</strong> Server-side request forgery in middleware<br><strong>Fix:</strong> Upgrade to <code>next@15.1.0</code></p><p><a href='#'>View alert</a> | <a href='#'>Create PR</a></p>",
        bodyText: "Dependabot: High severity vulnerability in next@15.0.3. SSRF in middleware. Fix: upgrade to next@15.1.0.",
        hoursAgo: 70,
        isRead: true,
      },
    ],
    labels: ["Work"],
  },
  {
    id: "jira-sprint-review",
    subject: "[PROJ-1234] Sprint review meeting notes",
    category: "updates",
    contactId: "jira",
    messages: [
      {
        from: "jira",
        bodyHtml: "<p><strong>Sprint 23 Review - Summary</strong></p><p>Completed:</p><ul><li>AUTH-89: Token refresh refactor</li><li>UI-234: Compose modal implementation</li><li>BUG-567: Fix thread sorting regression</li></ul><p>Carried over:</p><ul><li>PERF-12: Image lazy loading</li></ul><p>Velocity: 34 points (up from 29)</p><p>Next sprint starts Monday.</p>",
        bodyText: "Sprint 23 review completed. Authentication module shipped, 3 bugs fixed, velocity improved by 15%.",
        hoursAgo: 30,
        isRead: true,
      },
    ],
    labels: ["Work"],
  },
  {
    id: "jira-bug-assigned",
    subject: "[BUG-589] Thread sorting broken after archive",
    category: "updates",
    contactId: "jira",
    messages: [
      {
        from: "jira",
        bodyHtml: "<p><strong>BUG-589</strong> has been assigned to you.</p><p><strong>Reporter:</strong> Sarah Chen<br><strong>Priority:</strong> High<br><strong>Description:</strong> After archiving a thread and undoing, the thread appears at the bottom of the inbox instead of its original position. Looks like the timestamp gets updated on un-archive.</p><p><strong>Steps to reproduce:</strong></p><ol><li>Archive any thread</li><li>Click Undo within 5 seconds</li><li>Thread moves to wrong position</li></ol>",
        bodyText: "BUG-589 assigned to you. High priority. Thread sorting broken after archive + undo. Thread appears at bottom instead of original position.",
        hoursAgo: 6,
        isRead: false,
      },
    ],
    labels: ["Work"],
  },
  {
    id: "chase-statement",
    subject: "Your January statement is ready",
    category: "updates",
    contactId: "chase-bank",
    messages: [
      {
        from: "chase-bank",
        bodyHtml: "<p>Dear Customer,</p><p>Your monthly statement for account ending in <strong>4829</strong> is now available.</p><table><tr><td>Statement Period:</td><td>Jan 1 - Jan 31, 2026</td></tr><tr><td>Previous Balance:</td><td>$3,245.67</td></tr><tr><td>Payments:</td><td>-$3,245.67</td></tr><tr><td>New Charges:</td><td>$2,891.34</td></tr><tr><td><strong>New Balance:</strong></td><td><strong>$2,891.34</strong></td></tr></table><p>Payment due: February 15, 2026</p><p><a href='#'>View full statement</a></p>",
        bodyText: "Your monthly statement for account ending in 4829 is now available. New Balance: $2,891.34. Payment due: February 15, 2026.",
        hoursAgo: 10,
        isRead: true,
      },
    ],
    labels: ["Finance"],
  },
  {
    id: "chase-fraud-alert",
    subject: "Unusual activity detected on your account",
    category: "updates",
    contactId: "chase-bank",
    messages: [
      {
        from: "chase-bank",
        bodyHtml: "<p>Dear Customer,</p><p>We detected unusual activity on your debit card ending in <strong>4829</strong>:</p><p><strong>Transaction:</strong> AMAZON MARKETPLACE $847.23<br><strong>Date:</strong> February 6, 2026<br><strong>Location:</strong> Online</p><p>If you recognize this transaction, no action is needed. If not, please call us immediately at 1-800-935-9935 or reply YES to temporarily lock your card.</p>",
        bodyText: "Unusual activity detected: AMAZON MARKETPLACE $847.23 on Feb 6. If unrecognized, call 1-800-935-9935 or reply YES to lock card.",
        hoursAgo: 2,
        isRead: false,
      },
    ],
    flags: { isImportant: true },
    labels: ["Finance"],
  },
  {
    id: "dr-patel-appointment",
    subject: "Appointment reminder - February 15",
    category: "updates",
    contactId: "dr-patel",
    messages: [
      {
        from: "dr-patel",
        bodyHtml: "<p>Dear Patient,</p><p>This is a reminder that you have an appointment scheduled:</p><p><strong>Date:</strong> February 15, 2026<br><strong>Time:</strong> 2:00 PM<br><strong>Provider:</strong> Dr. Anita Patel<br><strong>Type:</strong> Annual checkup</p><p>Please arrive 10 minutes early. If you need to reschedule, please call us at (555) 123-4567 at least 24 hours in advance.</p><p>Patel Healthcare Associates</p>",
        bodyText: "Reminder: Appointment on February 15, 2026 at 2:00 PM with Dr. Anita Patel. Annual checkup. Please arrive 10 minutes early.",
        hoursAgo: 70,
        isRead: true,
      },
    ],
  },
  {
    id: "figma-comment",
    subject: "New comment on 'Dashboard Redesign v3'",
    category: "updates",
    contactId: "figma",
    messages: [
      {
        from: "figma",
        bodyHtml: "<p><strong>Sarah Chen</strong> left a comment on <a href='#'>Dashboard Redesign v3</a>:</p><blockquote>\"Love the new card layout! Can we try a version with slightly more padding between the metric cards? Also, the chart colors might need adjustment for the dark theme.\"</blockquote><p><a href='#'>View in Figma</a></p>",
        bodyText: "Sarah Chen commented on Dashboard Redesign v3: Love the new card layout! Can we try more padding between metric cards?",
        hoursAgo: 6,
        isRead: false,
      },
    ],
    labels: ["Work"],
  },
  {
    id: "figma-design-ready",
    subject: "Design ready for review: Settings page v2",
    category: "updates",
    contactId: "figma",
    messages: [
      {
        from: "figma",
        bodyHtml: "<p><strong>Nina Okonkwo</strong> marked <a href='#'>Settings page v2</a> as ready for review.</p><p>Changes include:</p><ul><li>Reorganized sections with collapsible panels</li><li>New toggle switch component</li><li>Keyboard shortcut visualization</li></ul><p><a href='#'>View in Figma</a></p>",
        bodyText: "Nina Okonkwo marked Settings page v2 as ready for review. New collapsible panels, toggle switches, keyboard shortcut visualization.",
        hoursAgo: 12,
        isRead: true,
      },
    ],
    labels: ["Work"],
  },
  {
    id: "vercel-deployment",
    subject: "Deployment successful: gmail-redesign (production)",
    category: "updates",
    contactId: "vercel",
    messages: [
      {
        from: "vercel",
        bodyHtml: "<p><strong>Deployment Summary</strong></p><p>Project: gmail-redesign<br>Environment: Production<br>Status: <span style='color: green'>Ready</span><br>URL: <a href='#'>gmail-redesign.vercel.app</a></p><p>Commit: <code>feat: add email list view with category tabs</code><br>Branch: main<br>Duration: 42s</p>",
        bodyText: "Deployment successful for gmail-redesign (production). Status: Ready. Duration: 42s.",
        hoursAgo: 4,
        isRead: true,
      },
    ],
  },
  {
    id: "vercel-build-failed",
    subject: "Build failed: gmail-redesign (preview)",
    category: "updates",
    contactId: "vercel",
    messages: [
      {
        from: "vercel",
        bodyHtml: "<p><strong>Build Failed</strong></p><p>Project: gmail-redesign<br>Environment: Preview<br>Branch: feat/keyboard-shortcuts</p><p><strong>Error:</strong></p><pre>Type error: Property 'onKeyDown' does not exist on type 'IntrinsicAttributes'.\n\n  src/components/mail/keyboard-shortcuts.tsx:45:7</pre><p><a href='#'>View build logs</a></p>",
        bodyText: "Build failed for gmail-redesign (preview). Type error: Property 'onKeyDown' does not exist. Branch: feat/keyboard-shortcuts.",
        hoursAgo: 9,
        isRead: true,
      },
    ],
  },
  {
    id: "sentry-error-spike",
    subject: "[gmail-redesign] Error spike: Cannot read properties of null",
    category: "updates",
    contactId: "sentry",
    messages: [
      {
        from: "sentry",
        bodyHtml: "<p><strong>New issue in gmail-redesign</strong></p><p><code>TypeError: Cannot read properties of null (reading 'id')</code></p><p><strong>Occurrences:</strong> 47 in the last hour<br><strong>Affected users:</strong> 12<br><strong>First seen:</strong> 2 hours ago<br><strong>Stack trace:</strong></p><pre>at ThreadView (src/app/thread/[id]/page.tsx:23)\nat renderWithHooks\nat mountIndeterminateComponent</pre><p><a href='#'>View in Sentry</a></p>",
        bodyText: "Error spike: TypeError Cannot read properties of null (reading 'id'). 47 occurrences, 12 users affected. ThreadView page.tsx:23.",
        hoursAgo: 2,
        isRead: false,
      },
    ],
    flags: { isImportant: true },
    labels: ["Work"],
  },
  {
    id: "linear-ticket-created",
    subject: "New issue: Implement keyboard shortcut help dialog",
    category: "updates",
    contactId: "linear",
    messages: [
      {
        from: "linear",
        bodyHtml: "<p><strong>MAIL-127</strong> created by David Kim</p><p><strong>Title:</strong> Implement keyboard shortcut help dialog<br><strong>Priority:</strong> Medium<br><strong>Assignee:</strong> You<br><strong>Description:</strong> Add a help dialog (triggered by ?) that shows all available keyboard shortcuts. Should match Gmail's layout.</p><p><a href='#'>View in Linear</a></p>",
        bodyText: "MAIL-127: Implement keyboard shortcut help dialog. Medium priority. Assigned to you. Triggered by ? key.",
        hoursAgo: 15,
        isRead: true,
      },
    ],
    labels: ["Work"],
  },
  {
    id: "google-calendar-meeting",
    subject: "Reminder: Architecture Review @ Thu 2pm",
    category: "updates",
    contactId: "google-calendar",
    messages: [
      {
        from: "google-calendar",
        bodyHtml: "<p><strong>Architecture Review</strong></p><p><strong>When:</strong> Thursday, February 8, 2026 2:00 PM - 2:30 PM (PST)<br><strong>Where:</strong> Google Meet (link attached)<br><strong>Who:</strong> Marcus Webb, You</p><p><strong>Notes:</strong> Review event-driven architecture RFC. Bring rollback plan.</p><p><a href='#'>Join Google Meet</a> | <a href='#'>View in Calendar</a></p>",
        bodyText: "Reminder: Architecture Review, Thu Feb 8 2pm-2:30pm. With Marcus Webb. Notes: Review event-driven RFC, bring rollback plan.",
        hoursAgo: 1,
        isRead: false,
      },
    ],
  },
  {
    id: "google-calendar-standup",
    subject: "Reminder: Daily Standup @ Fri 9:30am",
    category: "updates",
    contactId: "google-calendar",
    messages: [
      {
        from: "google-calendar",
        bodyHtml: "<p><strong>Daily Standup</strong></p><p><strong>When:</strong> Friday, February 9, 2026 9:30 AM - 9:45 AM (PST)<br><strong>Where:</strong> Zoom<br><strong>Who:</strong> Sarah Chen, David Kim, Nina Okonkwo, Zach Patel, You</p>",
        bodyText: "Reminder: Daily Standup, Fri Feb 9 9:30am. With Sarah Chen, David Kim, Nina Okonkwo, Zach Patel.",
        hoursAgo: 0.5,
        isRead: false,
      },
    ],
  },
  {
    id: "slack-mention",
    subject: "You were mentioned in #engineering",
    category: "updates",
    contactId: "slack",
    messages: [
      {
        from: "slack",
        bodyHtml: "<p><strong>Sarah Chen</strong> mentioned you in <strong>#engineering</strong>:</p><blockquote>\"@you can you check the staging deploy? The new search feature seems to return stale results after the cache TTL expires. Might be the revalidation logic.\"</blockquote><p><a href='#'>View in Slack</a></p>",
        bodyText: "Sarah Chen mentioned you in #engineering: can you check staging deploy? Search returns stale results after cache TTL expires.",
        hoursAgo: 1.5,
        isRead: false,
      },
    ],
    labels: ["Work"],
  },
  {
    id: "notion-doc-updated",
    subject: "Updates to 'Engineering Runbook'",
    category: "updates",
    contactId: "notion",
    messages: [
      {
        from: "notion",
        bodyHtml: "<p><strong>David Kim</strong> made changes to <a href='#'>Engineering Runbook</a>:</p><ul><li>Added new section: \"Incident Response Playbook\"</li><li>Updated: \"Deployment Checklist\" with rollback steps</li><li>Added: Database migration procedures</li></ul><p><a href='#'>View changes in Notion</a></p>",
        bodyText: "David Kim updated Engineering Runbook: added Incident Response Playbook, updated Deployment Checklist, added DB migration procedures.",
        hoursAgo: 20,
        isRead: true,
      },
    ],
    labels: ["Work"],
  },
  {
    id: "npm-security-advisory",
    subject: "Security advisory: 2 vulnerabilities in your dependencies",
    category: "updates",
    contactId: "npm",
    messages: [
      {
        from: "npm",
        bodyHtml: "<p><strong>npm security advisory</strong></p><p>2 vulnerabilities found in gmail-redesign:</p><table><tr><td><strong>High</strong></td><td>postcss - ReDoS via crafted CSS</td><td>Fix: ^8.4.50</td></tr><tr><td><strong>Moderate</strong></td><td>semver - ReDoS</td><td>Fix: ^7.5.4</td></tr></table><p>Run <code>npm audit fix</code> to resolve automatically.</p>",
        bodyText: "2 vulnerabilities found: postcss (High, ReDoS), semver (Moderate, ReDoS). Run npm audit fix.",
        hoursAgo: 48,
        isRead: true,
      },
    ],
  },
  {
    id: "electric-bill",
    subject: "Your February bill is ready - $127.43",
    category: "updates",
    contactId: "electric-company",
    messages: [
      {
        from: "electric-company",
        bodyHtml: "<p>Your electricity bill for the billing period January 8 - February 7, 2026 is ready.</p><p><strong>Amount Due:</strong> $127.43<br><strong>Due Date:</strong> February 28, 2026<br><strong>Usage:</strong> 845 kWh (up 12% from last month)</p><p>Tip: Your usage increased compared to the same period last year. Consider adjusting your thermostat to save energy.</p><p><a href='#'>View bill</a> | <a href='#'>Set up autopay</a></p>",
        bodyText: "February electric bill: $127.43 due Feb 28. Usage: 845 kWh (up 12%). Consider adjusting thermostat.",
        hoursAgo: 24,
        isRead: true,
      },
    ],
    labels: ["Finance"],
  },
];
