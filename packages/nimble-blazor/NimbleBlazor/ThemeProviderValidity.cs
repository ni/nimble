using System.Text.Json.Serialization;

namespace NimbleBlazor;

public interface IThemeProviderValidity
{
    public bool InvalidLang { get; }
}

internal sealed class ThemeProviderValidity : IThemeProviderValidity
{
    [JsonPropertyName("invalidLang")]
    public bool InvalidLang { get; set; }
}
