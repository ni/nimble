<div align="center">
    <p><b>ni | nimble | angular</b></p>
</div>

# Nimble Angular

[![NPM Version](https://img.shields.io/npm/v/@ni/nimble-angular.svg)](https://www.npmjs.com/package/@ni/nimble-angular)

NI-styled UI components for Angular applications

## Getting started

You are currently required to set `"buildOptimizer": "false"` in `angular.json`. See [#18](https://github.com/ni/nimble/issues/18) for more info.

### Using Nimble form controls

For best results, always use `ngModel`, `formControl`, or `formControlName` bindings when integrating Nimble form controls in Angular. Binding to the control's native value property or event (e.g. `[value]` or `(change)`) is not supported, and can cause build failures and other issues. If a value change event is necessary, use `ngModel (ngModelChange)="onChange()"`.

## Known Issues

Currently the fast-animation library we depend on only exports CommonJS modules, which triggers an Angular project build warning (and potentially suboptimal bundle optimizations).

Currently clients consuming the nimble Angular integration may need to make the following change in their `angular.json`, if they wish to suppress that build warning, in the `projects.[projectName].architect.build.options` section:
```json
"allowedCommonJsDependencies": [
  "@microsoft/fast-animation"
]
```

[nimble issue #189](https://github.com/ni/nimble/issues/189) tracks this issue.

## Contributing

Follow the instructions in [CONTRIBUTING.md](CONTRIBUTING.md) to modify this library.

<!--
# NimbleAngular

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.0.

## Code scaffolding

Run `ng generate component component-name --project nimble-angular` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project nimble-angular`.
> Note: Don't forget to add `--project nimble-angular` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build nimble-angular` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build nimble-angular`, go to the dist folder `cd dist/nimble-angular` and run `npm publish`.

## Running unit tests

Run `ng test nimble-angular` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
-->