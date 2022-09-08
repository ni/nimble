# Blazor Number Field

## Problem Statement

We currently haven't exposed the `nimble-number-field` in Blazor. This was primarily due to the uncertainty of how we intended to deal with various numeric types which are readily available in .NET, but don't have any presence in `nimble-components`.

This proposal serves to outline a near-term solution that, if needed, can still provide a path to a long-term vision that may include more fine-grained numeric type support in `nimble-components`. Ultimately the goal is to avoid introducing Blazor-specific functionality into the component.

## Links To Relevant Work Items and Reference Material

[Blazor NumberField prototype](https://github.com/ni/nimble/tree/blazor-number-field)

[Microsoft FluentNumberField](https://github.com/microsoft/fast-blazor/blob/main/src/Microsoft.Fast.Components.FluentUI/Components/FluentNumberField.razor.cs)

## Implementation / Design

I propose we create a non-generic `NimbleNumberField`, using a base type of `NimbleInputBase<double?>`. The nullable type will allow the number field to be empty and display placeholder text. Additionally, the `Min`, `Max`, and `Step` parameters will all share the same type of `double?`.

If the long-term solution merits the transition to a generic API (like the one outlined in the Alternative Implementations section), we are comfortable with it involving a breaking change, and will likely only requre a markup change if anything.

## Alternative Implementations / Designs

The other approach would have been to offer an API similar to that of the Microsoft `FluentNumberField` (linked above), where a client could provide a generic argument to `NimbleNumberField` (ala `NimbleNumberField<int>`).

We are rejecting this because at the moment the web component and its Angular variant have no numeric varietal type handling.
