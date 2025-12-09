---
name: nimble.update-agent-instructions
description: Synchronize the AI coding agent instructions with the latest project documentation and patterns.
---

**Goal**: Synchronize the AI coding agent instructions with the latest project documentation, patterns, and VS Code best practices (using directory-scoped `agents.md` files).

**Role**: You are an expert maintainer of the Nimble Design System. Your job is to ensure that the instructions provided to AI agents are accurate, concise, up-to-date, and structured to create effective "Agents.md" instructions.

## Guiding Principles

Follow the latest VS Code and GitHub Copilot best practices:

1.  **Directory-Scoped Instructions**: Use `agents.md` files placed in the root of each workspace/package (e.g., `packages/nimble-components/agents.md`). This allows the agent to automatically adopt the correct context based on the active working directory.
2.  **Include Overview**: Start with a high-level summary of the package's purpose and tech stack.
3.  **Include Build & Test Commands**: Provide copy-pasteable commands for building and testing the specific package.
4.  **Prefer Links Over Duplication**: Link to existing documentation (CONTRIBUTING.md, specs, guidelines) rather than duplicating content. This reduces maintenance burden and ensures single source of truth.
5.  **Essential Information Only**: Include only critical patterns, gotchas, and quick-reference snippets that AI agents need immediately. Detailed documentation belongs in the linked files.
6.  **Code Snippets for Common Patterns**: Include concise, verified code examples for frequently-used patterns (component registration, testing setup, templates, styles) that would otherwise require multiple file reads.

## Context Sources
Read the following files to understand the current "source of truth":
1.  `CONTRIBUTING.md` (Root)
2.  `packages/nimble-components/CONTRIBUTING.md`
3.  `packages/nimble-components/docs/css-guidelines.md`
4.  `packages/spright-components/CONTRIBUTING.md`
5.  `packages/ok-components/CONTRIBUTING.md`
6.  `packages/storybook/CONTRIBUTING.md`
7.  `packages/storybook/src/docs/component-status.mdx`

## Target Files
You will be creating or updating the following instruction files:
1.  `.github/copilot-instructions.md` (Global instructions - applies to everything)
2.  `packages/nimble-components/agents.md`
3.  `packages/ok-components/agents.md`
4.  `packages/spright-components/agents.md`
5.  `packages/angular-workspace/agents.md`
6.  `packages/blazor-workspace/agents.md`
7.  `packages/react-workspace/agents.md`
8.  `packages/nimble-tokens/agents.md`
9.  `packages/storybook/agents.md`

## Instructions

1.  **Analyze Changes**: Compare the "Context Sources" against the "Target Files". Look for:
    *   New build commands or workflow steps.
    *   Changes to file structure or naming conventions.
    *   New required patterns (e.g., new testing requirements).
    *   Deprecated patterns that should be removed from instructions.

2.  **Structure the File**:
    *   **Overview**: A brief description of the package.
    *   **Build & Test**: Specific `npm run` or `dotnet` commands for this package.
    *   **Common Pitfalls**: A list of "Do's and Don'ts".
    *   **Key References**: Links to local `CONTRIBUTING.md` and other docs.
    *   **Core Patterns**: (Optional) Code snippets for common tasks.

3.  **Verify Code Snippets**:
    *   Check that the code snippets (e.g., `index.ts` boilerplate, `styles.ts` patterns) match the current best practices found in the codebase.
    *   **Only include snippets that are**: (a) used frequently, (b) hard to infer from docs alone, (c) critical to get right.

4.  **Reduce Duplication**:
    *   Review all duplicated content. Can it be replaced with a link + 1-sentence summary?
    *   Keep: Command references, critical patterns, common pitfalls with examples.
    *   Remove: Detailed explanations that exist in linked docs, policy details, extended rationale.

4.  **Update Global Instructions** (`.github/copilot-instructions.md`):
    *   Ensure links to documentation are correct.
    *   Update "Common Pitfalls" if new recurring issues have been identified.
    *   Keep it high-level: Architecture, Workflows, and Global Patterns.


6.  **Output**:
    *   Present the changes as file edits (using `replace_string_in_file` or by showing the diff).
    *   If no changes are needed, explicitly state that the instructions are up-to-date.