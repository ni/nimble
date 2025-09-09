<div align="center">
    <img src="docs/nimble-logo-icon.svg" width="100px"/>
    <p><b>ni | nimble</b></p>
</div>

# Nimble

The NI Nimble Design System: Styled UI components for NI applications.

[![storybook page](https://img.shields.io/badge/storybook%20documentation-white.svg?logo=storybook)](https://ni.github.io/nimble/storybook)
[![example angular app](https://img.shields.io/badge/example%20angular%20application-dd0031.svg?logo=angular)](https://ni.github.io/nimble/storybook/example-client-app)
[![example blazor app](https://img.shields.io/badge/example%20blazor%20application-572b8a.svg?logo=blazor)](https://ni.github.io/nimble/storybook/blazor-client-app/wwwroot)
[![component status page](https://img.shields.io/badge/✔-component%20status%20table-074023.svg)](https://nimble.ni.dev/storybook/?path=/docs/component-status--docs)

If you are at NI, lucky you! **Reach out to ask questions** via Microsoft Teams on the Design System [`General` channel](https://teams.microsoft.com/l/channel/19%3ACb5zEPCpdADS7kC0XTWXJGwZCq0qHVxnjkiPEWeEz7k1%40thread.tacv2/General?groupId=180bf0c7-4ff2-405e-8330-fdbe8ab6eb52&tenantId=eb06985d-06ca-4a17-81da-629ab99f6505) or via NI Stack Overflow with the [`nimble` tag](https://ni.stackenterprise.co/questions/tagged/813).

If you are outside NI, we want to hear from you too! See how to reach out in the [**Community**](#community) section below.

## Getting Started

See the corresponding `Getting Started` section in the packages hosted in the repository. Most applications will start by leveraging the Nimble packages.

### Nimble packages

The Nimble packages contain general-use components implementing the Nimble Design System for use by all applications.

[![Nimble Angular NPM version and repo link](https://img.shields.io/npm/v/@ni/nimble-angular.svg?label=@ni/nimble-angular)](https://www.npmjs.com/package/@ni/nimble-angular)
[![Nimble Blazor Nuget version and repo link](https://img.shields.io/nuget/v/NimbleBlazor.svg?label=NimbleBlazor)](https://www.nuget.org/packages/NimbleBlazor)
[![Nimble Components NPM version and repo link](https://img.shields.io/npm/v/@ni/nimble-components.svg?label=@ni/nimble-components)](https://www.npmjs.com/package/@ni/nimble-components)

- **[`@ni/nimble-angular`](/packages/angular-workspace/nimble-angular/)** - Angular bindings for Nimble components.
- **[`NimbleBlazor`](/packages/blazor-workspace/NimbleBlazor/)** - Blazor bindings for Nimble components.
- **[`@ni/nimble-components`](/packages/nimble-components/)** - Nimble components to be used by [any type of application](https://custom-elements-everywhere.com/).

### Spright packages

The Spright packages contain components that are built using Nimble technology and design patterns but tailored for specific use-cases or applications instead of being general purpose.

[![Spright Angular NPM version and repo link](https://img.shields.io/npm/v/@ni/spright-angular.svg?label=@ni/spright-angular)](https://www.npmjs.com/package/@ni/spright-angular)
[![Spright Blazor Nuget version and repo link](https://img.shields.io/nuget/v/SprightBlazor.svg?label=SprightBlazor)](https://www.nuget.org/packages/SprightBlazor)
[![Spright Components NPM version and repo link](https://img.shields.io/npm/v/@ni/spright-components.svg?label=@ni/spright-components)](https://www.npmjs.com/package/@ni/spright-components)

- [`@ni/spright-angular`](/packages/angular-workspace/spright-angular/) - Angular bindings for Spright components.
- [`SprightBlazor`](/packages/blazor-workspace/SprightBlazor/) - Blazor bindings for Spright components.
- [`@ni/spright-components`](/packages/spright-components/) - Spright components to be used by [any  type of application](https://custom-elements-everywhere.com/).

### Ok packages

The Ok packages contain experimental components that are built using Nimble technology.

[![Ok Angular NPM version and repo link](https://img.shields.io/npm/v/@ni/ok-angular.svg?label=@ni/ok-angular)](https://www.npmjs.com/package/@ni/ok-angular)
[![Ok Blazor Nuget version and repo link](https://img.shields.io/nuget/v/OkBlazor.svg?label=OkBlazor)](https://www.nuget.org/packages/OkBlazor)
[![Ok Components NPM version and repo link](https://img.shields.io/npm/v/@ni/ok-components.svg?label=@ni/ok-components)](https://www.npmjs.com/package/@ni/ok-components)

- [`@ni/ok-angular`](/packages/angular-workspace/ok-angular/) - Angular bindings for Ok components.
- [`OkBlazor`](/packages/blazor-workspace/OkBlazor/) - Blazor bindings for Ok components.
- [`@ni/ok-components`](/packages/ok-components/) - Ok components to be used by [any type of application](https://custom-elements-everywhere.com/).

### Utility packages

Tools and utilities hosted in the repository.

[![Nimble Tokens NPM version and repo link](https://img.shields.io/npm/v/@ni/nimble-tokens.svg?label=@ni/nimble-tokens)](https://www.npmjs.com/package/@ni/nimble-tokens)
[![Jasmine parameterized NPM version and repo link](https://img.shields.io/npm/v/@ni/jasmine-parameterized.svg?label=@ni/jasmine-parameterized)](https://www.npmjs.com/package/@ni/jasmine-parameterized)
[![XLIFF to JSON Converter for Angular NPM version and repo link](https://img.shields.io/npm/v/@ni/xliff-to-json-converter.svg?label=@ni/xliff-to-json-converter)](https://www.npmjs.com/package/@ni/xliff-to-json-converter)

- [`@ni/nimble-tokens`](/packages/nimble-tokens/) - Base design tokens used by the Nimble and Spright component packages.
- [`@ni/jasmine-parameterized`](/packages/jasmine-parameterized/) - a utility for writing [Jasmine](https://jasmine.github.io/) parameterized tests.
- [`@ni/xliff-to-json-converter`](/packages/xliff-to-json-converter/) - a utility to convert translation files from XLIFF to JSON for Angular localization.

The above packages follow [Semantic Versioning](https://semver.org). Consult the `CHANGELOG.md` for each package to see the changes in each version, including instructions for adapting your application in response to breaking changes.

## Community

We welcome feedback and contributions!

The fastest way to ask questions is to [join the discussion on Teams](https://teams.microsoft.com/l/channel/19%3ACb5zEPCpdADS7kC0XTWXJGwZCq0qHVxnjkiPEWeEz7k1%40thread.tacv2/General?groupId=180bf0c7-4ff2-405e-8330-fdbe8ab6eb52&tenantId=eb06985d-06ca-4a17-81da-629ab99f6505) or the [NI Stack Overflow](https://ni.stackenterprise.co/questions/tagged/813) (accessible to NI employees only). You can also start a discussion on GitHub by filing an issue using the [**🎙 Discussion**](https://github.com/ni/nimble/issues/new/choose) template.

### Requesting New Components and Features

Is Nimble missing a component that your team needs? Check the [Component Status](https://ni.github.io/nimble/storybook/?path=/docs/component-status--docs) page and search the [Issues](https://github.com/ni/nimble/issues) list to see if it's on our radar. If an issue exists already, comment with your use cases. If no issue exists yet, file a new one using the [**🙋 Feature Request**](https://github.com/ni/nimble/issues/new/choose) template.

### Filing Bugs

To report a bug with an existing component, file an issue using the [**🐛 Bug Report**](https://github.com/ni/nimble/issues/new/choose) template.

## Contributing

See `Getting Started` in [`Contributing.md`](/CONTRIBUTING.md#getting-started) to get started with building the monorepo.

[![contributors](https://markupgo.com/github/ni/nimble/contributors?width=800&count=0&circleSpacing=10&removeLogo=true)](https://github.com/ni/nimble/graphs/contributors)
