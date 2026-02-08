import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vitest.config.ts",
    test: {
      name: "unit",
      include: ["tests/unit/**/*.test.ts", "tests/actions/**/*.test.ts"],
    },
  },
  {
    extends: "./vitest.config.ts",
    test: {
      name: "components",
      include: ["tests/components/**/*.test.tsx"],
    },
  },
]);
