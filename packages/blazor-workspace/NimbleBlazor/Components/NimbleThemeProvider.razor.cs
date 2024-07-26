using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace NimbleBlazor;

public partial class NimbleThemeProvider : ComponentBase
{
    private ElementReference _themeProvider;
    internal static string CheckThemeProviderValidityMethodName = "NimbleBlazor.ThemeProvider.checkValidity";
    internal static string GetThemeProviderValidityMethodName = "NimbleBlazor.ThemeProvider.getValidity";

    [Inject]
    private IJSRuntime? JSRuntime { get; set; }

    [Parameter]
    public Direction? Direction { get; set; }

    [Parameter]
    public Theme? Theme { get; set; }

    [Parameter]
    public string? Lang { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>
    /// Returns whether or not the theme provider configuration is valid.
    /// </summary>
    public async Task<bool> CheckValidityAsync()
    {
        return await JSRuntime!.InvokeAsync<bool>(CheckThemeProviderValidityMethodName, _themeProvider);
    }

    /// <summary>
    /// Returns the validity state of the theme provider.
    /// </summary>
    public async Task<IThemeProviderValidity> GetValidityAsync()
    {
        return await JSRuntime!.InvokeAsync<ThemeProviderValidity>(GetThemeProviderValidityMethodName, _themeProvider);
    }
}
