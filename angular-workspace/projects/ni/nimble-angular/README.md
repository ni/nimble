<div align="center">
    <p><b>ni | nimble | angular</b></p>
</div>

# Nimble Angular

[![NPM Version](https://img.shields.io/npm/v/@ni/nimble-angular.svg)](https://www.npmjs.com/package/@ni/nimble-angular)

NI-styled UI components for [Angular](https://angular.io) applications

## Getting started

The steps to use components from Nimble Angular are similar to using components from any other Angular library. You can see the [Example Client App](/angular-workspace/projects/example-client-app) project for an example.

1. Install Nimble Angular from the [public NPM registry](https://www.npmjs.com/package/@ni/nimble-angular) by running `npm install @ni/nimble-angular`.

    *This guide assumes you have an existing Angular application and are using NPM 7 or greater.*

2. Each application should update `app.module.ts` to import the module for `NimbleThemeProviderModule`. Additionally, import modules for the components you want to use:

    ```ts
    import {
        NimbleDrawerModule,
        NimbleThemeProviderModule
    } from '@ni/nimble-angular';

    @NgModule ({
        imports: [
            NimbleDrawerModule,
            NimbleThemeProviderModule
        ]
    })
    class AppModule {}
    ```

3. Each application should add the `<nimble-theme-provider>` element to `app.component.html` and set its `theme` attribute. The theme provider has no appearance of its own but defines tokens that are used by descendant components.

    ```html
    <nimble-theme-provider theme="light">
        <router-outlet></router-outlet>
    </nimble-theme-provider>
    ```

4. Each application should import the Nimble fonts once in the root `src/styles.scss`. Nimble recommends using SCSS for capabilities such as build time property checking.

    ```scss
    @import '@ni/nimble-angular/styles/fonts';
    ```

5. As needed, import the theme-aware design tokens in each SCSS file that will leverage the tokens for other parts of your application (for colors, fonts, etc).

    ```scss
    @import '@ni/nimble-angular/styles/tokens';

    .my-element {
        font-family: $ni-nimble-body-font-family;
        font-size: $ni-nimble-body-font-size;
        color: $ni-nimble-body-font-color;
    }
    ```

    See [the theming documentation in `nimble-components`](/packages/nimble-components/README.md#theming) for more information.

6. As needed, add Nimble components to the templates in your application:

    ```html
    <nimble-drawer #drawerReference location="right">This is a drawer</nimble-drawer>
    ```

7. As needed, import the Nimble component's directive and types in your component scripts to use programmatic APIs:

    ```ts
    import { NimbleDrawerDirective } from '@ni/nimble-angular';

    @Component({ /* ... */ })
    class AppComponent {
        @ViewChild('drawerReference', { read: NimbleDrawerDirective }) public drawer: NimbleDrawerDirective;

        public openDrawer() {
            this.drawer.show();
        }
    }
    ```

   Note: Nimble components are exposed in Angular as Angular Directives and have the suffix `Directive`.

### Learn more

See the [README.md for the ni/nimble repository](/README.md) for documentation of individual components.

### Using Nimble form controls

For best results, always use `ngModel`, `formControl`, or `formControlName` bindings when integrating Nimble form controls in Angular. Binding to the control's native value property or event (e.g. `[value]` or `(change)`) is not supported, and can cause build failures and other issues. If a value change event is necessary, use `ngModel (ngModelChange)="onChange()"`.

### Using Nimble breadcrumb with Angular's RouterLink

`nimble-breadcrumb-item` supports the [Angular RouterLink directive](https://angular.io/api/router/RouterLink) for breadcrumb navigation in an Angular app using routing.
However, the attribute name `nimbleRouterLink` should be used instead of `routerLink` - for example:
```html
<nimble-breadcrumb-item [nimbleRouterLink]="breadcrumb.url">
    {{ breadcrumb.label }}
</nimble-breadcrumb-item>
```
The properties RouterLink supports (`queryParams`, `state`, etc.) can be used on `nimble-breadcrumb-item` as-is.

### Testing with Nimble elements and `fakeAsync`

Angular's `fakeAsync` utility is useful for writing quickly-executing tests, but it can cause issues when testing components containing Nimble elements. Nimble uses an internal process queue to schedule work. If a `fakeAsync` test schedules work on the queue (by creating or interacting with Nimble elements) and the queue isn't processed by the end of the test, the queue will never be processed and subsequent tests may fail.

To avoid this, call `processUpdates()` after each `fakeAsync` test. This will synchronously process the internal queue and put it in a good state for subsequent tests. The `processUpdates()` method can also be called mid-test to synchronously complete operations which would otherwise require waiting for an animation frame.

## Angular Support Policy

`@ni/nimble-angular` supports Angular 14. To see the exact version it's tested against, view the library's `package.json`.

If your application uses an older Angular version you can temporarily use an older version of `@ni/nimble-angular` (versions exist back to Angular 12) but it will not contain the latest features so it's preferable to update the application's Angular dependency.

If your application uses a newer Angular version please contact the Nimble team by filing an issue to request support. We strive to offer support for each new major Angular release within a few months of its availability but will work with our clients to find the best time to upgrade.

## Contributing

Follow the instructions in [CONTRIBUTING.md](/angular-workspace/projects/ni/nimble-angular/CONTRIBUTING.md) to modify this library.
