# Contributing to Nimble

## Repository overview

This repository uses the following tooling. See below for more info.

1. A monorepo containing multiple packages managed via [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).
2. Linting via [ESLint](https://eslint.org/) following the [NI JavaScript and TypeScript Styleguide](https://github.com/ni/javascript-styleguide)
3. Testing via [Karma](http://karma-runner.github.io/6.3/index.html) and [Jasmine](https://jasmine.github.io/)
4. Releases via [beachball](https://microsoft.github.io/beachball/)
5. Pipelines automating the above via [GitHub Actions](https://github.com/features/actions)

### Helpful links

- [Design System HLD](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=%2FSpecs%2FWorking%20Groups%2FUI%2FHLD%20-%20Design%20System%20for%20Angular%20and%20Blazor%20UI%20Components.md&version=GBmaster&_a=preview)
- [Nimble Angular HLD](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=%2FSpecs%2FWorking%20Groups%2FUI%2FHLD%20-%20Nimble%20Angular.md&version=GBmaster&_a=preview)
- [Nimble architecture](/docs/Architecture.md)
- [Nimble Components XD Library](https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/)

## Getting started

From the `nimble` directory:

1. Make sure you have Node.js version 16+ (run `node --version`) and npm version 8+ (run `npm --version`). Download newer versions from https://nodejs.org/en/download/
2. Run `npm install`
3. Run `npm run build` (or **Terminal»Run Build Task…** [Mac: `cmd+shift+B` Windows: `ctrl+shift+B`])
4. Run `npm run storybook -w @ni/nimble-components` to view the components in Storybook

    **Note**: You will need to refresh your browser window to see style changes made in source.

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

## Pull request policies

### Beachball change file

This repository uses [beachball](https://microsoft.github.io/beachball/) to automate publishing its packages to NPM. The basic workflow is as follows:

1. Every pull request that affects a published package must contain a "change file" which specifies how it affects the versions of each package and includes a description of the change. Developers generate this change file by running `npm run change` before creating the pull request.
2. After the pull request completes, a CI pipeline will inspect the change files to generate changelogs, bump versions in package.json files, and create git tags for the updated package versions.
3. A pipeline will run for each newly created git tag and invoke the `npm run publish` command for the associated package.

When generating a change file, follow these guidelines:
1. Follow [semantic versioning](https://semver.org) when choosing the change type.
2. Write a brief but useful description with Nimble clients in mind. If making a major (breaking) change, explain what clients need to do to adopt it.
3. If you prefer not to expose your email address to the world, [configure GitHub to "Keep my email address private"](https://github.com/settings/emails) before generating the change file.

### Chromatic visual component tests

This repository uses [Chromatic](https://www.chromatic.com) to facilitate visual component review, and adds GitHub status checks to the build pipeline. The workflow is as follows:

1. The `UI Tests` status check is designed to highlight any visual changes included in the changeset. The developer (that's you!) should review the `UI Tests` status check in Chromatic, and if all changes are intentional or expected, mark the components as **approved**.
2. The `UI Review` status check is designed to collect feedback from UX and visual designers. Using the Chromatic review tooling, invite designers to review and approve the component changes.

### Linting

This repository uses automated linting and automated lint formatting. Use `npm run lint` to confirm that your changes match style guidelines. If there are rules that can be autofixed they can be cleaned up by running `npm run format`.

To enable linting and formatting during development, install the recommended VS Code extensions. The list of recommended VS Code extensions can be found in `.vscode/extensions.json`.

The default formatter for the workspace should be already configured by `.vscode/settings.json`. To configure it manually go to `File >> Preferences >> Settings >> Workspace >> Text Editor >> Defualt Formatter` and select `Prettier ESLint`. The `Prettier ESLint` option assumes that the recommended VS Code extensions are installed.

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

Pull Requests require the approval of at least one code owner. Owners are listed in [`CODEOWNERS`](/.github/CODEOWNERS).

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

<!-- TODO this workflow doesn't seem to work
### Angular libraries

1. From a CLI navigate to your project such as `angular-workspace/projects/ni/nimble-angular`.
2. Run `ng add <my-library>`, for example: `ng add @angular/material`.
3. That will update the `package.json` for `nimble-angular` but unfortunately also trigger an npm install inside of the `nimble-workspace` and create a `node_modules` and `package-lock.json` which are ignored.
4. From repo root stash your `package.json` change, ie `git stash`.
5. From repo root clean the repository, ie `git clean -fdx`.
6. From repo root pop the `package.json` change, ie `git stash pop`.
7. From repo root run `npm install`. This will update the root `package-lock.json`.
8. Submit your angular project `package.json` and root `package-lock.json` change.
-->
