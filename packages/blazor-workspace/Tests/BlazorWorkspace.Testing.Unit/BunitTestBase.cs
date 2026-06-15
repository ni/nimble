using Bunit;

namespace BlazorWorkspace.Testing.Unit;

/// <summary>
/// Base class for bUnit-based unit tests. Provides a <see cref="BunitContext"/>
/// pre-configured with loose JS interop so derived test classes can call
/// <c>Render&lt;TComponent&gt;()</c> directly without repeating setup boilerplate.
/// </summary>
public abstract class BunitTestBase : BunitContext
{
    /// <summary>
    /// Initializes a new instance of the <see cref="BunitTestBase"/> class with
    /// loose JS interop configured.
    /// </summary>
    protected BunitTestBase()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }
}
