<div align="center">
    <p><b>ni | nimble | angular</b></p>
</div>

# Nimble Angular

[![NPM Version](https://img.shields.io/npm/v/@ni/nimble-angular.svg)](https://www.npmjs.com/package/@ni/nimble-angular)

NI-styled UI components for Angular applications

## Getting started

*This guide assumes you have an existing Angular application and are using NPM 7 or greater.*

1. Install Nimble Angular from the [public NPM registry](https://www.npmjs.com/package/@ni/nimble-angular) by running `npm install @ni/nimble-angular`.
2. The steps to use components from Nimble Angular are similar to using components from any other Angular library. You can see the [Example Client App](/angular-workspace/projects/example-client-app) project for an example.
   1. Update your `app.module.ts` to import the module for each component you want to use:
        ```ts
        import { NimbleTextFieldModule } from '@ni/nimble-angular';

        @NgModule ({
            imports: [
                NimbleTextFieldModule,
            ]
        })
        class AppModule {}
        ```
   2. Add the component to your `app.component.html` (or to the template for another component in your application):
        ```html
        <nimble-text-field>User name</nimble-text-field>
        ```
   3. If needed, import the Nimble component's directive in `app.component.ts` (or the TypeScript file backing another component) to use its programmatic API: 
        ```ts
        import { NimbleTextFieldDirective } from '@ni/nimble-angular';

        class AppComponent {
            @ViewChild('myTextField', { read: NimbleTextFieldDirective }) public textField: NimbleTextFieldDirective;

            public toggleReadOnly() {
                textField.readonly = !textField.readonly;
            }
        }
        ```
            
### Learn more

See the [README.md for the ni/nimble repository](/README.md) for documentation of individual components.

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