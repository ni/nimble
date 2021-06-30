# Contributing

## Repository overview

This repository uses the following tooling. See below for more info.

1. A monorepo containing multiple packages managed via [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).
1. Linting via [ESLint](https://eslint.org/) following the [NI JavaScript and TypeScript Styleguide](https://github.com/ni/javascript-styleguide)
1. Testing via [Karma](http://karma-runner.github.io/6.3/index.html) and [Jasmine](https://jasmine.github.io/)
1. Releases via [beachball](https://microsoft.github.io/beachball/)
1. Pipelines automating the above via [GitHub Actions](https://github.com/features/actions)

## Pull Requests, Releases, and Versioning

This repository uses [beachball](https://microsoft.github.io/beachball/) to automate publishing its packages to NPM. The basic workflow is as follows:
1. Every pull request must contain a "change file" which specifies how it affects the versions of each package and includes a description of the change. Developers generate this change file by running `npm run change` before creating the pull request.
1. After the pull request completes, a CI pipeline will inspect the change files to generate changelogs, bump versions in package.json, and publish the newly built packages to NPM.

## Adding new packages

Add packages using the workflow you would expect for npm workspaces and a slightly different workflow for adding Angular libraries.

### NPM packages

To add npm packages start from the root of the repository and use `npm install <my-package> --workspace=path/to/target`.

Example: Add `five` to a npm workspace project:

```
npm install five --workspace=packages/nimble-tokens
```

Example: Add `five` to an angular-workspace project (requires peer dependency):

```
npm install five --save-peer --workspace=angular-workspace/projects/ni/nimble-angular
```

Example: Add a monorepo project `nimble-tokens` to another project in either workspace:

```
npm install @ni/nimble-tokens --workspace=angular-workspace/projects/ni/nimble-angular
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
