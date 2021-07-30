# Contributing to Nimble

## Repository overview

This repository uses the following tooling. See below for more info.

1. A monorepo containing multiple packages managed via [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).
1. Linting via [ESLint](https://eslint.org/) following the [NI JavaScript and TypeScript Styleguide](https://github.com/ni/javascript-styleguide)
1. Testing via [Karma](http://karma-runner.github.io/6.3/index.html) and [Jasmine](https://jasmine.github.io/)
1. Releases via [beachball](https://microsoft.github.io/beachball/)
1. Pipelines automating the above via [GitHub Actions](https://github.com/features/actions)

### Helpful links

- [Design System HLD](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=%2FSpecs%2FWorking%20Groups%2FUI%2FHLD%20-%20Design%20System%20for%20Angular%20and%20Blazor%20UI%20Components.md&version=GBmaster&_a=preview)
- [Nimble Angular HLD](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=%2FSpecs%2FWorking%20Groups%2FUI%2FHLD%20-%20Nimble%20Angular.md&version=GBmaster&_a=preview)
- [Nimble architecture](docs/Architecture.md)

## Getting started

From the `nimble` directory:
1. Make sure you have npm version 7+ installed by running `npm --version`. If you have npm version 6 or earlier, upgrade by running `npm install npm@latest -g`.
1. Run `npm install`
1. Run `npm run build`
1. Run `npm run storybook -w @ni/nimble-components` to view the components in Storybook

    **Note**: You will need to refresh your browser window to see style changes made in source.

## Develop new components

### Adding a new component

1. Ensure UX specs are up to date and tokens are generated. See instructions for [contributing to nimble tokens](packages/nimble-tokens/CONTRIBUTING.md).
1. Expose any tokens in the token provider and add web component logic. See instructions for [contributing to nimble components](packages/nimble-components/CONTRIBUTING.md).
1. Add wrappers for each framework. See instructions for [adding Angular wrappers](angular-workspace/projects/ni/nimble-angular/CONTRIBUTING.md). See instructions for [adding Blazor wrappers](packages/nimble-blazor/CONTRIBUTING.md).
1. Publish and use! 🎉

## Pull request policies

### Beachball change file

This repository uses [beachball](https://microsoft.github.io/beachball/) to automate publishing its packages to NPM. The basic workflow is as follows:

1. Every pull request that affects a published package must contain a "change file" which specifies how it affects the versions of each package and includes a description of the change. Developers generate this change file by running `npm run change` before creating the pull request.
1. After the pull request completes, a CI pipeline will inspect the change files to generate changelogs, bump versions in package.json, and publish the newly built packages to NPM.

### Chromatic visual component tests

This repository uses [Chromatic](https://www.chromatic.com) to facilitate visual component review, and adds GitHub status checks to the build pipeline. The workflow is as follows:

1. The `UI Tests` status check is designed to highlight any visual changes included in the changeset. The developer (that's you!) should review the `UI Tests` status check in Chromatic, and if all changes are intentional or expected, mark the components as **approved**.
1. The `UI Review` status check is designed to collect feedback from UX and visual designers. Using the Chromatic review tooling, invite designers to review and approve the component changes.

### Code owners

Pull Requests require the approval of at least one code owner. Owners are listed in [`CODEOWNERS`](./.github/CODEOWNERS).

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
