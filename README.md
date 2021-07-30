<div align="center">
    <img src="docs/nimble-logo-icon.svg" width="100px"/>
    <p><b>ni | nimble</b></p>
</div>

# Nimble

[![Nimble Angular NPM version and repo link](https://img.shields.io/npm/v/@ni/nimble-angular.svg?label=@ni/nimble-angular)](https://www.npmjs.com/package/@ni/nimble-angular)
[![Nimble Angular Schematics NPM version and repo link](https://img.shields.io/npm/v/@ni/nimble-angular-schematics.svg?label=@ni/nimble-angular-schematics)](https://www.npmjs.com/package/@ni/nimble-angular-schematics)
[![Nimble Blazor Nuget version and repo link](https://img.shields.io/nuget/v/NimbleBlazor.svg?label=NimbleBlazor)](https://www.nuget.org/packages/NimbleBlazor)
[![Nimble Components NPM version and repo link](https://img.shields.io/npm/v/@ni/nimble-components.svg?label=@ni/nimble-components)](https://www.npmjs.com/package/@ni/nimble-components)
[![Nimble Tokens NPM version and repo link](https://img.shields.io/npm/v/@ni/nimble-tokens.svg?label=@ni/nimble-tokens)](https://www.npmjs.com/package/@ni/nimble-tokens)

The NI Nimble Design System: styled UI components for NI applications.

[![storybook page](https://img.shields.io/badge/storybook-white.svg?logo=storybook)](https://ni.github.io/nimble/storybook)
[![example angular app](https://img.shields.io/badge/example%20angular%20app-dd0031.svg?logo=angular)](https://ni.github.io/nimble/example-client-app)

## Getting Started

This repository contains the source for the following packages:

- **[`@ni/nimble-angular`](angular-workspace/projects/ni/nimble-angular/)** - styled Angular components for use in NI Angular applications
- **[`@ni/nimble-blazor`](packages/nimble-blazor/)** - styled Blazor components for use in NI Blazor applications
- **[`@ni/nimble-components`](packages/nimble-components/)** - styled web components for use in other applications (also used by `nimble-angular` and `nimble-blazor`)
- **[`@ni/nimble-tokens`](packages/nimble-tokens/)** - design tokens used by the component packages

Consult the `README.md` for each package to learn more, including how to use it in an application.

## Community

We welcome feedback and contributions!

- The fastest way to ask questions is to [join the discussion on Teams](https://teams.microsoft.com/l/team/19%3awo8vmMKMsHfltKXxc0bczZo-X4JlQSV5VxpaRJdh13k1%40thread.tacv2/conversations?groupId=9ee065d7-3898-4245-82f6-76e86084b8b1&tenantId=87ba1f9a-44cd-43a6-b008-6fdb45a5204e) (accessible to NI employees only). 
- The feature backlog is stored in [Azure DevOps](https://dev.azure.com/ni/DevCentral/_backlogs/backlog/ASW%20SystemLink%20UI%20Component%20Working%20Group/Features) (accessible to NI employees only).
- You can also submit requests and issues [on GitHub](https://github.com/ni/nimble/issues).


## Learning

- [Architecture](docs/Architecture.md) - Architecture of the design system packages and monorepo

## Contributing

### Quick Start

From the `nimble` directory:

1. Make sure you have npm version 7+ installed by running `npm --version`. If you have npm version 6 or earlier, upgrade by running `npm install npm@latest -g`.
1. Run `npm install`
1. Run `npm run build`
1. Run `npm run storybook -w @ni/nimble-components` to view the components in Storybook

    **Note**: You will need to refresh your browser window to see style changes made in source.

Follow the instructions in [CONTRIBUTING.md](CONTRIBUTING.md) to modify the design system.
