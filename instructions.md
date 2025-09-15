# Agent Contribution Instructions

Guidelines for automated or AI-assisted agents ("agents") contributing changes to the Nimble monorepo. These rules help ensure generated changes integrate smoothly with existing workflows, versioning, quality gates, and documentation.

---
## 1. Purpose & Scope
Use this document when an automated agent proposes code, docs, tests, or dependency updates. It supplements (not replaces) human contributor docs in `README.md` and `CONTRIBUTING.md`.

Agents MUST:
- Preserve existing architecture, coding style, and publishing workflows.
- Keep changes minimal, incremental, reviewable.
- Avoid generating speculative large-scale refactors unless explicitly requested.

---
## 2. Environment & Tooling Expectations
Prerequisites (already documented for humans; list repeated here so agents can validate):
- Node.js 24+ and npm 10+ available (`node --version`, `npm --version`).
- .NET 8 SDK (`dotnet --info` shows an 8.x SDK) for Blazor-related packages.
- Playwright dependencies installed (happens via postinstall script: `npm install`).

Core commands (run from repo root unless noted):
- Install: `npm install`
- Full build: `npm run build`
- Storybook: `npm run storybook`
- Lint (all workspaces): `npm run lint`
- Tests (all workspaces): `npm run test`

Run only the minimal subset of scripts necessary to validate the affected packages.

---
## 3. Versioning & Change Files (Human-only)
Agents must NOT create, edit, or delete Beachball change files or recommend specific semantic version bump types. After an agent prepares a PR, a human maintainer will manually:
1. Review public surface impact.
2. Run `npm run change` in repo root.
3. Select appropriate change classification following existing documentation.
4. Amend description as needed.

Agent responsibility stops at: produce focused, well‑tested diff + clearly state (optionally) whether external behavior appears affected. Avoid embedding suggested version numbers.

---
## 4. Determining Affected Packages
An agent should infer impacted packages by inspecting modified paths:
- `packages/<name>/...` → that package.
- Cross-dependency: if you modify tokens (`@ni/nimble-tokens`) and a component consumes the changed tokens in a meaningful way (new token names, removed tokens), both may require version bumps.
- Framework bindings (Angular / Blazor / React) wrapping a changed web component typically need a bump ONLY if wrapper API surface or rendered markup contract changes.

When uncertain, default to the narrowest plausible set and flag for human review in the PR description.

---
## 5. Specs & Design Alignment
For NEW components, new table columns, or significant architecture shifts:
- Do NOT implement directly without a spec. Create a spec using templates under `/specs/templates/` or the component-specific paths described in `/specs/README.md`.
- Place spec in correct directory (`/specs/...` for high-level designs, or component `specs/` folder for component work).

Agents MUST NOT unilaterally author full implementations of unspecced components.

### Component spec trio (Nimble components)
For a new Nimble component the expectation (from `nimble-components` package docs) is:
1. Interaction Design (IxD) spec (behavior & states)
2. Visual Design (ViD) spec (Figma reference, tokens, spacing, icons)
3. Technical design / implementation spec (API: attributes, properties, events, slots, theming, accessibility)

All three must be approved (PR merged) before shipping a non‑incubating component.

### Incubating components policy
If a component is intentionally partial / exploratory:
- Mark status ⚠️ in component status table
- Storybook: add red banner + prefix stories with `Incubating/`
- Add shared and contributing team CODEOWNERS
- Still requires: spec (scope + explicit out-of-scope), lint, tests, a11y baseline, chromatic coverage
Agents should not remove incubating markings without explicit human confirmation.

---
## 6. Code Generation & Style
Follow existing project conventions:
- TypeScript strictness: mirror existing tsconfig; do not relax compiler options.
- Prefer existing utility functions / patterns (search before adding a new helper).
- Do not auto-format untouched files. Only run formatting on changed files (project scripts handle this).
- Maintain relative repo-root style for markdown links (e.g., `/packages/nimble-components/docs/...`).
- Avoid introducing new build-time tools unless explicitly requested.

When adding files:
- Co-locate tests with existing package conventions (e.g., Jasmine specs under `src` mirrors).
- Name web component files consistently (look at similar components before introducing new naming variants).

