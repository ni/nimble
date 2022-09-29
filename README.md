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
- [`@ni/beachball-lock-update`](/packages/beachball-lock-update/) - script to update `package-lock.json` files in npm workspace monorepos
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

<!--
NOTE: To update the component status:
    1. Update the value in the table on Sheet1 of the spreadsheet: https://nio365-my.sharepoint.com/:x:/g/personal/fred_visser_ni_com/Eb1_BLjOOI1IsvUWay5VdAwB_G0a20kOZeFHWzSsvIXUBw?e=aGNMTg
    2. Create a PR to update this README with the entire contents of the generated 'M' column in the spreadsheet
-->

| Components             | Design | Issue | Web Components     | Angular Integration | Blazor Integration |
|------------------------|--------|--------|--------------------|---------------------|--------------------|
| Accordion | |  [Issue](https://github.com/ni/nimble/issues/533) | :o: | :o: | :o: |
| Anchor | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bfadf499-caf5-4ca0-9814-e777fbae0d46/) |  [Issue](https://github.com/ni/nimble/issues/324) | :o: | :o: | :o: |
| Banners | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/29c405f7-08ea-48b6-973f-546970b9dbab) |  [Issue](https://github.com/ni/nimble/issues/305) | :o: | :o: | :o: |
| Breadcrumb | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7b53bb3e-439b-4f13-9d5f-55adc7da8a2e) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/breadcrumb--standard-breadcrumb) | :white_check_mark: | :white_check_mark: |
| Card | |  [Issue](https://github.com/ni/nimble/issues/296) | :o: | :o: | :o: |
| Card button | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d4ebeb5d-023c-4ff2-a71c-f6385fffca20) |  [Issue](https://github.com/ni/nimble/issues/643) | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/card-button--card-button) | :white_check_mark: | :white_check_mark: |
| Checkbox | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/checkbox--checkbox) | :white_check_mark: | :white_check_mark: |
| Chip/Pill | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/18a0e4f6-6541-4420-a6b5-cb79652a97dc/) |  [Issue](https://github.com/ni/nimble/issues/413) | :o: | :o: | :o: |
| Combo box | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bd6755d9-8fd2-4b97-9709-939ea20680ae) |  [Issue](https://github.com/ni/nimble/issues/341) | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/combobox--combobox) | :white_check_mark: | :white_check_mark: |
| Datepicker | |  [Issue](https://github.com/ni/nimble/issues/342) | :o: | :o: | :o: |
| Dialog | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6f1b5b4d-2e50-4f8d-ad49-e3dac564a006/) |  [Issue](https://github.com/ni/nimble/issues/378) | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/dialog--dialog) | :white_check_mark: | :white_check_mark: |
| Drawer | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/730cdeb8-a4b5-4dcc-9fe4-718a75da7aff) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/drawer--drawer) | :white_check_mark: | :white_check_mark: |
| Dropdown (Select) | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/select--select) | :white_check_mark: | :white_check_mark: |
| Filter Builder | |  [Issue](https://github.com/ni/nimble/issues/310) | :o: | :o: | :o: |
| Table | |  [Issue](https://github.com/ni/nimble/issues/283) | :o: | :o: | :o: |
| Icon Button | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/button--icon-button) | :white_check_mark: | :white_check_mark: |
| Icon Menu Button | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece) |  [Issue](https://github.com/ni/nimble/issues/300) | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/story/menu-button--icon-button) | :white_check_mark: | :white_check_mark: |
| Icons | | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/icons--component-icons) | :white_check_mark: | :white_check_mark: |
| Label | |  [Issue](https://github.com/ni/nimble/issues/312) | :o: | :o: | :o: |
| Menu | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/c098395e-30f8-4bd4-b8c5-394326b59919) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/menu--custom-menu) | :white_check_mark: | :white_check_mark: |
| Menu Button | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102/) |  [Issue](https://github.com/ni/nimble/issues/300) | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/story/menu-button--outline-button) | :white_check_mark: | :white_check_mark: |
| Number Field | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/eaa9ee19-4411-4648-b19d-41f61f9a01cf) |  [Issue](https://github.com/ni/nimble/issues/361) | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/number-field--number-field) | :white_check_mark: | :white_check_mark: |
| Progress Bar | |  [Issue](https://github.com/ni/nimble/issues/304) | :o: | :o: | :o: |
| Radio | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7) |  [Issue](https://github.com/ni/nimble/issues/297) | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/radio-group--radio-group) | :white_check_mark: | :white_check_mark: |
| Search Field | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/842889a5-67ba-4350-91c1-55eee48f4fa2) |  [Issue](https://github.com/ni/nimble/issues/299) | :o: | :o: | :o: |
| Skeleton | |  [Issue](https://github.com/ni/nimble/issues/762) | :o: | :o: | :o: |
| Slider | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/29d3a5f7-9eed-498c-9957-2cd495458e3b/) |  [Issue](https://github.com/ni/nimble/issues/295) | :o: | :o: | :o: |
| Spinner | [XD](https://xd.adobe.com/view/6fc414f4-1660-4bff-4552-3e62baaa9e1e-19f5/screen/ced36959-68d6-440f-a0cc-031bc29d7e98/) |  [Issue](https://github.com/ni/nimble/issues/346) | :o: | :o: | :o: |
| Split Icon Button | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece) |  [Issue](https://github.com/ni/nimble/issues/298) | :o: | :o: | :o: |
| Switch | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/) |  [Issue](https://github.com/ni/nimble/issues/387) | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/switch--switch-story) | :white_check_mark: | :white_check_mark: |
| Tabs | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/tabs--tabs) | :white_check_mark: | :white_check_mark: |
| Text and Icon Button | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/a378bcdb-5c4b-4298-b3b1-28d8b1a37af2) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/button--outline-button) | :white_check_mark: | :white_check_mark: |
| Text Button | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/button--outline-button) | :white_check_mark: | :white_check_mark: |
| Text Field - Multiline | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/7c146e4b-c7c9-4975-a158-10e6093c522d/) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/story/text-area--outline-text-area) | :white_check_mark: | :white_check_mark: |
| Text Field - Single | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/842889a5-67ba-4350-91c1-55eee48f4fa2/) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/text-field--text-field) | :white_check_mark: | :white_check_mark: |
| Toggle Icon Button | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece/) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/story/toggle-button--icon-button) | :white_check_mark: | :white_check_mark: |
| Toolbar | |  [Issue](https://github.com/ni/nimble/issues/411) | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/story/toolbar--toolbar) | :white_check_mark: | :white_check_mark: |
| Tooltip | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/044414d7-1714-40f2-9679-2ce2c8202d1c/) |  [Issue](https://github.com/ni/nimble/issues/309) | [:warning: - SB](https://ni.github.io/nimble/storybook/?path=/docs/tooltip--tooltip) | :warning: | :warning: |
| Tree View | [XD](https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/ec5a855a-4174-46ad-947c-3931bbf3e32d/) | | [:white_check_mark: - SB](https://ni.github.io/nimble/storybook/?path=/docs/tree-view--tree-view) | :white_check_mark: | :white_check_mark: |
