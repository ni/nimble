# Nimble Blazor – AI Instructions

## Overview
Blazor Razor Components that wrap Nimble Web Components for use in .NET applications.
- **Pattern**: Razor Component (`.razor`) + Code-behind (`.razor.cs`)
- **Binding**: 2-way binding via `EventCallback`

## Build & Test
Run these commands from the repo root:
- **Build**: `dotnet build packages/blazor-workspace/NimbleBlazor.sln`
- **Test**: `dotnet test packages/blazor-workspace/NimbleBlazor.sln`

## Key References
- [`NimbleBlazor/CONTRIBUTING.md`](NimbleBlazor/CONTRIBUTING.md) – Wrapper patterns, testing, and setup.

## Core Patterns

### Wrapper Skeleton (`.razor`)
```razor
@inherits NimbleInputBase<string>
<nimble-example
    my-attribute="@MyAttribute"
    @attributes="AdditionalAttributes">
</nimble-example>
```

### Wrapper Logic (`.razor.cs`)
```csharp
public partial class NimbleExample : ComponentBase
{
    [Parameter]
    public string? MyAttribute { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
```

## Testing
- **Unit**: Use bUnit in `NimbleBlazor.Tests`.
- **Acceptance**: Use Playwright in `NimbleBlazor.Tests.Acceptance`.
    - Disable prerendering: `@rendermode @(new InteractiveServerRenderMode(prerender: false))`
    - Use `NewPageForRouteAsync` to load the test page.

## Common Pitfalls
- ❌ **Missing `CaptureUnmatchedValues`**: Always allow users to pass arbitrary attributes.
- ❌ **Sync Interop**: Avoid synchronous JS interop; use `InvokeAsync`.
- ❌ **Hardcoded Events**: Use `EventCallback` for all event handling.
