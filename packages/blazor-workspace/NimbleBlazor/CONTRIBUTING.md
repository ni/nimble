# Contributing to Nimble Blazor

## Getting Started

If not already done, download and install the .NET SDK (see [the main contributing doc](/CONTRIBUTING.md) for the required version).

Initialize and build the Nimble monorepo (`npm install` + `npm run build` from the root `nimble` directory) before working with the Blazor codebase.

### Windows (with Visual Studio)

For Nimble Blazor development on Windows, the suggested tools to install are:
- Visual Studio 2022 ([Enterprise, if available](https://my.visualstudio.com/Downloads?PId=8229)): Choose the "ASP.NET and Web Development" Workload in the installer
- Ensure Visual Studio is completely up to date (v17.11.2+): In Visual Studio click "Help" then "Check for Updates"
- (Optional) Enable IIS (see "Enabling IIS", below)
- ASP.NET Core Runtime 8.0.x: Choose "Hosting Bundle" under ASP.NET Core Runtime, on the [.NET 8.0 Download Page](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

In Visual Studio, run the `Demo.Server`, `Demo.Client`, or `Demo.Hybrid` projects to see the Blazor demo apps.

Note: If you get an error stating "Failed to launch debug adapter" / "Unable to launch browser" when debugging `Demo.Client`, ensure that Microsoft Edge is the browser being used (dropdown menu from the Run button).

### Mac / Visual Studio Code
Install [Visual Studio Code](https://code.visualstudio.com/), and install the suggested extensions that appear once you open the NimbleBlazor project folders.

## Creating a Blazor wrapper for a Nimble element

In Nimble Blazor, the Nimble web components are wrapped as [Razor Components](https://learn.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-8.0#components) that consist of a `.razor` template file and a corresponding `.razor.cs` C# implementation file.

### Example Component

`NimbleButton.razor`:
```
<nimble-button appearance="@Appearance.ToAttributeValue()"></nimbleButton>
```

`NimbleButton.razor.cs`:
```cs
public partial class NimbleButton : ComponentBase
{
    [Parameter]
    public Appearance? Appearance { get; set; }
}
```

### Conventions
- The C# class should explicitly inherit from `ComponentBase` or another class that inherits from it. While not strictly necessary it helps with unit testing tooling like bUnit.
- To support child content for a component supply the following in your C# class:
```cs
    [Parameter]
    public RenderFragment? ChildContent { get; set; }
```
   and in your template reference this parameter like the following:
```
    <nimble-button>@ChildContent</nimble-button>
```
- Always add an `AdditionalAttributes` parameter that captures unmatched values, so that attributes not declared explicitly, such as the common `class` or `id` attributes, can still be passed along to the Nimble element:
```CS
[Parameter(CaptureUnmatchedValues = true)]
public IDictionary<string, object>? AdditionalAttributes { get; set; }
```
- Code style conventions are enforced by the [NI C# Style Guide](https://github.com/ni/csharp-styleguide)

### 2-way Binding Support, Handling DOM Events

In order to support [2-way binding for a property](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/data-binding?view=aspnetcore-8.0#binding-with-component-parameters) on a Nimble web component, the `.razor` template needs to bind an attribute on the DOM element to the given property, as well as bind to a DOM event that fires when that attribute changes (due to a user action, or another change on the web component).

The C# code for a property supporting 2-way binding will look like this:
```cs
    [Parameter]
    public TValue Value { get; set; }

    [Parameter]
    public EventCallback<TValue> ValueChanged { get; set; }
```

- For a form/ input control (textbox, etc.,), the component should derive from `NimbleInputBase<TValue>`, the `.razor` file needs to bind a DOM element attribute to `CurrentValue` or `CurrentValueAsString`, and set one of those 2 properties in the DOM event listener (generally `@onchange`). `NimbleInputBase` will then handle invoking the `EventCallback`. See `NimbleTextField` for an example. Note that [Nimble has gaps in its `EditForm` support](https://github.com/ni/nimble/issues/766).
- The `@onchange` event callback built-in to Blazor supports DOM elements that fire a `change` event, and provides only `element.value` (which must be `string`, `string[]`, or `boolean`) in the event args. Most other cases (custom events with different names, the need to pass additional info from the DOM element to C# in the event args, etc.) will require using Blazor's [custom event arguments/ custom event type](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/event-handling?view=aspnetcore-8.0#custom-event-arguments) support. See `NimbleDrawer` for an example. The event and its event arg type are declared in `EventHandlers.cs`, and `NimbleBlazor.lib.module.js` should be updated to register the custom event type, and create the event args in JavaScript. The event listener (C#) in this case needs to invoke the `[PropertyName]Changed` `EventCallback` itself.

## Testing

### Automated Unit Tests

Test Project: `NimbleBlazor.Tests`

Testing the Nimble Blazor components is possible through the use of xUnit and bUnit. Each Nimble Blazor component should have a corresponding test file.

### Automated Acceptance Tests

Test Project: `NimbleBlazor.Tests.Acceptance`

In order to fully test the Nimble Blazor components, consider writing new automated acceptance tests for new/modified components. Any component which requires custom JS code in `NimbleBlazor.lib.module.js` should generally have corresponding acceptance tests, because the bUnit tests in `NimbleBlazor.Tests` are unable to exercise/test that JavaScript code.

The `NimbleBlazor.Tests.Acceptance` project starts a local Blazor Web App which serves Razor pages that host the Nimble components. Then, xUnit-based acceptance tests start a Chromium instance using [Playwright](https://playwright.dev/), load those Razor pages, and interact with them. The majority of the tests use the `InteractiveServer` render mode, but the project also supports the Interactive Web Assembly render mode (and static server-side rendering mode) for tests. Tests should disable prerendering (as shown in the steps below) to ensure the components are ready for interaction when the Playwright test starts.

To add a new acceptance test (with the Interactive Server render mode):
- Add a new Razor file that uses that component in the `Pages.InteractiveServer` subfolder, with the name `[ComponentName][FunctionalityUnderTest].razor`, e.g. `DialogOpenAndClose.razor`.
  - Add any necessary code to initialize the component in a `@code` section in the same file. If you'll interact with the component as the test runs, you may need to add other Nimble components like buttons to trigger new actions on your component under test.
  - Ensure that your Razor file has `@rendermode @(new InteractiveServerRenderMode(prerender: false))` in the top section.
  - Specify the page's URL route via a `@page` directive - for example, `@page "/InteractiveServer/DialogOpenAndClose"`.
- In the `Tests.InteractiveServer` subfolder, add a new class `[ComponentName]Tests.cs` if it doesn't already exist. Add a new test method in that class. Load your Razor file with the `NewPageForRouteAsync(routeName)` method. Using the Playwright APIs, interact with the components on the page, and make assertions about the state of the component under test.

See the existing acceptance tests for examples of using the Playwright APIs. Additionally, see [Getting Started with Playwright Tests (Skyline End2EndTests)](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=/End2EndTests/Getting%20Started%20with%20Playwright%20Tests.md&_a=preview) and the [Playwright .NET docs on writing tests](https://playwright.dev/dotnet/docs/writing-tests).

### Example App / Manual Testing

Each Nimble Blazor component should also be showcased in the `Demo` example projects. Simple component examples can be added directly in the `ComponentsDemo.razor` file (in the `Demo.Shared` project). The example project is very similar to the Nimble Angular example-client-app, and component demos can be adapted from that Angular app. Things to keep in mind that are specific to Blazor:
- There's no out-of-the-box support for SCSS. The Nimble tokens can still be used as CSS variables (`var(--ni-nimble-...)`)
- In order to target Nimble Blazor components via CSS, you'll need to add `::deep` on the CSS selector. See [fast-blazor #125](https://github.com/microsoft/fast-blazor/issues/125) for more info.

Visual Studio Code commands are included to build and run the example projects. Run one of the following commands through Quick Open (`Ctrl+P`) by typing "task" followed by a `Space` and then the command name.
- `blazor-server-example:build`: Build the `Demo.Server` project
- `blazor-server-example:watch`: Run the `Demo.Server` project in watch mode (to automatically pick up code changes)
- `blazor-wasm-example:build`: Build the `Demo.Client` project
- `blazor-wasm-example:watch`: Run the `Demo.Client` project in watch mode (to automatically pick up code changes)
- `blazor-hybrid-example:build`: (Windows only) Build the `Demo.Hybrid` project
- `blazor-hybrid-example:watch`: (Windows only) Run the `Demo.Hybrid` project in watch mode (to automatically pick up code changes)

Also see the [trusting the ASP.NET Core development certificate docs](https://learn.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-8.0&tabs=visual-studio%2Clinux-sles#trust-the-aspnet-core-https-development-certificate-on-windows-and-macos).

## Creating a New Project

When creating a new project in the Blazor workspace, ensure it includes the following configuration:

- .NET version matches other projects in the workspace
- `<RestorePackagesWithLockFile>true</RestorePackagesWithLockFile>`
- `<DisableImplicitNuGetFallbackFolder>true</DisableImplicitNuGetFallbackFolder>`
- Package reference to `NI.CSharp.Analyzers` with same version spec as other projects

## Additional Tips

### Enabling IIS

Click Start, open "Turn Windows features on or off", and configure "Web Management Tools" and "World Wide Web Services" in the following way:
![IIS Feature Configuration](/packages/blazor-workspace/docs/WindowsFeatures-IIS.jpg)
### Running published output

The commandline build will create a published distribution of the Blazor client example app, which can also be tested via IIS:
- Open Internet Information Services (IIS) Manager
- In the left pane, right click "Sites" and click "Add Website..."
- Pick a site name
- Under "Physical Path", click [...] and browse to your `blazor-workspace\dist\blazor-client-app` directory
- Under "Binding", pick a port other than 80 (such as 8080), then click "OK"
- Open http://localhost:8080 (or whatever port you chose)