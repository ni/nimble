using System.Diagnostics.CodeAnalysis;
using Microsoft.JSInterop;

namespace OkBlazor;

/// <summary>
/// Helper methods for registering dynamic icons with Ok components.
/// </summary>
public static class OkIconDynamic
{
    private const string RegisterIconDynamicMethodName = "OkBlazor.IconDynamic.registerIconDynamic";
    private const string IconDynamicTagPrefix = "ok-icon-dynamic-";

    /// <summary>
    /// Registers a dynamic icon that can be used by Ok components.
    /// </summary>
    /// <param name="javascriptRuntime">The JavaScript runtime used to invoke OkBlazor interop.</param>
    /// <param name="tagName">The dynamic icon tag name (for example, "ok-icon-dynamic-awesome").</param>
    /// <param name="url">The icon URL or data URI.</param>
    [SuppressMessage("Design", "CA1054:URI-like parameters should not be strings", Justification = "Allows data URIs and relative paths.")]
    public static ValueTask RegisterIconDynamicAsync(IJSRuntime javascriptRuntime, string tagName, string url)
    {
        ArgumentNullException.ThrowIfNull(javascriptRuntime);
        ArgumentNullException.ThrowIfNull(tagName);
        ArgumentNullException.ThrowIfNull(url);
        if (!tagName.StartsWith(IconDynamicTagPrefix, StringComparison.Ordinal))
        {
            throw new ArgumentException($"Tag name must start with '{IconDynamicTagPrefix}'.", nameof(tagName));
        }

        var name = tagName.Substring(IconDynamicTagPrefix.Length);
        if (name.Length == 0)
        {
            throw new ArgumentException($"Tag name must include an icon name after '{IconDynamicTagPrefix}'.", nameof(tagName));
        }

        return javascriptRuntime.InvokeVoidAsync(RegisterIconDynamicMethodName, name, url);
    }
}
