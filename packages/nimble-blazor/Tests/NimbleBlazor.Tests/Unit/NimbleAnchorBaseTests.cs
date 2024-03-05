using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit;

/// <summary>
/// Tests for <see cref="NimbleAnchorBase"/>.
/// </summary>
public abstract class NimbleAnchorBaseTests<T> where T : NimbleAnchorBase
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1000:Do not declare static members on generic types", Justification = "Static needed for MemberData of Theory")]
    public static TheoryData<Expression<Func<T, string>>, string> Data => new()
        {
            { x => x.Href, "href" },
            { x => x.HrefLang, "hreflang" },
            { x => x.Ping, "ping" },
            { x => x.ReferrerPolicy, "referrerpolicy" },
            { x => x.Rel, "rel" },
            { x => x.Target, "target" },
            { x => x.Type, "type" }
        };

    [Theory]
    [MemberData(nameof(Data))]
    public void NimbleAnchorBase_AttributeIsSet(Expression<Func<T, string>> propertyGetter, string markupName)
    {
        var anchorMenuItem = RenderWithPropertySet(propertyGetter, "foo");

        Assert.Contains($"{markupName}=\"foo\"", anchorMenuItem.Markup);
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<T>(p => p.Add(propertyGetter, propertyValue));
    }
}
