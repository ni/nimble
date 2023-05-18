# Contributing to Nimble

⚠️ **Note**: Nimble doesn't yet support normal open source fork-pull workflows (see https://github.com/ni/nimble/issues/634). To contribute pull requests you must be granted access to the repo. See the [Community section of the README](/README.md#community) to get in touch if you need access.

## Repository overview

This repository uses the following tooling. See below for more info.

1. A monorepo containing multiple packages managed via [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).
2. Linting via [ESLint](https://eslint.org/) following the [NI JavaScript and TypeScript Styleguide](https://github.com/ni/javascript-styleguide)
3. Testing via [Karma](http://karma-runner.github.io/6.3/index.html) and [Jasmine](https://jasmine.github.io/)
4. Releases via [beachball](https://microsoft.github.io/beachball/)
5. Pipelines automating the above via [GitHub Actions](https://github.com/features/actions)

### Helpful links

- [Nimble architecture](/docs/Architecture.md)
- [Nimble Components XD Library](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/)

## Getting started

First step in development is to build the monorepo which requires the following to be installed:

- Node.js version 16+ (run `node --version`) and npm version 8+ (run `npm --version`) which can be downloaded from https://nodejs.org/en/download/
- .NET 6 SDK version 6.0.202+  (run `dotnet --version`) which can be downloaded from https://dotnet.microsoft.com/en-us/download

From the `nimble` directory:

1. Run `npm install`
2. Run `npm run build` (Alernatively in Visual Studio Code **Terminal » Run Build Task…** [Mac: `cmd+shift+B` Windows: `ctrl+shift+B`])
3. Run `npm run storybook -w @ni/nimble-components` to view the components in Storybook

    **Note**: You will need to refresh your browser window to see style changes made in source.

Now that you can build the monorepo see the `CONTRIBUTING.md` for the packages you would like to contribute to.

## Develop new components

### Adding a new component

1. Write a spec describing the API and behavior of the component. See instructions for [component specs](/specs/README.md).
2. Ensure UX specs are up to date and tokens are generated. See instructions for [contributing to Nimble Tokens](/packages/nimble-tokens/CONTRIBUTING.md).
3. Expose any tokens in the token provider and add web component logic. See instructions for [contributing to Nimble Components](/packages/nimble-components/CONTRIBUTING.md).
4. Add wrappers for each framework. See instructions for [adding Angular wrappers](/angular-workspace/projects/ni/nimble-angular/CONTRIBUTING.md). See instructions for [adding Blazor wrappers](/packages/nimble-blazor/CONTRIBUTING.md).
5. Publish and use! 🎉

## Documentation policies

1. Documentation for consumers of Nimble should go in `README.md` files.
2. Documentation for contributors should go in `CONTRIBUTING.md` files.
3. Documentation is hierarchical throughout the repo:
   - repo-wide documentation exists at the root
   - package-specific documentation exists for each package
   - documentation of specific utilities or components can exist next to the source or in dedicated `docs` folders throughout the repo. Be sure to link to lower-level documents from higher-level ones to aid in discovery.
4. Links in documentation within the repo should use relative paths from the root of the repo (i.e. `/packages/nimble-components/docs/`, not `../nimble-components/docs`). This ensures links across packages will work both on GitHub and on `npmjs.org`.

## Coding conventions

This repo generally follows the [NI JavaScript and TypeScript Styleguide](https://github.com/ni/javascript-styleguide). Some packages list additional conventions in their `CONTRIBUTING.md`.

## Pull request policies

Each pull request should add a small increment of high-quality well-tested value to Nimble. To keep PRs small you can add functionality incrementally but each PR should contain appropriate tests for the functionality being added and shouldn't introduce technical debt to be fixed later.

### Beachball change file

This repository uses [beachball](https://microsoft.github.io/beachball/) to automate publishing its packages to NPM. The basic workflow is as follows:

1. Every pull request that affects a published package must contain a "change file" which specifies how it affects the versions of each package and includes a description of the change. Developers generate this change file by running `npm run change` before creating the pull request.
2. After the pull request completes, a CI pipeline will inspect the change files to generate changelogs, bump versions in package.json files, and create git tags for the updated package versions.
3. A pipeline will run for each newly created git tag and invoke the `npm run publish` command for the associated package.

When generating a change file, follow these guidelines:
1. Follow [semantic versioning](https://semver.org) when choosing the change type. Components that are [marked as incubating](/packages/nimble-components/CONTRIBUTING.md/#Marking-a-component-as-incubating) may use `patch` version bumps even for breaking changes.
2. Write a brief but useful description with Nimble clients in mind. If making a major (breaking) change, explain what clients need to do to adopt it. The description can be plain text or [markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax), with newlines specified via `\n` if needed.
3. If you prefer not to expose your email address to the world, [configure GitHub to "Keep my email address private"](https://github.com/settings/emails) before generating the change file.

### NPM audit

The repository runs [`npm audit`](https://docs.npmjs.com/cli/v8/commands/npm-audit) to prevent submissions if any dependencies have known vulnerabilities. This can occur during on a PR that introduces a new dependency version or on an unrelated PR if a vulnerability was recently reported on an existing dependency. If this check fails, our options include:

#### Vulnerabilities with fixes available

1. Update the direct dependency which brings in the vulnerability to a version that addresses the issue.
2. If the actual issue is with a sub-dependency which has published a fix, we can update that sub-dependency via `npm audit fix`. This should be accompanied by appropriate testing of the new version. We should also ensure there is an issue on the direct dependency's repository asking them to uptake the fixed sub-dependency.

#### Vulnerabilities without fixes available

If a fix for the vulnerability isn't available or if it isn't practical to uptake the fix, our options include:

1. Remove the vulnerable dependency and find a different way to achieve the same functionality.
2. Temporarily use a more lenient [audit level](https://docs.npmjs.com/cli/v8/commands/npm-audit#audit-level) for this repository (e.g. allowing `low` or `moderate` vulnerabilities). We should ensure there is an issue on the dependency's repository asking them to fix the vulnerability and also file an issue against this repository to track fixing the vulnerability and restoring strict auditing.


### Chromatic visual component tests

This repository uses [Chromatic](https://www.chromatic.com) to facilitate visual component review, and adds GitHub status checks to the build pipeline. The workflow is as follows:

1. The `UI Tests` status check is designed to highlight any visual changes included in the changeset. The developer (that's you!) should review the `UI Tests` status check in Chromatic, and if all changes are intentional or expected, mark the components as **approved**.
2. The `UI Review` status check is designed to collect feedback from UX and visual designers. Rather than blocking PR completion on this feedback, you can also approve this check by validating the story changes yourself. However, you should still demo your changes to relevant designers either in a team meeting or one-on-one. This can happen either before or after the PR completes, as long as designer feedback is addressed promptly. If you don't have access to a designer, please reach out to Nimble team members for help.

The PR pipeline also generates a live Storybook site for each PR. Developers, designers, and PR reviewers can also use this to inspect component appearance and behavior.

### Linting

This repository uses automated linting and automated lint formatting. Use `npm run lint` to confirm that your changes match style guidelines. If there are rules that can be autofixed they can be cleaned up by running `npm run format`.

To enable linting and formatting during development, install the recommended VS Code extensions. The list of recommended VS Code extensions can be found in `.vscode/extensions.json`.

The default formatter for the workspace should be already configured by `.vscode/settings.json`. To configure it manually go to `File >> Preferences >> Settings >> Workspace >> Text Editor >> Default Formatter` and select `Prettier ESLint`. The `Prettier ESLint` option assumes that the recommended VS Code extensions are installed.

You may wish to have the formatter run every time you save a file. This would help ensure you don't forget to run the formatter and end up with a failing PR build. If you want this behavior, turn it on in your user settings: `File >> Preferences >> Settings >> User >> Text Editor >> Format On Save`. We leave this option unset in the workspace settings so that it does not override the user setting.

### Watch scripts for development

When creating a new component in the `nimble-components` package, it's often sufficient to run the `npm run storybook -w @ni/nimble-components` command to preview the component during development. However, when integration components with Angular or when modifying multiple packages, it's necessary to rebuild multiple components as you modify them. To run `*:watch` scripts for all packages simultaneously, this repository uses VS Code Tasks to automatically launch the scripts in configured terminal tabs.

To launch the watch scripts, open **View»Command palette…** and type `run task`. Select `Tasks: Run Task` and then select `Create Watch Terminals` and press enter.

You can also configure this task to execute via a keyboard shortcut by [configuring](https://code.visualstudio.com/docs/getstarted/keybindings) the keybindings.json file to include the following:

```json
{
    "key": "ctrl+shift+\\",
    "command": "workbench.action.tasks.runTask",
    "args": "Create Watch Terminals"
}
```

### Code owners

Each file in a pull request requires the approval of at least one of its code owners (though in general for interesting changes we wait for everyone to review). Owners for different files are listed in [`CODEOWNERS`](/.github/CODEOWNERS).

### Completing pull requests

When completing Pull Requests, use squash merges and copy the PR description into the squash commit message. Including the PR description makes it easier to see relevant history at a glance.

## Installing dependencies

Install packages using the workflow you would expect for npm workspaces and a slightly different workflow for adding Angular libraries.

### NPM packages

To install npm packages start from the root of the repository and use `npm install <new-package> --workspace=<target-package-name>`.

Example: Install `five` in an npm workspace project:

```bash
npm install five --workspace=@ni/nimble-tokens
```

Example: Install `five` in an angular-workspace project (requires peer dependency):

```bash
npm install five --save-peer --workspace=@ni/nimble-angular
```

Example: Add a monorepo package `nimble-tokens` as a dependency to another monorepo package:

```bash
npm install @ni/nimble-tokens --workspace=@ni/nimble-components
```

## Handling intermittent test failures

Intermittent test failures can be a huge drain on productivity as they can cause unrelated failures in builds and block merging PRs or creating releases. Particularly when accepting contributions from different timezones and from contributors outside of the Nimble team without the tribal knowledge of what tests fail intermittently.

The general policy is that intermittent failures that can fail a build, such as jasmine unit tests or chromatic status checks, should be addressed in main immediately.

Some resolutions for an intermittent test are:

1. Immediately submit a PR to address the underlying issue causing the failure. This can be done if the change can be approved and merged by the end of the day that the issue was discovered and if there is high confidence in the change.
2. If the underlying issue is not well-known or the fix does not give high confidence in resolving the intermittent test then the test should be disabled and a tech debt issue created to handle the intermittent test. The disabled test should include a comment linking to the corresponding issue. Then the new issue itself must be handled as follows.

### Handling new intermittent test tech debt issues

The policy is that intermittent test tech debt issues should be actively assigned and worked on. Intermittent tests should not be disabled and allowed to be unaddressed for extended periods of time.

Some ways to make progress on an intermittent test tech debt issue are:

1. In a branch a developer can try and re-enable the test and reproduce the failure by including additional logging, etc. Creating a PR is not necessary to queue a build in nimble; every commit has an associated build and will re-run the tests.
2. If the failure is too intermittent to detect by manually queuing builds in a branch and needs additional logging and executions in main, then modify the test so that it will not fail the test suite and add the additional logging needed to make it run in main. Actively monitor the change and have a pre-defined date to disable the test and re-evaluate how to handle the issue.
