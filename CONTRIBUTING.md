# Contributing

## Repository overview

This repository uses the following tooling. See below for more info.

1. A monorepo containing multiple packages managed via [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).
1. Linting via [ESLint](https://eslint.org/) following the [NI JavaScript and TypeScript Styleguide](https://github.com/ni/javascript-styleguide)
1. Testing via [Karma](http://karma-runner.github.io/6.3/index.html) and [Jasmine](https://jasmine.github.io/)
1. Releases via [beachball](https://microsoft.github.io/beachball/)
1. Pipelines automating the above via [GitHub Actions](https://github.com/features/actions)

## Getting Started

1. From the `nimble` directory:
   1. Run `npm install`
   1. Run `npm run build`
   1. Run `npm run storybook -w @ni/nimble-components` to view the components in Storybook

## Develop New Components

### Helpful links

[Microsoft FAST](https://www.fast.design/)
- [microsoft/fast on GitHub](https://github.com/microsoft/fast)
- [FAST on Discord](https://discord.com/invite/FcSNfg4)
- [Architecture presentation from Rob Eisenberg](https://www.youtube.com/watch?v=OHOKYItVQvc)
[Design System HLD](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=%2FSpecs%2FWorking%20Groups%2FUI%2FHLD%20-%20Design%20System%20for%20Angular%20and%20Blazor%20UI%20Components.md&version=GBmaster&_a=preview)
[Nimble Angular HLD](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=%2FSpecs%2FWorking%20Groups%2FUI%2FHLD%20-%20Nimble%20Angular.md&version=GBmaster&_a=preview)
[Nimble architecture](docs/Architecture.md)

### @ni/nimble-components

1. Create a new folder named after your component with some core files

| File                      | Description |
| ------------------------- | ----------- |
| index.ts                  | Contains the component class definition and registration. All Typescript logic contained in the component belongs here. |
| styles.ts                 | Contains the styles relevant to this component. Note that globally-relevant styles that can be tokenized belong in `theme-provider/design-tokens.ts`. |
| component-name.stories.ts | Contains the Storybook documentation for this component. This should provide API documentation for the component and relevant usage information. |

TODO: where does it go?
- Templates for things that aren't just a composed Foundation component: index.ts?
- unit tests: TODO once we finalize a framework
- page objects: TODO next to unit tests
- chromatic tests: next to or inside the stories file?

1. Set up your development environment

To see your component in action, run the commands in **Getting Started** and leave the storybook running. The storybook will hot reload when you save changes, but the styles will not, so on each save that changes index.ts or styles.ts, you'll need to refresh your browser window.

1. Decide how to build on top of FAST

If fast-foundation already contains the component you're adding, use `FoundationElement.compose()` to add the component to Nimble.

```
import { Button as FoundationButton, buttonTemplate as template, DesignSystem } from '@microsoft/fast-foundation';
import { styles } from './styles';

const nimbleButton = FoundationButton.compose({
    baseName: 'button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());
```

If fast-foundation contains a component similar to what you're adding, extend the existing component with Nimble-specific functionality.

```
import { Button as FoundationButton, buttonTemplate as template, DesignSystem } from '@microsoft/fast-foundation';

class Button extends FoundationButton {
   // Add new functionality
}

const nimbleButton = Button.compose({
   ...
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());
```

TODO: If you need to compose multiple elements from fast-foundation into a new component
TODO: If FAST does not contain the requisite building blocks for your component

1. Adhere to architectural philosophies

At a minimum all classes should have a block comment and ultimately all parts of the public API should have a block comment as well.

When configuring different variants of a single element, use behaviors. This is a concept taken from fast-elements.
```
import { css } from '@microsoft/fast-element';

css`
`.withBehaviors(
   ...
)
```

TODO: naming conventions
TODO: design patterns

### @ni/nimble-angular

TODO: describe how to pull in components to @ni-nimble-angular.

## Pull Requests, Releases, and Versioning

This repository uses [beachball](https://microsoft.github.io/beachball/) to automate publishing its packages to NPM. The basic workflow is as follows:

1. Every pull request must contain a "change file" which specifies how it affects the versions of each package and includes a description of the change. Developers generate this change file by running `npm run change` before creating the pull request.
1. After the pull request completes, a CI pipeline will inspect the change files to generate changelogs, bump versions in package.json, and publish the newly built packages to NPM.

This repository uses [Chromatic](https://www.chromatic.com) to facilitate visual component review, and adds Github status checks to the build pipeline. The workflow is as follows:

1. The `UI Tests` status check is designed to highlight any visual changes included in the changeset. The developer (that's you!) should review the `UI Tests` status check in Chromatic, and if all changes are intentional or expected, mark the components as **approved**.
1. The `UI Review` status check is designed to collect feedback from UX and visual designers. Using the Chromatic review tooling, invite designers to review and approve the component changes.

## Installing dependencies

Install packages using the workflow you would expect for npm workspaces and a slightly different workflow for adding Angular libraries.

### NPM packages

To install npm packages start from the root of the repository and use `npm install <my-package> --workspace=path/to/target`.

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
