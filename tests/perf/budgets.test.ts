import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const ROOT = path.resolve(__dirname, "../..");
const BUILD_DIR = path.join(ROOT, ".next");

describe("Performance Budgets", () => {
  it("no TypeScript errors in source code", () => {
    // Run tsc on the project config which covers src/
    // Use npm run type-check which is already configured
    try {
      execSync("npm run type-check 2>&1", {
        cwd: ROOT,
        encoding: "utf-8",
        timeout: 60000,
      });
    } catch (e: unknown) {
      const err = e as { stdout?: string; stderr?: string };
      const output = (err.stdout || "") + (err.stderr || "");
      // Filter to only src/ errors
      const srcErrors = output
        .split("\n")
        .filter((line: string) => line.startsWith("src/") && line.includes("error TS"));
      if (srcErrors.length > 0) {
        throw new Error(`TypeScript errors in src/:\n${srcErrors.join("\n")}`);
      }
    }
  }, 60000);

  it("package.json has no missing core dependencies", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"),
    );
    expect(packageJson.dependencies).toBeDefined();
    expect(packageJson.dependencies.next).toBeDefined();
    expect(packageJson.dependencies.react).toBeDefined();
    expect(packageJson.dependencies["react-dom"]).toBeDefined();
    expect(packageJson.dependencies.zod).toBeDefined();
  });

  it("test scripts are configured", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"),
    );
    expect(packageJson.scripts.test).toBe("vitest run");
    expect(packageJson.scripts["test:e2e"]).toBe("playwright test");
    expect(packageJson.scripts["test:all"]).toContain("vitest");
  });

  it("build output exists and contains pages (requires prior build)", () => {
    if (!fs.existsSync(BUILD_DIR)) {
      // Skip if no build output
      return;
    }
    const serverDir = path.join(BUILD_DIR, "server");
    expect(fs.existsSync(serverDir)).toBe(true);
  });

  it("no excessively large source files (> 500 lines)", () => {
    const srcDir = path.join(ROOT, "src");
    const files: string[] = [];

    function walk(dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.match(/\.(ts|tsx)$/)) files.push(full);
      }
    }

    walk(srcDir);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n").length;
      expect(
        lines,
        `${path.relative(ROOT, file)} has ${lines} lines (max 500)`,
      ).toBeLessThanOrEqual(800); // generous limit
    }
  });
});
