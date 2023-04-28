<div align="center">
    <p><b>ni | nimble | blazor</b></p>
</div>

# Nimble Blazor

[![Nuget Version](https://img.shields.io/nuget/v/NimbleBlazor.svg)](https://www.nuget.org/packages/NimbleBlazor)

NI-styled UI components for Blazor applications

This repo contains:
1. Blazor components and styles matching the NI brand. These are published as a Nuget package to be consumed by either Blazor WebAssembly or Blazor Server applications.
2. Three Blazor demo applications that consume the components: a Blazor WebAssembly application (`Demo.Client`), a Blazor Server application (`Demo.Server`), and a Blazor Hybrid application (`Demo.Hybrid`).

## Getting Started

### Prerequisites

1. IDE:
    - **Windows with Visual Studio**: For Blazor development on Windows, the suggested IDE is:
        - Visual Studio 2022 ([Enterprise, if available](https://my.visualstudio.com/Downloads?PId=8229)): Choose the "ASP.NET and Web Development" Workload in the installer
        - Ensure Visual Studio is completely up to date (v17.1.6+): In Visual Studio click "Help" then "Check for Updates"
    - **Mac with Visual Studio Code**: Install [Visual Studio Code](https://code.visualstudio.com/) and open it. Open the Extensions pane ("Preferences" >> "Extensions"), and search for / install the `ms-dotnettools.csharp` extension.
2. .NET 6 SDK: If not already done, download and install the .NET 6 SDK version 6.0.202+  (run `dotnet --version`) which can be downloaded from https://dotnet.microsoft.com/en-us/download

### Creating a new Blazor project

The built-in Blazor template projects are good starting points. First, decide whether to create a Blazor Server or Blazor Client/WebAssembly application (see the [Blazor hosting model documentation](https://docs.microsoft.com/en-us/aspnet/core/blazor/hosting-models?view=aspnetcore-6.0) for more information on both models).

**Visual Studio**: Choose "New" >> "Project", and pick "Blazor Server app" or "Blazor WebAssembly app".  
**VS Code**: Create a new folder, then open it in VS Code. Choose "View" >> "Terminal", and type `dotnet new blazorserver -f net6.0` (for Blazor Server) or `dotnet new blazorwasm -f net6.0` (for Blazor WebAssembly) and press Enter. Open the Command Palette ("View" >> "Command Palette" or Ctrl-Shift-P), enter ".NET Generate Assets for Build and Debug" and press Enter.

Additional Resources: [Microsoft tutorial: Build a web app with Blazor](https://docs.microsoft.com/en-us/learn/modules/build-blazor-webassembly-visual-studio-code/); [`dotnet new` documentation](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-new)

### Reference NimbleBlazor in a Blazor project

1. Add a PackageReference to the NimbleBlazor NuGet package:
    - Using the published NimbleBlazor NuGet package (recommended)
        - Visual Studio: "Project" >> "Manage NuGet Packages", pick "nuget.org" in the "Package Source" dropdown, and ensure "Include prerelease" is checked. Search for "NimbleBlazor", select it and click the "Install" button.
        - VS Code: Run the command `dotnet add package NimbleBlazor --source https://api.nuget.org/v3/index.json --prerelease` in the Terminal window.
    - For Nimble developers, with a locally built NimbleBlazor NuGet (built from the Nimble repo):
        - Run `npm run build`, and then `npm run pack -w @ni/nimble-blazor` from the root of the Nimble repo
        - Visual Studio: "Project" >> "Manage NuGet Packages". Click the gear/Settings button. Add a new Package Source ("NimbleBlazor") as `[NimbleRepoDirectory]\packages\nimble-blazor\dist` and commit/ close Settings. Pick "NimbleBlazor" in the "Package Source" dropdown, and ensure "Include prerelease" is checked. Search for "NimbleBlazor", select it and click the "Install" button.
        - VS Code: Run the command `dotnet add package NimbleBlazor --source [NimbleRepoDirectory]\packages\nimble-blazor\dist` in the Terminal window.
2. Add required references to Blazor code
    - Open `_Imports.razor`, and add a new line at the bottom: `@using NimbleBlazor`
    - Open `_Layout.cshtml` (BlazorServer) / `wwwroot/index.html` (Blazor WebAssembly).  
    At the bottom of the `<head>` section (right before `</head>`), add  
        ```html
        <link href="_content/NimbleBlazor/nimble-tokens/css/fonts.css" rel="stylesheet" />
        ```  
        At the bottom of the `<body>` section (right before `</body>`), add  
        ```html
        <script src="_content/NimbleBlazor/nimble-components/all-components-bundle.min.js"></script>
        ```  

Additional Resources: [`dotnet add package` documentation](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-add-package)

### Use Nimble Blazor components

For a simple modification to the Blazor template project: open `Index.razor` and add the following code at the bottom, to add a Nimble text field that updates when a Nimble button is clicked:
```cs
<NimbleTextField Value="@ButtonClickStatus"></NimbleTextField>
<NimbleButton Appearance="ButtonAppearance.Outline" @onclick="OnButtonClicked">Click Me</NimbleButton>
@code {
    protected string ButtonClickStatus { get; set; } = string.Empty;
    private int _buttonClickCount = 0;

    private void OnButtonClicked(MouseEventArgs args)
    {
        _buttonClickCount++;
        ButtonClickStatus = $"Button Clicked {_buttonClickCount} times";
    }
}
```

To test out your changes, do "Debug" >> "Start without Debugging" in Visual Studio, or `dotnet watch run` in the VS Code Terminal.

More complete examples can be found in the Demo.Client/Server example projects.

### Using Nimble Design Tokens (CSS/SCSS)

Blazor doesn't have built-in support for using/ building SCSS files, however Nimble's design tokens can be used as CSS variables (`var(--ni-nimble-...)`) in Blazor apps without any additional work.  
For a full list of supported variable names, see the [Nimble Storybook, "Tokens" >> "Theme-aware tokens"](https://nimble.ni.dev/storybook/?path=/story/tokens-theme-aware-tokens--theme-aware-tokens&args=propertyFormat:CSS).

**Experimental: Manually including Nimble Tokens SCSS files**  
There are currently extra manual steps required to use the Nimble design tokens as SCSS in Blazor projects (which results in better IntelliSense and compile-time checking for the Nimble tokens and variables):
1. Copy the Nimble tokens SCSS files into your Blazor project: Include `tokens.scss` and `tokens-internal.scss` from the `nimble-components` in your Blazor project directory. The simplest way to get these files is via `unpkg.com` (latest versions: [tokens.scss](https://unpkg.com/@ni/nimble-components/dist/tokens-internal.scss), [tokens-internal.scss](https://unpkg.com/@ni/nimble-components/dist/tokens-internal.scss))
2. In `tokens.scss`, add a file extension to the `@import` statement at the top (`'./tokens-internal'` => `'./tokens-internal.scss'`)
3. Add a NuGet package reference to a SASS/SCSS compiler to your Blazor project. Both [LibSassBuilder](https://www.nuget.org/packages/LibSassBuilder) and [DartSassBuilder (latest/prerelease)](https://www.nuget.org/packages/DartSassBuilder) have been tested with Blazor projects and work with no additional configuration required.
4. Add new SCSS files for your Razor components (e.g. `MyComponent.razor.scss`), and `@import 'tokens.scss'` in it (updating the import relative path as needed).
5. Use the `$ni-nimble-...` variables in your Blazor application SCSS.

The SCSS compilation happens before the rest of Blazor's compilation, so this approach works fine with Blazor CSS isolation.  
Note: This approach requires periodically updating the Nimble tokens SCSS files manually (whenever the Nimble Blazor NuGet version is updated).

### Using Nimble Blazor in a Blazor Hybrid app

There is currently an [issue in ASP.NET Core](https://github.com/dotnet/aspnetcore/issues/42349) that prevents the necessary Javascript that Nimble Blazor relies on from loading in a Blazor Hybrid application. The Demo.Hybrid project illustrates the current required steps for getting Nimble Blazor to work properly. This simply involves adding the script `NimbleBlazor.Hybrid.workaround.js` in the `index.html` file in `wwwroot`:

wwwroot/index.html
```html
    ...
    <script src="_framework/blazor.webview.js"></script>
    <script src="_content/NimbleBlazor/nimble-components/all-components-bundle.min.js"></script>
    <!-- This script is a workaround needed for Nimble Blazor to work in Blazor Hybrid.
         See https://github.com/dotnet/aspnetcore/issues/42349 -->
    <script src="_content/NimbleBlazor/NimbleBlazor.Hybrid.workaround.js" type="module"></script>
</body>
```

## Contributing

Follow the instructions in [CONTRIBUTING.md](/packages/nimble-blazor/CONTRIBUTING.md) to modify this library.
