# Spright Blazor

[![Spright Nuget Version](https://img.shields.io/nuget/v/SprightBlazor.svg)](https://www.nuget.org/packages/SprightBlazor)

Spright Blazor generally works equivalently to Nimble Blazor, so refer to the Nimble Blazor [README.md](/packages/blazor-workspace/NimbleBlazor/README.md). Any Spright-specific differences are listed below.

## Getting Started

Any project using SprightBlazor components will typically also be using NimbleBlazor components (e.g. `NimbleThemeProvider` if nothing else). SprightBlazor is not a superset of NimbleBlazor, but the `spright-components` bundle _is_ a superset of the `nimble-components` bundle. Follow the directions below to avoid issues:

- Add references to **both** the SprightBlazor and NimbleBlazor NuGet packages in your project

- Include **only** the Spright all-components bundle in the HTML page (generally `App.razor` for Blazor Web Apps, or `wwwroot/index.html` for Blazor WebAssembly / Hybrid):

    ```html
    <body>
        ...
        <!-- Do NOT also include the nimble-components bundle! -->
        <script src="_content/SprightBlazor/spright-components/all-components-bundle.min.js"></script>
    </body>
    ```  

## Contributing

Follow the instructions in [CONTRIBUTING.md](/packages/blazor-workspace/SprightBlazor/CONTRIBUTING.md) to modify this library.