### Required core file set for new Nimble web component
Folder: `packages/nimble-components/src/<component-name>/`
- `index.ts` (class + registration + exported `*-tag` constant)
- `styles.ts` (component styles; shared theme tokens live elsewhere)
- `template.ts` (only if custom template not derived from foundation)
- `types.ts` (enum-like & public types)
- `specs/README.md` (implementation spec) + any IxD / HLD docs
- `tests/<component>.spec.ts`
- `testing/<component>.pageobject.ts` (page object if testing complexity warrants)
- Optional: `components/` for private nested components; `models/` for API types

Add component import to `src/all-components.ts` so bundling includes it.

### Attribute vs class usage
Represent control state via attributes (never rely on implicit internal classes). Follow patterns:
- Appearance variants: `appearance`, optional `appearance-variant`
- Visibility toggles: `<part>-hidden` or `<part>-visible` (only one)
- Enum values: lower-kebab-case; default is `undefined` entry in enum object

### Focus delegation
If shadow DOM uses focusable internal parts, likely set `delegatesFocus: true` and mirror `tabindex` via `@attr({ attribute: 'tabindex', ... })`.
Agent additions changing focus behaviors must add tests for tab order + keyboard interactions.

### Mixins
Use FAST `applyMixins` for external (FAST) mixins; use constrained mixin pattern for internal cross-component behaviors (see table column mixins). Avoid inventing new mixin mechanisms.

### Theming & tokens
Use theme-aware tokens (mapped in `theme-provider/`) instead of hard-coded color/spacing values. Adding new token usage: verify token exists; if not, add base token (`nimble-tokens`) then theme mapping.

---
## 7. Testing Requirements
Each behavioral change should include at least one of:
- Unit tests (Jasmine, bUnit, etc.) validating logic.
- Visual/story update when UI-affecting (ensure Storybook story modified or added).
- Markdown spec update if fulfilling previously approved spec sections.

Agents should:
1. Add tests before (TDD) or alongside implementation.
2. Avoid brittle timing-dependent tests; prefer deterministic DOM queries.
3. Skip adding cross-browser duplicates if existing pattern centralizes them.

### Nimble web components test specifics
- Use Karma + Jasmine specs (`*.spec.ts`); watch mode: `npm run tdd:watch -w @ni/nimble-components`.
- Provide coverage for: attribute reflection, public methods, events, accessibility ARIA mappings, focus delegation, mixin behaviors, token driven style conditions (where logic, not CSS only).
- Skip per-browser flakiness only with `#SkipChrome|#SkipFirefox|#SkipWebkit` tag AND linked issue.
- Prefer `fixture` utilities (`src/utilities/tests/fixture.ts`) for lifecycle management.

### Angular wrappers
- Each web component gets a directive with selector = tag name.
- Properties via `@Input` writing through `Renderer2`; events via `@HostListener` mapped to `@Output`.
- Form controls implement or derive from `ControlValueAccessor` patterns; test with `[(ngModel)]` & reactive forms binding.
- Add module per directive; tests assert custom element registration occurs when module imported.

### Blazor wrappers
- Wrapper = `.razor` + `.razor.cs` partial class inheriting `ComponentBase`.
- Always include `AdditionalAttributes` dictionary param; support `ChildContent` if slotted content.
- Two-way binding: `Value` + `ValueChanged`; for form inputs derive from `NimbleInputBase<T>`, else manage custom event args via JS interop if needed.
- Acceptance (Playwright) tests for JS interop heavy components; bUnit unit tests for rendering / parameter API.

### Storybook / Chromatic
- Provide `component-name.stories.ts` (interactive stories) + `component-name-matrix.stories.ts` (state matrix) + docs `component-name.mdx`.
- Matrix story naming: no component name repetition, theme dimension first if variable, use `$` delimiter for fixed dimension values, include absent boolean pattern (`Read Only` vs `Read Only Absent`).
- Avoid coupling multiple components into one story group.

### Performance benchmarks (optional but recommended for complex components)
- Add page under `packages/performance/src/<component>`; register in `vite.config.js` + `lighthouserc.js`.
- Use User Timing marks to measure key phases.

