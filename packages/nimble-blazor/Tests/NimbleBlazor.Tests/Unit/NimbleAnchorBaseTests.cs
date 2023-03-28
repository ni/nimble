using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit;

/// <summary>
/// Tests for <see cref="NimbleAnchorBase"/>.
/// </summary>
public class NimbleAnchorBaseTests<T> where T : NimbleAnchorBase
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1000:Do not declare static members on generic types", Justification = "Static needed for MemberData of Theory")]
    public static IEnumerable<object[]> Data =>
        new List<object[]>
        {
            new object[] { (Expression<Func<T, string>>)(x => x.Href), "href" },
            new object[] { (Expression<Func<T, string>>)(x => x.HrefLang), "hreflang" },
            new object[] { (Expression<Func<T, string>>)(x => x.Ping), "ping" },
            new object[] { (Expression<Func<T, string>>)(x => x.ReferrerPolicy), "referrerpolicy" },
            new object[] { (Expression<Func<T, string>>)(x => x.Rel), "rel" },
            new object[] { (Expression<Func<T, string>>)(x => x.Target), "target" },
            new object[] { (Expression<Func<T, string>>)(x => x.Type), "type" }
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
