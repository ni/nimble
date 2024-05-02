using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleSelect : ListComponentBase<string>
{
    /// <summary>
    /// Gets or sets the name of the Select.
    /// </summary>
    [Parameter]
    public string? Name { get; set; }

    /// <summary>
    /// Gets or sets the select dropdown position.
    /// </summary>
    [Parameter]
    public Position? Position { get; set; }

    /// <summary>
    /// Gets or sets the select appearance <see cref="DropdownAppearance"/>.
    /// </summary>
    [Parameter]
    public DropdownAppearance? Appearance { get; set; }

    /// <summary>
    /// Gets or sets the select filter mode.
    /// </summary>
    [Parameter]
    public FilterMode? FilterMode { get; set; }

    /// <summary>
    /// Gets or sets the select error text
    /// </summary>
    [Parameter]
    public string? ErrorText { get; set; }

    /// <summary>
    /// Gets or sets whether the select error is visible
    /// </summary>
    [Parameter]
    public bool? ErrorVisible { get; set; }
}
