# Testing

Comprehensive test infrastructure covering unit tests, server action integration tests, component tests, E2E tests, accessibility audits, visual regression snapshots, and performance budgets.

---

## Stack

| Tool | Role |
|------|------|
| **Vitest** | Unit, action, and component test runner |
| **React Testing Library** | Component rendering + user interaction |
| **@testing-library/jest-dom** | Extended DOM matchers |
| **@testing-library/user-event** | Realistic user event simulation |
| **Playwright** | E2E browser testing (Chromium, Firefox, WebKit) |
| **@axe-core/playwright** | Automated WCAG 2.1 AA accessibility audits |

---

## Commands

```bash
npm test                # Run all vitest tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report (v8 provider)
npm run test:unit       # Unit tests only (tests/unit + tests/actions)
npm run test:components # Component tests only (tests/components)
npm run test:e2e        # Playwright E2E tests (requires dev server)
npm run test:e2e:headed # Playwright in headed mode
npm run test:e2e:ui     # Playwright UI mode
npm run test:a11y       # Accessibility audits only (@a11y tag)
npm run test:all        # Vitest + Playwright
npm run test:report     # Custom test dashboard summary
```

---

## Directory Structure

```
tests/
├── setup.ts                              # RTL matchers, Next.js module mocks
├── mocks/
│   ├── supabase.ts                       # Chainable Supabase mock builder
│   └── next.ts                           # next/navigation, next/cache, next/headers mocks
├── fixtures/
│   └── data.ts                           # Factory functions + valid UUID constants
├── unit/                                 # Pure function tests
│   ├── utils.test.ts                     # cn, formatRelativeDate, htmlToSnippet, formatFileSize
│   ├── validations.test.ts               # All Zod schema valid/invalid cases
│   ├── session.test.ts                   # getSessionId, requireSessionId
│   ├── queries-dedup.test.ts             # deduplicateByThread
│   └── search-tsquery.test.ts            # tsquery conversion logic
├── actions/                              # Server action integration tests (mocked DB)
│   ├── email-actions.test.ts             # 21 email actions
│   ├── label-actions.test.ts             # Label CRUD + assignment
│   └── session-actions.test.ts           # ensureSession, preferences
├── components/                           # Component tests (RTL + user-event)
│   ├── providers/
│   │   ├── compose-provider.test.tsx     # ComposeProvider context
│   │   ├── selection-provider.test.tsx   # SelectionProvider context
│   │   └── toast-provider.test.tsx       # ToastProvider context
│   ├── compose-modal.test.tsx
│   ├── email-row.test.tsx
│   ├── inbox-toolbar.test.tsx
│   ├── keyboard-shortcuts.test.tsx
│   ├── label-picker.test.tsx
│   ├── search-bar.test.tsx
│   ├── snooze-picker.test.tsx
│   ├── theme-toggle.test.tsx
│   └── thread-actions.test.tsx
├── e2e/                                  # Playwright E2E specs
│   ├── inbox.spec.ts
│   ├── thread.spec.ts
│   ├── compose.spec.ts
│   ├── search.spec.ts
│   ├── navigation.spec.ts
│   ├── labels.spec.ts
│   ├── bulk-actions.spec.ts
│   ├── keyboard-shortcuts.spec.ts
│   ├── settings.spec.ts
│   ├── a11y.spec.ts                      # @axe-core accessibility audits
│   └── visual-regression.spec.ts         # Screenshot comparison
├── perf/
│   └── budgets.test.ts                   # TypeScript errors, deps, file size limits
└── report.mjs                            # Custom test dashboard reporter
```

---

## Test Counts

| Category | Files | Tests |
|----------|-------|-------|
| Unit tests | 5 | 74 |
| Server action tests | 3 | 36 |
| Component tests | 12 | 63 |
| Performance budgets | 1 | 5 |
| **Vitest total** | **21** | **178** |
| E2E specs | 11 | ~43 |
| **Grand total** | **32** | **~221** |

---

## Mock Architecture

### Supabase Mock (`tests/mocks/supabase.ts`)

Chainable builder that mirrors the real Supabase client API:

```ts
import { createMockSupabase } from "../mocks/supabase";

const { supabase, mockResult, mockError, mockSingle } = createMockSupabase();

// Mock a successful query
mockResult([{ id: "uuid", subject: "Test" }]);

// Mock a .single() call
mockSingle({ id: "uuid", name: "Work" });

// Mock an error
mockError("Row not found");
```

The mock intercepts `vi.mock("@/lib/supabase/service")` so all server actions use the mock client.

### Next.js Mocks (`tests/mocks/next.ts`)

Factory functions for Next.js APIs:

- `createMockRevalidatePath()` — tracks calls to `revalidatePath`
- `createMockCookies()` — in-memory cookie jar with `get`/`set`/`delete`
- `createMockRouter()` — mock `useRouter` with `push`/`replace`/`refresh`/`back`
- `createMockSearchParams()` — mock `useSearchParams` with configurable params

### Test Fixtures (`tests/fixtures/data.ts`)

Factory functions with sensible defaults and override support:

```ts
import { makeEmail, makeThread, makeContact, makeLabel, VALID_UUID } from "../fixtures/data";

const email = makeEmail({ subject: "Custom subject", is_read: false });
const thread = makeThread({ subject: "Thread subject" });
const label = makeLabel({ name: "Work", color: "#4285f4" });
```

---

## Testing Patterns

### Server Action Tests

Server actions are tested with mocked Supabase. Each test:
1. Sets up the mock return value
2. Calls the action with valid input
3. Asserts the correct Supabase chain was called
4. Verifies `revalidatePath` was called

```ts
it("toggleStar calls update with correct params", async () => {
  mockResult([]);
  await toggleStar({ emailId: VALID_UUID, starred: true });
  expect(supabase.from).toHaveBeenCalledWith("gmail_emails");
  expect(supabase.update).toHaveBeenCalledWith({ is_starred: true });
  expect(supabase.eq).toHaveBeenCalledWith("id", VALID_UUID);
});
```

### Component Tests

Components are wrapped in required providers and tested with user-event:

```ts
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ToastProvider>
      <ComposeProvider>{ui}</ComposeProvider>
    </ToastProvider>
  );
}
```

### Session Test Isolation

Next.js server modules (using `cookies()`) require `vi.doMock` + `vi.resetModules()` + dynamic `import()` for proper isolation between tests.

---

## Configuration Files

| File | Purpose |
|------|---------|
| `vitest.config.ts` | React plugin, jsdom environment, `@/` alias, v8 coverage, setup file |
| `vitest.workspace.ts` | Two projects: "unit" (tests/unit + tests/actions) and "components" (tests/components) |
| `playwright.config.ts` | 3 browsers, baseURL localhost:1122, webServer config, screenshots on failure, trace on retry |

---

## Coverage

Source files under test:

| Source | Test Type |
|--------|-----------|
| `src/lib/utils.ts` | Unit |
| `src/lib/validations.ts` | Unit |
| `src/lib/session.ts` | Unit |
| `src/lib/queries/emails.ts` | Unit (deduplicateByThread) |
| `src/lib/queries/search.ts` | Unit (tsquery conversion) |
| `src/lib/actions/email.ts` | Integration (mocked DB) |
| `src/lib/actions/labels.ts` | Integration (mocked DB) |
| `src/lib/actions/session.ts` | Integration (mocked DB) |
| `src/components/mail/*.tsx` | Component (RTL) |
| `src/components/ui/toast.tsx` | Component (RTL) |
| `src/components/theme-toggle.tsx` | Component (RTL) |
| All pages | E2E (Playwright) |
