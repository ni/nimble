﻿using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Security.Principal;
using System.Text.Json;
using System.Threading.Tasks;
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
    public void NimbleTable_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleTable<TableRowData>>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTable_WithIdFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet<string, TableRowData>(x => x.IdFieldName!, "FirstName");

        var expectedMarkup = @"id-field-name=""FirstName""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTable_WithParentIdFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet<string, TableRowData>(x => x.ParentIdFieldName!, "FirstName");

        var expectedMarkup = @"parent-id-field-name=""FirstName""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Theory]
    [InlineData(TableRowSelectionMode.None, null)]
    [InlineData(TableRowSelectionMode.Single, "single")]
    [InlineData(TableRowSelectionMode.Multiple, "multiple")]
    public void TextFieldAppearance_AttributeIsSet(TableRowSelectionMode value, string expectedAttribute)
    {
        var table = RenderWithPropertySet<TableRowSelectionMode?, TableRowData>(x => x.SelectionMode, value);

        if (expectedAttribute == null)
        {
            Assert.DoesNotContain("selection-mode", table.Markup);
        }
        else
        {
            var expectedMarkup = $"selection-mode=\"{expectedAttribute}\"";
            Assert.Contains(expectedMarkup, table.Markup);
        }
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
    public async Task NimbleTable_GivenSupportedData_ThrowsNoExceptionAsync()
    {
        var parentRowData = new TableRowData("Bob", "Smith");
        var childRowData = new TableRowData("Sally", "Smith");
        var tableData = new TableRowData[] { parentRowData, childRowData };
        var table = Render<TableRowData>();

        var ex = Record.ExceptionAsync(async () => { await table.Instance.SetDataAsync(tableData); });

        Assert.Null(ex.Result);
    }

    [Fact]
    public async Task NimbleTable_GivenUnsupportedData_ThrowsJsonExceptionAsync()
    {
        var parentRowData = new BadTableRowData("Bob", "Smith");
        var childRowData = new BadTableRowData("Sally", "Smith", parentRowData);
        var tableData = new BadTableRowData[] { parentRowData, childRowData };
        var table = Render<BadTableRowData>();

        var ex = Record.ExceptionAsync(async () => { await table.Instance.SetDataAsync(tableData); });

        Assert.IsType<JsonException>(ex.Result);
    }

    private IRenderedComponent<NimbleTable<TTable>> RenderWithPropertySet<TProperty, TTable>(Expression<Func<NimbleTable<TTable>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTable<TTable>>(p => p.Add(propertyGetter, propertyValue));
    }

    private IRenderedComponent<NimbleTable<TTable>> Render<TTable>()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTable<TTable>>();
    }
}
