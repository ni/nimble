# Contributing to Nimble Blazor

## Getting Started

If not already done, download and install the .NET 6 SDK version 6.0.202+  (run `dotnet --version`) which can be downloaded from https://dotnet.microsoft.com/en-us/download

Initialize and build the Nimble monorepo (`npm install` + `npm run build` from the root `nimble` directory) before working with the Blazor codebase.

### Windows (with Visual Studio)

For Nimble Blazor development on Windows, the suggested tools to install are:
- Visual Studio 2022 ([Enterprise, if available](https://my.visualstudio.com/Downloads?PId=8229)): Choose the "ASP.NET and Web Development" Workload in the installer
- Ensure Visual Studio is completely up to date (v17.1.6+): In Visual Studio click "Help" then "Check for Updates"
- (Optional) Enable IIS (see "Enabling IIS", below)
- ASP.NET Core Runtime 6.0.4xx: Choose "Hosting Bundle" under ASP.NET Core Runtime, on the [.NET 6.0 Download Page](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)

In Visual Studio, run either the `Demo.Server` or `Demo.Projects` to see the Blazor demo apps.

### Mac / Visual Studio Code
Install [Visual Studio Code](https://code.visualstudio.com/), and install the suggested extensions that appear once you open the NimbleBlazor project folders.

## Creating a Blazor wrapper for a Nimble element

In Nimble Blazor, the Nimble web components are wrapped as [Razor Components](https://docs.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-6.0#components) that consist of a `.razor` template file and a corresponding `.razor.cs` C# implementation file.

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
- Code style conventions are enforced by the [NI C# Style Guide](https://github.com/ni/csharp-styleguide) 

### 2-way Binding Support, Handling DOM Events

In order to support [2-way binding for a property](https://docs.microsoft.com/en-us/aspnet/core/blazor/components/data-binding?view=aspnetcore-6.0#binding-with-component-parameters) on a Nimble web component, the `.razor` template needs to bind an attribute on the DOM element to the given property, as well as bind to a DOM event that fires when that attribute changes (due to a user action, or another change on the web component).

The C# code for a property supporting 2-way binding will look like this:
```cs
    [Parameter]
    public TValue Value { get; set; }

    [Parameter]
    public EventCallback<TValue> ValueChanged { get; set; }
```

- For a form/ input control (textbox, etc.,), the component should derive from `NimbleInputBase<TValue>`, the `.razor` file needs to bind a DOM element attribute to `CurrentValue` or `CurrentValueAsString`, and set one of those 2 properties in the DOM event listener (generally `@onchange`). `NimbleInputBase` will then handle invoking the `EventCallback`. See `NimbleTextField` for an example.
- The `@onchange` event callback built-in to Blazor supports DOM elements that fire a `change` event, and provides only `element.value` (which must be `string`, `string[]`, or `boolean`) in the event args. Most other cases (custom events with different names, the need to pass additional info from the DOM element to C# in the event args, etc.) will require using Blazor's [custom event arguments/ custom event type](https://docs.microsoft.com/en-us/aspnet/core/blazor/components/event-handling?view=aspnetcore-6.0#custom-event-arguments) support. See `NimbleDrawer` for an example. The event and its event arg type are declared in `EventHandlers.cs`, and `NimbleBlazor.lib.module.js` should be updated to register the custom event type, and create the event args in JavaScript. The event listener (C#) in this case needs to invoke the `[PropertyName]Changed` `EventCallback` itself.

## Testing

### Automated

Testing the Nimble Blazor components is possible through the use of xUnit and bUnit. Each Nimble Blazor component should have a corresponding test file.

### Example App / Manual Testing

Each Nimble Blazor component should also be showcased in the `Demo` example projects. Simple component examples can be added directly in the `ComponentsDemo.razor` file (in the `Demo.Shared` project). The example project is very similar to the Nimble Angular example-client-app, and component demos can be adapted from that Angular app. Things to keep in mind that are specific to Blazor:
- There's no out-of-the-box support for SCSS. The Nimble tokens can still be used as CSS variables (`var(--ni-nimble-...)`)
- In order to target Nimble Blazor components via CSS, you'll need to add `::deep` on the CSS selector. See [fast-blazor #125](https://github.com/microsoft/fast-blazor/issues/125) for more info.

Visual Studio Code commands are included to build and run the example projects:
- `blazor-server-example:build`: Build the `Demo.Server` project
- `blazor-server-example:watch`: Run the `Demo.Server` project in watch mode (to automatically pick up code changes)
- `blazor-wasm-example:build`: Build the `Demo.Client` project
- `blazor-wasm-example:watch`: Run the `Demo.Client` project in watch mode (to automatically pick up code changes)

## Additional Tips

### Enabling IIS

Click Start, open "Turn Windows features on or off", and configure "Web Management Tools" and "World Wide Web Services" in the following way:  
![IIS Feature Configuration](/packages/nimble-blazor/docs/WindowsFeatures-IIS.jpg)
### Running published output

The commandline build will create a published distribution of the Blazor client example app, which can also be tested via IIS:
- Open Internet Information Services (IIS) Manager
- In the left pane, right click "Sites" and click "Add Website..."
- Pick a site name
- Under "Physical Path", click [...] and browse to your `nimble-blazor\dist\blazor-client-app` directory
- Under "Binding", pick a port other than 80 (such as 8080), then click "OK"
- Open http://localhost:8080 (or whatever port you chose)