Do NOT disable failing tests unless explicitly directed; instead surface failure context.

---
## 8. Validation Checklist Before Proposing PR
Minimum done state for an agent-generated branch:
- [ ] Build passes for affected packages (`npm run build -w <pkg>` or full monorepo if ambiguous).
- [ ] Lint & format clean (`npm run lint` + `npm run format` if needed).
- [ ] Tests pass for affected packages (use targeted scripts like `npm run tdd -w @ni/nimble-components`).
- [ ] (Human maintainer will run `npm run change`; agent did NOT add change file.)
- [ ] No unrelated file churn (confirm diff is focused).
- [ ] Stories updated (if UI change) & no obvious regressions in local Storybook.
- [ ] Dependencies added with correct `--workspace` and peer dependency flags where needed.
- [ ] For new or modified tokens: tokens build (`npm run build -w @ni/nimble-tokens`) and consuming components still compile.
- [ ] Angular / Blazor / React wrappers updated if public API surface changed (attributes, events, slots affecting parameters).
- [ ] Accessibility reviewed (keyboard focus, ARIA, reduced motion) where relevant.
- [ ] Incubating markings applied/updated if component not production-ready.
- [ ] Spec links (IxD / ViD / Tech) referenced in PR body for new component or major change.

Agents should include this filled checklist (checked/unchecked) in the PR body.

---
## 9. Dependency Updates
Allow Renovate to manage routine dependency bumps. Agents should only:
- Add new dependencies explicitly required by the change.
- Avoid adding overlapping or redundant libraries (search first).
- Use `--save-peer` for Angular libraries when appropriate (see root `CONTRIBUTING.md`).
- Not pin versions tighter than existing patterns unless security fix demands it.

If adding a dependency triggers transitive vulnerabilities, either choose an alternative or document rationale in the PR.

---
## 10. Documentation Edits
- Consumer-facing docs: `README.md` in package root.
- Contributor docs: `CONTRIBUTING.md` (package or root).
- Lower-level or component docs: `docs/` or component `specs/` folder.
- Preserve relative links from repo root form.
- Avoid duplicating content—link to existing sections if overlapping.

Additional doc placement conventions:
- Angular directive-specific behavior: Angular package `CONTRIBUTING.md`.
- Blazor interop or acceptance test patterns: Blazor workspace `CONTRIBUTING.md`.
- Storybook usage guidance (design, examples, accessibility) lives in `*.mdx` files; agent edits should not remove required sections, only comment out empty ones.
- Performance measurement methodology changes: performance package README or contributing file.

---
## 11. Security & Compliance
Agents MUST:
- Avoid including external code snippets longer than a few lines unless license-compatible and attribution added; prefer referencing upstream.
- Never insert secrets, tokens, or internal-only URLs beyond what already exists.
- Highlight any newly enabled remote network behavior.

---
## 12. Storybook & Visual Review
When altering component appearance or adding props/slots/events:
1. Update relevant stories or create new focused stories.
2. Keep stories minimal—no extraneous layout wrappers unless required.
3. Avoid snapshot noise: do not rename stories without purpose.
4. Prepare for Chromatic diffs; ensure intentional changes are isolated.

Agents adding a new component must create:
- Standard story file with primary args & controls
- Matrix story enumerating permutations (themes, appearances, states) used for visual regression
- MDX docs referencing spec(s), usage guidance (required for Nimble, optional for Spright), and API controls

Spright components: usage guidance and full IxD/ViD are recommended but may be optional (see Spright policy table). Agents must not silently “promote” a Spright component to Nimble without human approval.

---
## 13. Prohibited / Caution Areas for Agents
Avoid unless explicitly instructed:
- Broad refactors (renames, restructuring directories) across multiple packages.
- Changing build tooling configs (Rollup, Karma, TS) globally.
- Adding new monorepo packages.
- Editing `.github/` workflows / security policies.
- Mass converting syntax for stylistic preference.
- Disabling or skipping tests (use `xit`) without linked issue & maintainer approval.

