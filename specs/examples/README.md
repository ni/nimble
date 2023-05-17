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
    - Move the prebuilt libraries to a separate package (see below).
    - Known issue: fonts are not included in the [existing example](https://github.com/ni/nimble/tree/0fe8cc54f7bd444830e3974969519593b532b083/packages/nimble-components#prototyping-in-a-static-webpage)
- Angular
- Blazor
  - Examples will just publish as Blazor WASM as that is most compatible with static hosting and there is not significant value in making each example show Blazor WASM, Blazor Server, and Blazor Hybrid.
  - Blazor WASM examples will not have the routing restrictions we have for the all-components examples. This will make the URLs to the sub routes less useful if copy and pasted but allow better examples demonstrating routing.
  - While additional routes in examples are not prevented, they should be discouraged except for the use-case of demonstrating routing. It's likely extra routes make for a less coherent and targeted example anyway.

### Migrate CDN Builds to a separate package

Part of this proposal is to migrate the prebuilt all-components bundles from nimble-components to a separate npm package.

This has a couple benefits:
- Avoids confusion within the Nimble Components package. Currently nothing prevents a user from accidentally mixing usage of the normal nimble component es modules, the all-components.js es module, or the all-components-bundle.js built output. 

  Mixing them is very likely to break the application in hard to predict ways by creating multiple singletons in global scope, duplicating element registrations, etc. Moving them all to a separate package can eliminate possible confusion.
- Can inline all the related content, i.e. the needed nimble fonts can be copied from nimble-tokens into the cdn package making the package standalone. Doing that with the nimble-components package would not be appropriate.
- Proposed package name `@ni/nimble-bundle`
    - Alternative names:
        - `@ni/nimble-bundled`
        - `@ni/nimble-components-cdn`
        - `@ni/nimbl-components-bundle`
        - `@ni/nimble-cdn-bundle`
        - `@ni/nimble-cdn`
- Part of this proposal would also be a breaking change to the Blazor package structure. We can leverage the `@ni/nimble-bundle` package directly in build instead of building a custom `wwwroot`.
  - That would change from:
    ```
    - wwwroot/
      - nimble-components/all-components-bundle.min.js
      - nimble-tokens/css/fonts.css
      - nimble-tokens/assets/fonts.css
    ```
    to the following where dist is a direct copy of the nimble-bundle `dist` output:
    ```
    - wwwroot/
      - dist/all-components-bundle.min.js
      - dist/css/fonts.css
      - dist/assets/fonts.css
    ```
  - Alternatives:
    - Don't introduce a breaking change, keep the existing `wwwroot` file structure in Nimble Blazor
      - Pros: Not a breaking change
      - Cons: Nimble Blazor continues to maintain an alternate structure of bundled output

### File structure

Examples will be organized as follows:

```
- examples/
    - README.md describing folder layout and documenting example expectations (linting, etc).
    - <framework>/
        - README.md: Table of contents for the examples
        - getting-started/
            - README.md: Should include a Stackblitz link to open the example immediately in addition to other content
            - package.json
            - source/
        - <other examples>: TBD
```

Notes:
- A subfolder per `<framework>`, i.e.: `vanilla`, `cdn`, `angular`, `blazor`
- Examples should be specific and targeted
  - Large examples or examples with multiple routes should be discouraged (but are not prohibited as to allow for examples demonstrating routing).
- Each example participates in the monorepo build
- Each example follows Web Chapter conventions:
    - Linting configured
    - Detailed README assuming pre-existing familiarity with Nimble and framework development, i.e. detailed only about example topic.
- Each `<framework>` will have a `getting-started` example.
    - Getting started example will be linked from each library package README
    - Getting started examples assumes brand new developers who may not have web development experience:
        - guidance on IDEs
        - step-by-step instructions
        - links to learn more about general web topics they need to be aware of (CSS custom properties, shadow slots, etc.)
    - In addition to other example requirements, the getting started examples will include unit testing infrastructure.
        - Not end-to-end as that tends to be more project specific in configuration with external services, etc.
- Issue templates should be updated to include the Stackblitz urls to make it easier to report issues
- Types of examples (just ideas / not mandatory by this spec)
  - Specific-component usage - Detailed examples for some more detailed configuration of specific components
  - Stress tests - Lots of components, large data sets, fast updates. Would align well with Playwright-based perf tests we have experimented with.
  - Examples for unsupported frameworks, i.e. example React app, vue.js app, etc. leveraging the web-component APIs directly. While we don't provide first class well-integrated support, having smoke test examples and quickly stackblitzable examples is handy.
  - High-level component patterns - We could have demo pages showing making menu bar, application shell, etc stitching together nimble-components. 
  
    This might require more discussion as to the benefit of what is being illustrated. Alternatively we should be offering those higher-level patterns as supported libraries.

### Existing examples
- The current [angular client example](https://github.com/ni/nimble/tree/main/angular-workspace/projects/example-client-app) and [blazor client example](https://github.com/ni/nimble/tree/main/packages/nimble-blazor/Examples)
    - Will stay in current locations (angular-workspace and blazor workspace) as they are primarily developer oriented tools and not user facing examples
    - Their READMEs should direct end users to the `<framework>` examples folders
    - They will be renamed to `all-components-<framework>`
    - Continue to not have a Vanilla all components example
    - Note: This is a breaking URL change. For example, `https://nimble.ni.dev/storybook/example-client-app/` will change to `https://nimble.ni.dev/storybook/all-components-angular/`

Alternatives:
- Move the all-components examples to the examples/ folder
    - Would hurt local development experience, i.e. need to run multiple angular builds / watch as a separate package not managed by angular-workspace
    - Does not seem like a high value user facing example. The examples are very large and not illustrative of specific concepts.
    - Users should rely on storybook for per control usage instead
- Don't rename the current client examples
  - Pros: Doesn't break existing URLs
  - Cons: The current names are ambiguous about framework, i.e. `example-client-app` vs `blazor-client-app`. They also don't reflect the modern use-case of being a simple dev focused example showing all the components being used.

## Alternative Implementations / Designs

N/A

## Open Issues

### Publish examples to GitHub Pages

Should we publish the examples to GitHub pages as well as make them accessible from stackblitz.

Pros:
- Easier to open on mobile devices
- More reliable manual stress test environment (don't have to consider additional injected page content)

Cons:
- Our current GitHub pages build is very large. Should research shrinking the size before adding significantly more content.

Open Questions:
- Easy way to shrink / de-dupe Blazor WASM library content?
  - Maybe Blazor examples would be a single Workspace?
- Should all the examples be included in the Chromatic build like we do the angular client and blazor client apps?
- Site should include a nice high-level index page for examples. Maybe inspired by https://examples.deno.land/
- Can we strip out some content from the GitHub build like the storybook module meta data

### Avoid regressing build performance

- Don't have a clear idea yet how build performance is impacted
- Can potentially mitigate by using a build orchestrator as discussed in [#376](https://github.com/ni/nimble/issues/376).
