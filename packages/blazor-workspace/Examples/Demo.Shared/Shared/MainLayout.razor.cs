using Apache.Arrow;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using NimbleBlazor;
using OkBlazor;
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
            await OkIconDynamic.RegisterIconDynamicAsync(
                JSRuntime!,
                "ok-icon-dynamic-awesome",
                "data:image/gif;base64,R0lGODlhFwAaAPIHAPfWre+9e//v3s6EITw+PP////+M/wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAHACwAAAAAFwAaAEADkHi63O5jhEmFBSDCYPq0oNUZGTNgJ6ZiVCC5Tywr70QQn3WD5RKpPMvAMhnMjjOJMcLUnIybVuVygfoot50uq7I2gSEBQGhtnMIgaRnJbifXEDjNVWv95If6lCfXT8ZhPVc2BAU4W4ZVJhwFBjcBAgRiNwaNgnMVgIGXKWBhQygxZ2gRdnEYaAJqZU2trq0HCQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkECQoAAAAsAAAAABMABwAAAgqEj6nL7Q+jnLEAACH5BAkKAAIALAIABgATAAQAAAIQlD+pc6gNzRohxAsAY/eyAgAh+QQJCgAEACwEAAUADwAFAAADGThD3E5qhBUrBGrKwLvCWccJJABuYkCuWAIAIfkECQoABAAsAgAGABMABAAAAxhIutM+i70Rqg2zVXqD+AAwhJDWeR/YEAkAIfkEBQoABAAsBAAFAA8ABQAAAxk4Q9xOaoQVKwRqysC7wlnHCSQAbmJArlgCACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAwAsBgAIAAsABwAAAhKMD6PL7SveSsM0gU+AOFqGDQUAIfkEBQoAAQAsBgAIAAsABwAAAxMYurL+EILIFCHviluwJd3lLWICACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAIfkEBQoAAAAsAAAAAAEAAQAAAgJEAQAh+QQFCgAAACwAAAAAAQABAAACAkQBACH5BAUKAAAALAAAAAABAAEAAAICRAEAOw==");

            StateHasChanged();
        }

        await base.OnAfterRenderAsync(firstRender);
    }
}