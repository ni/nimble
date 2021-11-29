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
