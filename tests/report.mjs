#!/usr/bin/env node

/**
 * Custom test report dashboard.
 * Reads vitest + playwright JSON output and prints a colored summary.
 *
 * Usage: node tests/report.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// ANSI colors
const green = "\x1b[32m";
const red = "\x1b[31m";
const yellow = "\x1b[33m";
const cyan = "\x1b[36m";
const dim = "\x1b[2m";
const bold = "\x1b[1m";
const reset = "\x1b[0m";

function hr(char = "─", len = 60) {
  return dim + char.repeat(len) + reset;
}

function badge(pass) {
  return pass ? `${green}✓ PASS${reset}` : `${red}✗ FAIL${reset}`;
}

console.log("");
console.log(`${bold}${cyan}═══════════════════════════════════════════════════════════${reset}`);
console.log(`${bold}${cyan}  Remail Test Report Dashboard${reset}`);
console.log(`${bold}${cyan}═══════════════════════════════════════════════════════════${reset}`);
console.log("");

// ─── Vitest Results ──────────────────────────────────────────────────────────

let vitestTotal = 0;
let vitestPassed = 0;
let vitestFailed = 0;
let vitestFiles = 0;

try {
  // Try to get vitest results from a JSON reporter output
  // Otherwise, provide instructions
  const vitestOutput = path.join(root, "test-results", "vitest-results.json");
  if (fs.existsSync(vitestOutput)) {
    const data = JSON.parse(fs.readFileSync(vitestOutput, "utf-8"));
    vitestFiles = data.numTotalTestSuites || 0;
    vitestTotal = data.numTotalTests || 0;
    vitestPassed = data.numPassedTests || 0;
    vitestFailed = data.numFailedTests || 0;
  } else {
    // Count test files manually
    const testDirs = ["unit", "actions", "components", "perf"];
    for (const dir of testDirs) {
      const dirPath = path.join(__dirname, dir);
      if (!fs.existsSync(dirPath)) continue;
      const files = fs.readdirSync(dirPath, { recursive: true });
      const testFiles = files.filter((f) =>
        String(f).match(/\.test\.(ts|tsx)$/),
      );
      vitestFiles += testFiles.length;
    }
  }
} catch {
  // Silent
}

console.log(`${bold}Unit & Component Tests (Vitest)${reset}`);
console.log(hr());

if (vitestTotal > 0) {
  console.log(`  Test files:  ${bold}${vitestFiles}${reset}`);
  console.log(`  Total tests: ${bold}${vitestTotal}${reset}`);
  console.log(`  Passed:      ${green}${vitestPassed}${reset}`);
  if (vitestFailed > 0) {
    console.log(`  Failed:      ${red}${vitestFailed}${reset}`);
  }
  console.log(`  Status:      ${badge(vitestFailed === 0)}`);
} else {
  console.log(`  ${dim}Run 'npm test' to generate results${reset}`);
  console.log(`  ${dim}Test files found: ${vitestFiles}${reset}`);
}

console.log("");

// ─── Playwright Results ─────────────────────────────────────────────────────

let pwTotal = 0;
let pwPassed = 0;
let pwFailed = 0;
let pwSkipped = 0;
let pwFiles = 0;

try {
  const pwOutput = path.join(root, "test-results", "playwright-results.json");
  if (fs.existsSync(pwOutput)) {
    const data = JSON.parse(fs.readFileSync(pwOutput, "utf-8"));
    for (const suite of data.suites || []) {
      pwFiles++;
      for (const spec of suite.specs || []) {
        for (const test of spec.tests || []) {
          pwTotal++;
          const status = test.results?.[0]?.status;
          if (status === "passed") pwPassed++;
          else if (status === "failed") pwFailed++;
          else if (status === "skipped") pwSkipped++;
        }
      }
    }
  } else {
    // Count E2E spec files
    const e2eDir = path.join(__dirname, "e2e");
    if (fs.existsSync(e2eDir)) {
      const files = fs.readdirSync(e2eDir);
      pwFiles = files.filter((f) => f.endsWith(".spec.ts")).length;
    }
  }
} catch {
  // Silent
}

console.log(`${bold}E2E Tests (Playwright)${reset}`);
console.log(hr());

if (pwTotal > 0) {
  console.log(`  Spec files:  ${bold}${pwFiles}${reset}`);
  console.log(`  Total tests: ${bold}${pwTotal}${reset}`);
  console.log(`  Passed:      ${green}${pwPassed}${reset}`);
  if (pwFailed > 0) {
    console.log(`  Failed:      ${red}${pwFailed}${reset}`);
  }
  if (pwSkipped > 0) {
    console.log(`  Skipped:     ${yellow}${pwSkipped}${reset}`);
  }
  console.log(`  Status:      ${badge(pwFailed === 0)}`);
} else {
  console.log(`  ${dim}Run 'npm run test:e2e' to generate results${reset}`);
  console.log(`  ${dim}Spec files found: ${pwFiles}${reset}`);
}

console.log("");

// ─── Summary ────────────────────────────────────────────────────────────────

const totalTests = vitestTotal + pwTotal;
const totalPassed = vitestPassed + pwPassed;
const totalFailed = vitestFailed + pwFailed;
const totalFiles = vitestFiles + pwFiles;

console.log(`${bold}Summary${reset}`);
console.log(hr("═"));
console.log(`  Total test files:  ${bold}${totalFiles}${reset}`);
console.log(`  Total tests:       ${bold}${totalTests}${reset}`);
if (totalTests > 0) {
  console.log(`  Total passed:      ${green}${totalPassed}${reset}`);
  if (totalFailed > 0) {
    console.log(`  Total failed:      ${red}${totalFailed}${reset}`);
  }
  const pct = ((totalPassed / totalTests) * 100).toFixed(1);
  console.log(`  Pass rate:         ${bold}${pct}%${reset}`);
}
console.log(`  Overall:           ${badge(totalFailed === 0)}`);
console.log("");

// ─── Available Commands ─────────────────────────────────────────────────────

console.log(`${dim}Available commands:${reset}`);
console.log(`  ${cyan}npm test${reset}              Run all vitest tests`);
console.log(`  ${cyan}npm run test:watch${reset}    Watch mode`);
console.log(`  ${cyan}npm run test:coverage${reset} Coverage report`);
console.log(`  ${cyan}npm run test:unit${reset}     Unit tests only`);
console.log(`  ${cyan}npm run test:components${reset} Component tests only`);
console.log(`  ${cyan}npm run test:e2e${reset}      Playwright E2E tests`);
console.log(`  ${cyan}npm run test:a11y${reset}     Accessibility audits`);
console.log(`  ${cyan}npm run test:all${reset}      Everything`);
console.log("");
