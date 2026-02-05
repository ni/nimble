using System.Diagnostics.CodeAnalysis;
using Microsoft.JSInterop;

namespace OkBlazor;

/// <summary>
/// Helper methods for registering dynamic icons with Ok components.
/// </summary>
public static class OkIconDynamic
{
    private const string RegisterIconDynamicMethodName = "OkBlazor.IconDynamic.registerIconDynamic";

    /// <summary>
    /// Registers a dynamic icon that can be used by Ok components.
    /// </summary>
    /// <param name="javascriptRuntime">The JavaScript runtime used to invoke OkBlazor interop.</param>
    /// <param name="name">The icon name (lowercase letters, at least two characters).</param>
    /// <param name="url">The icon URL or data URI.</param>
    [SuppressMessage("Design", "CA1054:URI-like parameters should not be strings", Justification = "Allows data URIs and relative paths.")]
    public static ValueTask RegisterIconDynamicAsync(IJSRuntime javascriptRuntime, string name, string url)
    {
        ArgumentNullException.ThrowIfNull(javascriptRuntime);
        ArgumentNullException.ThrowIfNull(url);
        return javascriptRuntime.InvokeVoidAsync(RegisterIconDynamicMethodName, name, url);
    }
}
