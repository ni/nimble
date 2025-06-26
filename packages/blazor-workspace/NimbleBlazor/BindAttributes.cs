using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

// Checkbox like items
[BindElement("nimble-checkbox", null, "checked", "onchange")]
[BindElement("nimble-checkbox", "value", "checked", "onchange")]

[BindElement("nimble-menu-item", null, "checked", "onchange")]
[BindElement("nimble-menu-item", "value", "checked", "onchange")]

// nimble-select (value)
[BindElement("nimble-select", null, "value", "onchange")]
[BindElement("nimble-select", "value", "value", "onchange")]

// Text like inputs
[BindElement("nimble-text-field", null, "value", "onchange")]
[BindElement("nimble-text-field", "value", "value", "onchange")]

public static class BindAttributes
{
}