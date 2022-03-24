# Contributing to Nimble Blazor

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

## Testing

Testing the Nimble Blazor components is possible through the use of xUnit and bUnit. Each Nimble Blazor component should have a corresponding test file.

Each Nimble Blazor component should also be showcased in the `NimbleBlazor.Demo` example projects. Simple component examples can be added directly in the `ComponentsDemo.razor` file (in the `NimbleBlazor.Demo.Shared` project).