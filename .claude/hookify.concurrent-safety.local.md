---
name: block-git-checkout-src-files
enabled: true
event: bash
action: block
conditions:
  - field: command
    operator: regex_match
    pattern: git\s+checkout\s+(?!-b).*src/
---

**BLOCKED: git checkout on src/ files**

Multiple Claude sessions run concurrently on this codebase. Running `git checkout` on source files will **destroy work from other agents**.

Instead of reverting files:
- Only edit the specific lines you need to change
- If a file has unexpected changes, those are from another agent — leave them alone
- Use `git diff <file>` to understand what changed before taking action
