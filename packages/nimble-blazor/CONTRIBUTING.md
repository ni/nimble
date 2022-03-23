# Contributing to Nimble Blazor

## Creating a Blazor wrapper for a Nimble element

The process for creating a Blazor wrapper for a Nimble component is fairly straight forward. Developers are expected to create their Blazor component with the C# implementation broken out into a separate files. As an example, the `NimbleButton` Blazor component is comprised of two files: `NimbleButton.razor` (the template), and `NimbleButton.razor.cs` (the C# implementation). The contents of the `.razor` file shouldn't simply be the Nimble element with each of its properties/attributes bound to the respective C# property defined in the `.razor.cs` file.

### Example (complete implementation not shown)

NimbleButton.razor:
```
<nimble-button appearance="@Appearance.ToAttributeValue()"></nimbleButton>
```

NimbleButton.razor.cs:
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