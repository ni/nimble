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

## Contributing

Follow the instructions in [CONTRIBUTING.md](/packages/blazor-workspace/OkBlazor/CONTRIBUTING.md) to modify this library.
