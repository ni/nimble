using Microsoft.AspNetCore.Components;

namespace NI.Nimble.Components;

// Checkbox like items
[BindElement("nimble-checkbox", null, "checked", "onchange")]
[BindElement("nimble-checkbox", "value", "checked", "onchange")]

[BindElement("nimble-menu-item", null, "checked", "onchange")]
[BindElement("nimble-menu-item", "value", "checked", "onchange")]

// Value like items
// nimble-slider (value)
[BindElement("nimble-slider", null, "value", "onchange")]
[BindElement("nimble-slider", "value", "value", "onchange")]

// nimble-select (value)
[BindElement("nimble-select", null, "value", "onchange")]
[BindElement("nimble-select", "value", "value", "onchange")]

// Selection like items (is this the right way?)
[BindElement("nimble-listbox", null, "selectedindex", "onchange")]
[BindElement("nimble-listbox", "value", "selectedindex", "onchange")]

// Text like inputs
[BindElement("nimble-text-field", null, "value", "onchange")]
[BindElement("nimble-text-field", "value", "value", "onchange")]

[BindElement("nimble-text-area", null, "value", "onchange")]
[BindElement("nimble-text-area", "value", "value", "onchange")]

[BindElement("nimble-number-field", null, "value", "onchange")]
[BindElement("nimble-number-field", "value", "value", "onchange")]



public static class BindAttributes
{
}

