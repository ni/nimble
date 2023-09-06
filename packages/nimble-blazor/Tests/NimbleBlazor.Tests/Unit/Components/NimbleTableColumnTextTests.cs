﻿using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextTests
{
    [Fact]
    public void NimbleTableColumnText_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleTableColumnText>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "FirstName");

        var expectedMarkup = @"field-name=""FirstName""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    private IRenderedComponent<NimbleTableColumnText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnText>(p => p.Add(propertyGetter, propertyValue));
    }
}

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextBaseTests : NimbleTableColumnTests<NimbleTableColumnText>
{
}

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnText>
{
}

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextGroupableTests : GroupableBaseTests<NimbleTableColumnText>
{
}