---
## 14. Typical Task Playbooks
### A. Minor Component Enhancement
1. Modify component implementation + add/adjust tests.
2. Update or add a Storybook story.
3. Run validation checklist (human will add change file).

### B. Bug Fix
1. Reproduce in test; add failing test.
2. Implement fix.
3. Validate (human classifies version during change file creation).

### C. Token Addition
1. Add token(s) in `@ni/nimble-tokens`.
2. Update consuming components if needed.
3. Update docs/spec if token is part of public contract.
4. Human chooses version bumps.

### F. Angular Directive Extension
1. Add new `@Input` / `@Output` mapping to underlying element property/event.
2. Add tests covering template bindings (`[prop]`, attribute presence, form control integration if applicable).
3. Update Storybook docs if it changes consumer API surface indirectly.
4. Human handles change file.

### G. Blazor Wrapper Update
1. Add parameter property (nullable where appropriate) + event callback for two-way binding.
2. Update `.razor` template binding attribute & event.
3. Add bUnit test; add acceptance Playwright test if JS interop changes.
4. Human handles change file.

### H. Performance Benchmark Addition
1. Duplicate existing benchmark folder; adjust entry HTML + script.
2. Register in `vite.config.js` & `lighthouserc.js`.
3. Mark user timing events for mount / interaction phases.
4. Optional: link benchmark results in PR.

### D. Doc Clarification (No Behavior Change)
1. Edit markdown.
2. Use change type `none`.
3. Ensure no accidental source edits.

### E. New Component (Post-Spec Approval)
1. Implement under correct folder structure with `specs/README.md` linked.
2. Add stories + tests.
3. Human determines version classification.

---
## 15. Commit & PR Hygiene
- Prefer small, logical commits; final merge will squash, but incremental clarity aids review.
- PR title succinctly states change; body includes:
  - Overview
  - Motivation (link issue / spec)
  - Checklist (Section 8)
  - Breaking change notes (if any)
- Reference spec path when applicable.

---
## 16. Output Quality Expectations for Agents
Generated diffs should:
- Contain only minimal necessary new lines / imports.
- Reuse existing patterns (scan sibling components).
- Provide inline comments ONLY where logic is non-obvious.

If uncertain about an approach, agent should propose alternatives in PR description instead of over-implementing.

---
## 17. Fast Failure & Escalation
If build/lint/test fails:
1. Collect concise failure log excerpt (not entire output) in PR body.
2. Suggest likely root cause + remediation options.
3. Do NOT blindly retry with random edits.

---
## 18. Appendix: Quick Command Reference
| Intent | Command (root) |
|--------|----------------|
| Install deps | `npm install` |
| Build all | `npm run build` |
| Build single package | `npm run build -w @ni/nimble-components` |
| Build tokens only | `npm run build -w @ni/nimble-tokens` |
| Lint all | `npm run lint` |
| Format changed files | `npm run format -w @ni/nimble-components` |
| Unit tests (components) | `npm run tdd -w @ni/nimble-components` |
| Unit tests (tokens dep consumers) | `npm run tdd -w @ni/spright-components` |
| Angular directive tests | `npm run tdd -w @ni/nimble-angular` |
| Blazor build (solution) | open solution or `dotnet build` in `packages/blazor-workspace` |
| Storybook (components) | `npm run storybook -w @ni/nimble-components` |
| Change file | `npm run change` |
| Sync after failed publish | `npm run sync` |
| Performance run | `npm run performance -w packages/performance` |
| Site start (landing) | `npm run start:landing -w @ni-private/site` |

---
## 19. When to Ask for Human Review Early
Agents should surface uncertainty early when:
- Multiple packages might need coordinated version bumps.
- A change could simplify by altering shared abstractions.
- Performance or accessibility trade-offs exist.

In such cases: open a draft PR with rationale + open questions.

---
## 20. Maintenance of This File
Human maintainers should periodically review this file when:
- Tooling versions / workflows change.
- New package types introduced.
- Spec or incubating policies updated.

Agents should not modify this file unless instructed or to fix clearly outdated factual information (include justification in PR body).

---
**End of Agent Contribution Instructions**
