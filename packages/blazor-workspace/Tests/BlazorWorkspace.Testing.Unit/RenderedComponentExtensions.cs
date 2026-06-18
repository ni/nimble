using AngleSharp.Dom;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace BlazorWorkspace.Testing.Unit;

/// <summary>
/// Extension methods for <see cref="IRenderedComponent{TComponent}"/> used to make
/// markup assertions terser and more stable than raw string comparisons.
/// </summary>
public static class RenderedComponentExtensions
{
    /// <summary>
    /// Returns the first rendered DOM element of the component. Useful for asserting
    /// against a component's root element attributes (for example, with
    /// <c>GetAttribute</c> / <c>HasAttribute</c>) without needing to know its tag name.
    /// </summary>
    /// <typeparam name="TComponent">The component type.</typeparam>
    /// <param name="renderedComponent">The rendered component.</param>
    /// <returns>The component's first rendered <see cref="IElement"/>.</returns>
    public static IElement RootElement<TComponent>(this IRenderedComponent<TComponent> renderedComponent)
        where TComponent : IComponent
    {
        return renderedComponent.Nodes.OfType<IElement>().First();
    }

    /// <summary>
    /// Asserts that the component's root element has an attribute with the expected value,
    /// or that the attribute is absent when <paramref name="expectedAttributeValue"/> is
    /// <see langword="null"/>. This provides a stable, semantic alternative to substring or
    /// regular-expression matching against raw markup.
    /// </summary>
    /// <typeparam name="TComponent">The component type.</typeparam>
    /// <param name="renderedComponent">The rendered component.</param>
    /// <param name="attributeName">The name of the attribute to assert against.</param>
    /// <param name="expectedAttributeValue">
    /// The expected attribute value, or <see langword="null"/> to assert the attribute is absent.
    /// </param>
    public static void AssertAttribute<TComponent>(this IRenderedComponent<TComponent> renderedComponent, string attributeName, string? expectedAttributeValue)
        where TComponent : IComponent
    {
        var element = renderedComponent.RootElement();
        if (expectedAttributeValue is null)
        {
            Assert.False(element.HasAttribute(attributeName), $"Expected attribute '{attributeName}' to be absent, but it was present.");
        }
        else
        {
            Assert.Equal(expectedAttributeValue, element.GetAttribute(attributeName));
        }
    }

    /// <summary>
    /// Asserts that the component's root element has the specified boolean attribute present.
    /// </summary>
    /// <typeparam name="TComponent">The component type.</typeparam>
    /// <param name="renderedComponent">The rendered component.</param>
    /// <param name="attributeName">The name of the boolean attribute to assert is present.</param>
    public static void AssertHasAttribute<TComponent>(this IRenderedComponent<TComponent> renderedComponent, string attributeName)
        where TComponent : IComponent
    {
        Assert.True(renderedComponent.RootElement().HasAttribute(attributeName), $"Expected attribute '{attributeName}' to be present, but it was absent.");
    }
}
