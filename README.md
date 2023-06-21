<div align="center">
    <img src="docs/nimble-logo-icon.svg" width="100px"/>
    <p><b>ni | nimble</b></p>
</div>

# Nimble

[![Nimble Angular NPM version and repo link](https://img.shields.io/npm/v/@ni/nimble-angular.svg?label=@ni/nimble-angular)](https://www.npmjs.com/package/@ni/nimble-angular)
[![Nimble Blazor Nuget version and repo link](https://img.shields.io/nuget/v/NimbleBlazor.svg?label=NimbleBlazor)](https://www.nuget.org/packages/NimbleBlazor)
[![Nimble Components NPM version and repo link](https://img.shields.io/npm/v/@ni/nimble-components.svg?label=@ni/nimble-components)](https://www.npmjs.com/package/@ni/nimble-components)
[![Nimble Tokens NPM version and repo link](https://img.shields.io/npm/v/@ni/nimble-tokens.svg?label=@ni/nimble-tokens)](https://www.npmjs.com/package/@ni/nimble-tokens)

The NI Nimble Design System: styled UI components for NI applications.

[![storybook page](https://img.shields.io/badge/storybook-white.svg?logo=storybook)](https://ni.github.io/nimble/storybook)
[![example angular app](https://img.shields.io/badge/example%20angular%20app-dd0031.svg?logo=angular)](https://ni.github.io/nimble/storybook/example-client-app)
[![example blazor app](https://img.shields.io/badge/example%20blazor%20app-572b8a.svg?logo=blazor)](https://ni.github.io/nimble/storybook/blazor-client-app/wwwroot)

If you are at NI, lucky you! **Reach out to ask questions directly in the [Design System Teams channel](https://teams.microsoft.com/l/team/19%3awo8vmMKMsHfltKXxc0bczZo-X4JlQSV5VxpaRJdh13k1%40thread.tacv2/conversations?groupId=9ee065d7-3898-4245-82f6-76e86084b8b1&tenantId=87ba1f9a-44cd-43a6-b008-6fdb45a5204e).**

## Getting Started

This repository contains the source for the following packages:

- **[`@ni/nimble-angular`](/angular-workspace/projects/ni/nimble-angular/)** - styled Angular components for use in NI Angular applications
- **[`@ni/nimble-blazor`](/packages/nimble-blazor/)** - styled Blazor components for use in NI Blazor applications
- **[`@ni/nimble-components`](/packages/nimble-components/)** - styled web components for use in other applications (also used by `nimble-angular` and `nimble-blazor`)
- **[`@ni/nimble-tokens`](/packages/nimble-tokens/)** - design tokens used by the component packages

And some additional utility packages:
- [`@ni/xliff-to-json-converter`](/packages/xliff-to-json-converter/) - a utility to convert translation files from XLIFF to JSON for Angular localization

Consult the `README.md` for each package to learn more, including how to use it in an application.

The above packages follow [Semantic Versioning](https://semver.org). Consult the `CHANGELOG.md` for each package to see the changes in each version, including instructions for adapting your application in response to breaking changes.

## Community

We welcome feedback and contributions!

The fastest way to ask questions is to [join the discussion on Teams](https://teams.microsoft.com/l/team/19%3awo8vmMKMsHfltKXxc0bczZo-X4JlQSV5VxpaRJdh13k1%40thread.tacv2/conversations?groupId=9ee065d7-3898-4245-82f6-76e86084b8b1&tenantId=87ba1f9a-44cd-43a6-b008-6fdb45a5204e) (accessible to NI employees only). You can also start a discussion on GitHub by [filing an issue using the Discussion template](https://github.com/ni/nimble/issues/new/choose).

## Requesting New Components and Features

Is Nimble missing a component that your team needs? Search the [issues list](https://github.com/ni/nimble/issues) to see if it's on our radar. If an issue exists already, comment with your use cases. If no issue exists yet, file a new one using the **Feature request** template.

## Filing Bugs

To report a bug with an existing component, file an issue using the **Bug report** template.

## Learning

- [Architecture](/docs/Architecture.md) - Architecture of the design system packages and monorepo

## Contributing

See `Getting Started` in [`Contributing.md`](/CONTRIBUTING.md#getting-started) to get started with building the monorepo.

## Component Status

View status of components that are completed and on the roadmap in the [Component Status](https://ni.github.io/nimble/storybook/?path=/docs/component-status--docs) page.
