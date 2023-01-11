using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text.Json;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTable"/>
/// </summary>
public class NimbleTableTests
{
    internal class TableRowData
    {
        public TableRowData(string firstName, string lastName)
        {
            FirstName = firstName;
            LastName = lastName;
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    internal class BadTableRowData
    {
        public BadTableRowData(string firstName, string lastName, BadTableRowData? parent = null)
        {
            FirstName = firstName;
            LastName = lastName;
            Parent = parent;
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public BadTableRowData? Parent { get; set; }
    }

    [Fact]
    public void NimbleTable_Rendered_HasTableMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-table";
        var table = context.RenderComponent<NimbleTable<TableRowData>>();

        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTable_WithClassAttribute_HasTableMarkup()
    {
        IDictionary<string, object> classAttribute = new Dictionary<string, object>();
        classAttribute.Add("class", "table");
        var table = RenderWithPropertySet<IDictionary<string, object>, TableRowData>(x => x.AdditionalAttributes!, classAttribute);

        var expectedMarkup = @"class=""table""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTable_GivenSupportedData_ThrowsNoException()
    {
        var parentRowData = new TableRowData("Bob", "Smith");
        var childRowData = new TableRowData("Sally", "Smith");
        var tableData = new TableRowData[] { parentRowData, childRowData };

        var ex = Record.Exception(() => { RenderWithPropertySet<IEnumerable<TableRowData>, TableRowData>(x => x.Data, tableData); });

        Assert.Null(ex);
    }

    [Fact]
    public void NimbleTable_GivenUnsupportedData_ThrowsJsonException()
    {
        var parentRowData = new BadTableRowData("Bob", "Smith");
        var childRowData = new BadTableRowData("Sally", "Smith", parentRowData);
        var tableData = new BadTableRowData[] { parentRowData, childRowData };

        var ex = Record.Exception(() => { RenderWithPropertySet<IEnumerable<BadTableRowData>, BadTableRowData>(x => x.Data, tableData); });

        Assert.IsType<JsonException>(ex);
    }

    private IRenderedComponent<NimbleTable<TTable>> RenderWithPropertySet<TProperty, TTable>(Expression<Func<NimbleTable<TTable>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTable<TTable>>(p => p.Add(propertyGetter, propertyValue));
    }
}
