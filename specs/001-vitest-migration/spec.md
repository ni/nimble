# Feature Specification: Replace Karma/Webpack/Jasmine with Vite/Vitest

**Feature Branch**: `001-vitest-migration`
**Created**: 2025-11-25
**Status**: Draft
**Input**: User description: "Replace legacy Karma/Webpack/Jasmine stack with a modern Vite/Vitest setup"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run Unit Tests Locally (Priority: P1)

As a developer, I want to run the unit test suite for `nimble-components` using Vitest so that I can verify my changes quickly and reliably.

**Why this priority**: This is the core functionality of the test stack. Without local execution, development is blocked.

**Independent Test**: Can be tested by running the test command (e.g., `npm run test`) in the `nimble-components` package and verifying that all tests execute and pass.

**Acceptance Scenarios**:

1. **Given** the `nimble-components` package, **When** I run the test command, **Then** Vitest starts and executes all spec files.
2. **Given** a failing test, **When** I run the test command, **Then** Vitest reports the failure with a clear error message and stack trace.
3. **Given** a passing test suite, **When** I run the test command, **Then** the process exits with code 0.

---

### User Story 2 - Cross-Browser Testing (Priority: P1)

As a developer and maintainer, I want to ensure my components work across all supported browsers (Chrome, Firefox, WebKit) by running tests in those environments.

**Why this priority**: Nimble is a cross-browser design system. Browser-specific bugs must be caught.

**Independent Test**: Can be tested by configuring Vitest to run with different browser providers (e.g., Playwright) and verifying execution in each.

**Acceptance Scenarios**:

1. **Given** the test suite, **When** I configure it to run in Chrome, **Then** tests pass.
2. **Given** the test suite, **When** I configure it to run in Firefox, **Then** tests pass.
3. **Given** the test suite, **When** I configure it to run in WebKit, **Then** tests pass.

---

### User Story 3 - Debugging Experience (Priority: P2)

As a developer, I want to easily debug failing tests using a browser-based UI or IDE integration.

**Why this priority**: Efficient debugging is crucial for productivity.

**Independent Test**: Can be tested by launching Vitest in UI mode or attaching a debugger.

**Acceptance Scenarios**:

1. **Given** a test file, **When** I run Vitest in UI mode, **Then** I can see the test list, run specific tests, and inspect the browser state.
2. **Given** a breakpoint in a test, **When** I run in debug mode, **Then** execution pauses at the breakpoint.

---

### User Story 4 - CI Integration (Priority: P1)

As a CI system, I want to execute the test suite and receive a report of the results so that I can gate pull requests.

**Why this priority**: CI is the gatekeeper for code quality.

**Independent Test**: Can be tested by running the test command in a CI-like environment (e.g., Docker or GitHub Actions runner).

**Acceptance Scenarios**:

1. **Given** a pull request, **When** the CI pipeline runs, **Then** the Vitest suite executes and reports status to GitHub.
2. **Given** a failure in CI, **When** the pipeline finishes, **Then** the failure is reported in the PR checks.

### Edge Cases

- **Migration of Jasmine-specific syntax**: How does the system handle `jasmine.createSpy` or `jasmine.clock`? (Should be migrated to Vi equivalents or shimmed).
- **Global configuration**: How are global setups (like `setup-configuration.ts`) handled in the new environment?
- **Async testing**: Ensure `waitForUpdates` and other async helpers work correctly with Vitest's timing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST use Vite as the build tool for tests, replacing Webpack.
- **FR-002**: The system MUST use Vitest as the test runner, replacing Karma.
- **FR-003**: The system MUST support running tests in a real browser environment (headless and headed) using `@vitest/browser` or equivalent.
- **FR-004**: The system MUST support the existing browser matrix: Chrome, Firefox, WebKit.
- **FR-005**: The system MUST provide a compatibility layer or migration path for existing Jasmine assertions and spies (e.g., using `vi.spyOn` or keeping `jasmine` compatibility mode if available/efficient).
- **FR-006**: The system MUST maintain the existing test timeout configuration (configurable per test or globally).
- **FR-007**: The system MUST generate coverage reports if currently supported and required.

### Key Entities *(include if feature involves data)*

- **Test Runner**: Vitest.
- **Build Tool**: Vite.
- **Browser Provider**: Playwright (via `@vitest/browser`).
- **Test Files**: `*.spec.ts` files in `nimble-components`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of existing tests in `nimble-components` pass under the new stack.
- **SC-002**: Test execution time on local machines is equal to or faster than the current Karma setup.
- **SC-003**: Test execution time in CI is equal to or faster than the current Karma setup.
- **SC-004**: The "disconnected" / timeout reliability issues observed on macOS with Karma are resolved.
- **SC-005**: No regression in browser coverage (Chrome, Firefox, WebKit supported).
