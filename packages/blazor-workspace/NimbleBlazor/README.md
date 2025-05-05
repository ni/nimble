# Nimble Blazor

[![Nimble Nuget Version](https://img.shields.io/nuget/v/NimbleBlazor.svg)](https://www.nuget.org/packages/NimbleBlazor)

## Getting Started

### Prerequisites

1. IDE:
    - **Windows with Visual Studio**: For Blazor development on Windows, the suggested IDE is:
        - Visual Studio 2022 ([Enterprise, if available](https://my.visualstudio.com/Downloads?PId=8229)): Choose the "ASP.NET and Web Development" Workload in the installer
        - Ensure Visual Studio is completely up to date (v17.11.2+): In Visual Studio click "Help" then "Check for Updates"
    - **Mac with Visual Studio Code**: Install [Visual Studio Code](https://code.visualstudio.com/) and open it. Open the Extensions pane ("Preferences" >> "Extensions"), and search for / install the `ms-dotnettools.csharp` extension.
2. .NET SDK: See [the main contributing doc](/CONTRIBUTING.md) for the required version.

### Creating a new Blazor project

The built-in Blazor template projects are good starting points. Starting with .NET 8, there's a unified Blazor Web App project type, which supports multiple render modes (see the [Blazor render modes documentation](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/render-modes?view=aspnetcore-8.0) for more information). Also see the "Supported Render Modes" section below.

**Visual Studio**: Choose "New" >> "Project", and pick "Blazor Web App". Choose the appropriate settings for Interactive Render Mode and Interactivity Location, based on your project's needs.
**VS Code**: Create a new folder, then open it in VS Code. Choose "View" >> "Terminal", and type `dotnet new blazor` and press Enter, to create a new Blazor Web App. Open the Command Palette ("View" >> "Command Palette" or Ctrl-Shift-P), enter ".NET Generate Assets for Build and Debug" and press Enter.

Additional Resources: [Microsoft tutorial: Build a web app with Blazor](https://learn.microsoft.com/en-us/training/modules/build-your-first-blazor-web-app/); [`dotnet new` documentation](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-new)

### Reference NimbleBlazor in a Blazor project

1. Add a PackageReference to the NimbleBlazor NuGet package:
    - Using the published NimbleBlazor NuGet package (recommended)
        - Visual Studio: "Project" >> "Manage NuGet Packages", pick "nuget.org" in the "Package Source" dropdown, and ensure "Include prerelease" is checked. Search for "NimbleBlazor", select it and click the "Install" button.
        - VS Code: Run the command `dotnet add package NimbleBlazor --source https://api.nuget.org/v3/index.json --prerelease` in the Terminal window.
    - For Nimble developers, with a locally built NimbleBlazor NuGet (built from the Nimble repo):
        - Run `npm run build`, and then `npm run pack -w @ni/nimble-blazor` from the root of the Nimble repo
        - Visual Studio: "Project" >> "Manage NuGet Packages". Click the gear/Settings button. Add a new Package Source ("NimbleBlazor") as `[NimbleRepoDirectory]\packages\blazor-workspace\dist` and commit/ close Settings. Pick "NimbleBlazor" in the "Package Source" dropdown, and ensure "Include prerelease" is checked. Search for "NimbleBlazor", select it and click the "Install" button.
        - VS Code: Run the command `dotnet add package NimbleBlazor --source [NimbleRepoDirectory]\packages\blazor-workspace\dist` in the Terminal window.
2. Add required references to Blazor code
    - Open `_Imports.razor`, and add a new line at the bottom: `@using NimbleBlazor`
    - Open the HTML page (generally `App.razor` for Blazor Web Apps, or `wwwroot/index.html` for Blazor WebAssembly / Hybrid)  
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

### Supported Render Modes

Nimble supports all of the [Blazor render modes](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/render-modes?view=aspnetcore-8.0):
- Interactive server-side rendering (interactive SSR) using Blazor Server: `RenderMode.InteractiveServer`
- Interactive WebAssembly: Client-side rendering (CSR) using Blazor WebAssembly: `RenderMode.InteractiveWebAssembly`
- Interactive Auto: Interactive SSR initially, then CSR on subsequent visits after the Blazor bundle is downloaded: `RenderMode.InteractiveAuto`
- Static server-side rendering (static SSR): Default, when no render mode is specified
  - ⚠️Warning: This render mode is not recommended for most use cases with Nimble. As the page is just rendered once server-side and then no state is maintained, you're unable to use event handlers or call methods on components. This also means that for components like the Nimble Table / Wafer Map, setting data can't be done via the component methods (because they'll have no effect if called).

#### Prerendering

Blazor with .NET 8 uses prerendering by default for interactive render modes. With it enabled, components are initially rendered server-side without event handlers connected, which could cause unexpected behavior (no effect when users interact with controls immediately after page load). 

See the [Blazor prerendering docs](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/render-modes?view=aspnetcore-8.0#prerendering) for information on how to opt out of prerendering.

### Theming and Design Tokens

To use Nimble's theme-aware design tokens in a Blazor app, you should have a `<NimbleThemeProvider>` element as an ancestor to all of the Nimble components you use. The app's default layout (`MainLayout.razor` in the examples) is a good place to put the theme provider (as the root content of the page).

#### Best practices

Custom Blazor components should provide their own scoped CSS file (in addition to a separate .cs file for the template-independent logic). Providing a separate CSS file is necessary to access other Blazor styling mechanisms that are helpful to use.

#### Styling Blazor components

Often you will need to provide CSS for the Nimble Blazor components (et. al) to control things like layout behaviors within a parent container. To accomplish this, in the scoped CSS file for the component containing the Nimble Blazor component (e.g. NimbleTextField), you must use the `::deep` pseudo-selector to target that Nimble component.

MyComponent.razor
```html
<div>
    <NimbleTextField class="text-field"></NimbleTextField>
</div>
```

MyComponent.razor.css
```css
::deep .text-field {
    flex: 1;
}
```

Components _must_ be wrapped in a containing element in order to work with the `::deep` pseduo-selector. For more info see the [Microsoft docs](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/css-isolation?view=aspnetcore-9.0#child-component-support).

#### Using Nimble Design Tokens (CSS/SCSS)

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

### Localization (Optional)

Most user-visible strings displayed by Nimble components are provided by the client application and are expected to be localized by the application if necessary. However, some strings are built into Nimble components and are provided only in English.

To provide localized strings in a localized Blazor app:
1. Add the label providers as children of your `<NimbleThemeProvider>`:
    - `<NimbleLabelProviderCore>`: Used for labels for all components besides the table
    - `<NimbleLabelProviderTable>`: Used for labels for the table (and table sub-components / column types)
2. For each Nimble-provided label shown in the [Label Provider Storybook documentation](https://nimble.ni.dev/storybook/?path=/docs/tokens-label-providers--docs):
    - Add a new entry for the label in a resource file (`.resx`). You can either add to an existing resx file, or create a new one just for the Nimble strings. The resource value should be the Nimble-provided English default string shown in Storybook.
    - Follow [standard Blazor localization patterns](https://learn.microsoft.com/en-us/aspnet/core/blazor/globalization-localization) to localize the strings, and load the localized versions at runtime in your application.
    - Provide Nimble the localized strings with the label provider APIs. For example, to provide the `popupDismiss` label on `NimbleLabelProviderCore`, if you load your string resources with a .NET `IStringLocalizer` instance, your label provider may look like the following:
        ```xml
        <NimbleLabelProviderCore PopupDismiss="@LabelStringLocalizer["popupDismiss"]"></NimbleLabelProviderCore>
        ```

### Using Nimble Blazor in a Blazor Hybrid app

**Requirement:** `Microsoft.AspNetCore.Components.WebView` v8.0.4+

This updated WebView package include a fix so that the JavaScript initialization code that Nimble/Spright Blazor uses gets loaded correctly.
Note that if using the `Microsoft.AspNetCore.Components.WebView.Wpf` package, it only specifies a dependency of `Microsoft.AspNetCore.Components.WebView` v8.0+, so you may to add need an explicit dependency on `Microsoft.AspNetCore.Components.WebView` to ensure a recent enough version is included.
The `Demo.Hybrid` project in the Blazor solution illustrates this setup.

## Contributing

Follow the instructions in [CONTRIBUTING.md](/packages/blazor-workspace/NimbleBlazor/CONTRIBUTING.md) to modify this library.
