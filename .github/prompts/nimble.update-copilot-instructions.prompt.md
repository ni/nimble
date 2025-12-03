---
name: nimble.update-copilot-instructions
description: Synchronize the AI coding agent instructions with the latest project documentation and patterns.
---

**Goal**: Synchronize the AI coding agent instructions (`copilot-instructions.md`) with the latest project documentation and patterns.

**Role**: You are an expert maintainer of the Nimble Design System. Your job is to ensure that the instructions provided to AI agents are accurate, concise, and up-to-date.

## Guiding Principles

Follow GitHub's best practices for instruction files (see [Unlocking the Full Power of Copilot Code Review: Master Your Instructions Files](https://github.blog/ai-and-ml/unlocking-the-full-power-of-copilot-code-review-master-your-instructions-files/)):

1. **Prefer Links Over Duplication**: Link to existing documentation (CONTRIBUTING.md, specs, guidelines) rather than duplicating content. This reduces maintenance burden and ensures single source of truth.
2. **Essential Information Only**: Include only critical patterns, gotchas, and quick-reference snippets that AI agents need immediately. Detailed documentation belongs in the linked files.
3. **Code Snippets for Common Patterns**: Include concise, verified code examples for frequently-used patterns (component registration, testing setup, templates, styles) that would otherwise require multiple file reads.
4. **Maintainability**: Every duplicated line is a maintenance liability. Ask: "Does this need to be here, or can we link to it?"

## Context Sources
Read the following files to understand the current "source of truth":
1.  `CONTRIBUTING.md` (Root)
2.  `packages/nimble-components/CONTRIBUTING.md`
4.  `packages/nimble-components/docs/css-guidelines.md`
2.  `packages/spright-components/CONTRIBUTING.md`
3.  `packages/ok-components/CONTRIBUTING.md`
5.  `packages/storybook/CONTRIBUTING.md`
6.  `packages/storybook/src/docs/component-status.mdx`

## Target Files
You will be updating the following instruction files:
1.  `.github/copilot-instructions.md` (Global instructions)
2.  `packages/nimble-components/copilot-instructions.md`
3.  `packages/ok-components/copilot-instructions.md`
4.  `packages/spright-components/copilot-instructions.md`

## Instructions

1.  **Analyze Changes**: Compare the "Context Sources" against the "Target Files". Look for:
    *   New build commands or workflow steps.
    *   Changes to file structure or naming conventions.
    *   New required patterns (e.g., new testing requirements).
    *   Deprecated patterns that should be removed from instructions.

2.  **Verify Code Snippets**:
    *   Check that the code snippets in `copilot-instructions.md` (e.g., `index.ts` boilerplate, `styles.ts` patterns) match the current best practices found in the codebase.
    *   **Only include snippets that are**: (a) used frequently, (b) hard to infer from docs alone, (c) critical to get right.
    *   *Tip*: You may need to read a few actual component files (e.g., `packages/nimble-components/src/button/index.ts`) to verify the patterns are still valid.

3.  **Reduce Duplication**:
    *   Review all duplicated content. Can it be replaced with a link + 1-sentence summary?
    *   Keep: Command references, critical patterns, common pitfalls with examples.
    *   Remove: Detailed explanations that exist in linked docs, policy details, extended rationale.

4.  **Update Global Instructions** (`.github/copilot-instructions.md`):
    *   Ensure links to documentation are correct.
    *   Update "Common Pitfalls" if new recurring issues have been identified.
    *   Keep it high-level: Architecture, Workflows, and Global Patterns.
    *   Prefer "See [doc](link)" over copying paragraphs.

5.  **Update Package Instructions**:
    *   **Nimble**: Ensure specific implementation details (registration, testing fixtures) are accurate and minimal.
    *   **Ok/Spright**: Ensure the "Requirements vs Nimble" comparison is still accurate.
    *   Link to detailed guidelines rather than duplicating them.

6.  **Output**:
    *   Present the changes as file edits (using `replace_string_in_file` or by showing the diff).
    *   If no changes are needed, explicitly state that the instructions are up-to-date.
    *   If removing duplicated content, briefly explain what was removed and where to find it.
