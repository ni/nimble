# Contributing to Nimble Blazor

## Getting Started (Windows)

For Nimble Blazor development on Windows, the suggested tools to install are:
- Visual Studio 2022 (Enterprise, if available): Choose the "ASP.NET and Web Development" Workload in the installer
- (Optional) Enable IIS (see "Enabling IIS", below)
- ASP.NET Core Runtime 6.0.x (6.0.3 or higher): Choose "Hosting Bundle" under ASP.NET Core Runtime, on the [.NET 6.0 Download Page](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)

Initialize and build the Nimble monorepo (`npm install` + `npm run build` from the root `nimble` directory) before working with the solution in Visual Studio.

In Visual Studio, run either the `NimbleBlazor.Demo.Server` or `NimbleBlazor.Demo.Projects` to see the Blazor demo apps.

## Creating a Blazor wrapper for a Nimble element

In Nimble Blazor, the Nimble web components are wrapped as [Razor Components](https://docs.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-6.0#components) that consist of a `.razor` template file and a corresponding `.razor.cs` C# implementation file.

### Example Component

`NimbleButton.razor`:
```
<nimble-button appearance="@Appearance.ToAttributeValue()"></nimbleButton>
```

`NimbleButton.razor.cs`:
```
public partial class NimbleButton : ComponentBase
{
    [Parameter]
    public Appearance? Appearance { get; set; }
}
```

### Conventions
- The C# class should explicitly inherit from `ComponentBase` or another class that inherits from it. While not strictly necessary it helps with unit testing tooling like bUnit.
- To support child content for a component supply the following in your C# class:
```
    [Parameter]
    public RenderFragment? ChildContent { get; set; }
```
   and in your template reference this parameter like the following:
```
    <nimble-button>@ChildContent</nimble-button>
```
- Code style conventions are enforced by the [NI C# Style Guide](https://github.com/ni/csharp-styleguide) 

## Testing

Testing the Nimble Blazor components is possible through the use of xUnit and bUnit. Each Nimble Blazor component should have a corresponding test file.

Each Nimble Blazor component should also be showcased in the `NimbleBlazor.Demo` example projects. Simple component examples can be added directly in the `ComponentsDemo.razor` file (in the `NimbleBlazor.Demo.Shared` project).

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