using Apache.Arrow;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using NimbleBlazor;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Demo.Shared;

/// <summary>
/// The MainLayout Component.
/// </summary>
public partial class MainLayout
{
    private Theme Theme { get; set; } = Theme.Light;

    public ErrorBoundary? ErrorBoundary { get; set; }

    private string ThemeAsString
    {
        get => Theme.ToString();
        set => Theme = Enum.Parse<Theme>(value);
    }

    private async void OnThemeChange(string value)
    {
        Theme = Enum.Parse<Theme>(value);
    }

    [Inject]
    public IJSRuntime? JSRuntime { get; set; }

    protected override void OnParametersSet()
    {
        ErrorBoundary?.Recover();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            var prefersDark = await JSRuntime!.InvokeAsync<bool>("DemoShared.PrefersColorScheme.prefersDark");
            Theme = prefersDark ? Theme.Dark : Theme.Light;
            StateHasChanged();
        }

        await base.OnAfterRenderAsync(firstRender);
    }
}