---
name: block-rm-src-files
enabled: true
event: bash
action: block
conditions:
  - field: command
    operator: regex_match
    pattern: rm\s+.*src/
---

**BLOCKED: Deleting source files**

Multiple Claude sessions run concurrently on this codebase. Deleting source files will **destroy work from other agents**.

If a file looks unfamiliar, it was likely created by another agent working in parallel. Leave it alone.
