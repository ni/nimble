# Ok Blazor

[![Ok Nuget Version](https://img.shields.io/nuget/v/OkBlazor.svg)](https://www.nuget.org/packages/OkBlazor)

Ok Blazor generally works equivalently to Nimble Blazor, so refer to the Nimble Blazor [README.md](/packages/blazor-workspace/NimbleBlazor/README.md). Any Ok Blazor-specific differences are listed below.

## Getting Started

Any project using OkBlazor components will typically also be using NimbleBlazor components and SprightBlazor components (e.g. `NimbleThemeProvider` if nothing else). OkBlazor is not a superset of NimbleBlazor or SprightBlazor, but the `ok-components` bundle _is_ a superset of the `spright-components` bundle and in-turn the `nimble-components` bundle. Follow the directions below to avoid issues:

- Add references to the OkBlazor, SprightBlazor, and NimbleBlazor NuGet packages in your project

- Include **only** the Ok all-components bundle in the HTML page (generally `App.razor` for Blazor Web Apps, or `wwwroot/index.html` for Blazor WebAssembly / Hybrid):

    ```html
    <body>
        ...
        <!-- Do NOT also include the nimble-components bundle or spright-components bundle! -->
        <script src="_content/OkBlazor/ok-components/all-components-bundle.min.js"></script>
    </body>
    ```  

## FV component bindings

`OkFvMultiSelect` accepts `Options` and supports `@bind-SelectedValues`. `OkFvFilterBar` accepts JSON-serializable `Query` and `Definition` objects; its edit and clear callbacks include the query as JSON. `OkFvEditCommitBar` accepts a `FvCommitMessage` and exposes save, revert, and dismiss callbacks; set `Message` to `null` to remove it. Object-valued properties are applied after interactive rendering.

`OkFvTextField` and `OkFvDateTimePicker` support `@bind-Value` and preserve their `OnChange` and `OnInput` callbacks where available. These bindings do not provide `EditForm` validation integration.

`OkFvTextField.MaskOptions` accepts an `IJSObjectReference` to a [Maskito options object](https://maskito.dev/core-concepts/mask-expression/), preserving JavaScript regular expressions and functions. For example, define `window.createDigitMask = () => ({ mask: [/\d/, '-', /\d/] });` in JavaScript, then obtain the reference with `await JS.InvokeAsync<IJSObjectReference>("createDigitMask")` after interactive rendering and pass it to `MaskOptions`. Set `MaskOptions` to `null` to remove the mask; dispose the reference when it is no longer needed.

## Contributing

Follow the instructions in [CONTRIBUTING.md](/packages/blazor-workspace/OkBlazor/CONTRIBUTING.md) to modify this library.
