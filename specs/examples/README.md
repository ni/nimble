# Nimble Examples

## Problem Statement

Nimble should have high-level well-maintained examples for our supported frameworks.

This HLD sketches out the organization and requirements of new examples and of the current examples.

## Links To Relevant Work Items and Reference Material

- [#726 Create a "Getting Started" walkthrough for Nimble Angular](https://github.com/ni/nimble/issues/726)
- [#325 Set up stackblitz or codepen template with Nimble](https://github.com/ni/nimble/issues/325)

## Implementation / Design

### Frameworks to support
- Vanilla: TypeScript + SCSS
    - No explicit examples supporting vanilla JavaScript + CSS with local npm builds. Strongly encourage TS + SCSS.
    - Examples will use [vite](https://vitejs.dev/)
        - Supports TS + SCSS out of the box
        - Web Chapter does not have an alternate recommendation yet for Vanilla apps
        - Vite works on Stackblitz and local npm builds
            - Parcel [does not work on Stackblitz](https://github.com/parcel-bundler/parcel/issues/7748)
            - Rollup requires extra config for TS and SCSS
            - Webpack aligns with the underlying technology of Angular apps but adds lots of complexity to self manage (Angular generally manages for you)
- CDN: Vanilla JS and CSS
    - Uses the CDN builds of packages via unpkg.com
    - Known issue: fonts are not included in the [existing example](https://github.com/ni/nimble/tree/0fe8cc54f7bd444830e3974969519593b532b083/packages/nimble-components#prototyping-in-a-static-webpage)
        - We should move all the pre-built cdn bundle stuff to a [separate package](https://twitter.com/justinfagnani/status/1521953590931189760?s=20&t=zejlKVWCbEBce8zYFO7Uyg), ie:
            - `@ni/nimble-bundle`
                - alternative names:
                    - `@ni/nimble-components-cdn`
                    - `@ni/nimbl-components-bundle`
                    - `@ni/nimble-cdn-bundle`
                    - `@ni/nimble-cdn`
        - Alternative:
            - We could add a build of our CSS + font assets to the existing nimble-components bundle build which will grow the package size and pose the risk of none cdn users accidentally leveraging the contents (as described in the separate package thread linked above).
- Angular
- Blazor

### File structure
  - examples/
    - `<framework>`/
        - README.md: Table of contents for the examples
        - getting-started/
            - README.md: Should include a Stackblitz link to open the example immediately in addition to other content
            - package.json
            - source/
        - `<other examples>`: TBD

Notes:
- A subfolder per `<framework>`, i.e.: `vanilla`, `cdn`, `angular`, `blazor`
- Each `<framework>` will have a `getting-started` example.
    - Getting started example will be linked from each library package README
    - Getting started examples assumes brand new developers who may not have web development experience:
        - guidance on IDEs
        - step-by-step instructions
        - links to learn more about general web topics they need to be aware of (CSS custon properties, shadow slots, etc.)
- Each example participates in the monorepo build
- Each example follows Web Chapter conventions:
    - Linting configured
    - Testing configured
    - Detailed README
- Issue templates should be updated to include the Stackblitz urls to make it easier to report issues

### Exisiting examples
- The current [angular client example](https://github.com/ni/nimble/tree/main/angular-workspace/projects/example-client-app) and [blazor client example](https://github.com/ni/nimble/tree/main/packages/nimble-blazor/Examples)
    - Will stay in current locations (angular-workspace and blazor workspace) as they are primarily developer oriented tools and not user facing examples
    - Their READMEs should direct end users to the `<framework>` examples folders
    - They will be renamed to `kitchen-sink` examples
    - Continue to not have a Vanilla kitchen sink example
    - Alternatives:
        - Move the kitchen-sink examples to the examples/ folder
            - Would hurt local development experience, i.e. need to run multiple angular builds / watch as a separate packge not managed by angular-workspace
            - Does not seem like a high value user facing example
            - Users should rely on storybook for per control usage instead

- The [counter example](https://github.com/ni/nimble/pull/796)
    - Will reformat the example to be the `getting-started` example for vanilla `<framework>`, i.e. `/examples/vanilla/getting-started/<example files>`
    - Will only include the final part of the example
    - README will be updated to behave as a standalone example instead of a guided help / codelabs style example

## Alternative Implementations / Designs

N/A

## Open Issues

- Should we also have guided help / code labs style examples?
