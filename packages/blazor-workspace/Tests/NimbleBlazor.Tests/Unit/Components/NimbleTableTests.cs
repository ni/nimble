using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text.Json;
using System.Threading.Tasks;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTable"/>
/// </summary>
public class NimbleTableTests : BunitTestBase
{
    internal sealed class TableRowData
    {
        public TableRowData(string firstName, string lastName)
        {
            FirstName = firstName;
            LastName = lastName;
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    internal sealed class BadTableRowData
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
        var table = Render<NimbleTable<TableRowData>>();

        Assert.NotNull(table.Find("nimble-table"));
    }

    [Fact]
    public void NimbleTable_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTable<TableRowData>>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTable_WithIdFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet<string, TableRowData>(x => x.IdFieldName!, "FirstName");

        table.AssertAttribute("id-field-name", "FirstName");
    }

    [Fact]
    public void NimbleTable_WithParentIdFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet<string, TableRowData>(x => x.ParentIdFieldName!, "FirstName");

        table.AssertAttribute("parent-id-field-name", "FirstName");
    }

    [Theory]
    [InlineData(TableRowSelectionMode.None, null)]
    [InlineData(TableRowSelectionMode.Single, "single")]
    [InlineData(TableRowSelectionMode.Multiple, "multiple")]
    public void TextFieldAppearance_AttributeIsSet(TableRowSelectionMode value, string? expectedAttribute)
    {
        var table = RenderWithPropertySet<TableRowSelectionMode?, TableRowData>(x => x.SelectionMode, value);

        table.AssertAttribute("selection-mode", expectedAttribute);
    }

    [Fact]
    public void NimbleTable_WithClassAttribute_HasTableMarkup()
    {
        IDictionary<string, object> classAttribute = new Dictionary<string, object>
        {
            { "class", "table" }
        };
        var table = RenderWithPropertySet<IDictionary<string, object>, TableRowData>(x => x.AdditionalAttributes!, classAttribute);

        table.AssertAttribute("class", "table");
    }

    [Fact]
    public async Task NimbleTable_GivenSupportedData_ThrowsNoExceptionAsync()
    {
        var parentRowData = new TableRowData("Bob", "Smith");
        var childRowData = new TableRowData("Sally", "Smith");
        var tableData = new TableRowData[] { parentRowData, childRowData };
        var table = RenderTable<TableRowData>();

        var exception = await Record.ExceptionAsync(async () => { await table.Instance.SetDataAsync(tableData); });
        Assert.Null(exception);
    }

    [Fact]
    public async Task NimbleTable_GivenUnsupportedData_ThrowsJsonExceptionAsync()
    {
        var parentRowData = new BadTableRowData("Bob", "Smith");
        var childRowData = new BadTableRowData("Sally", "Smith", parentRowData);
        var tableData = new BadTableRowData[] { parentRowData, childRowData };
        var table = RenderTable<BadTableRowData>();

        var exception = await Record.ExceptionAsync(async () => { await table.Instance.SetDataAsync(tableData); });

        Assert.IsType<JsonException>(exception);
    }

    private IRenderedComponent<NimbleTable<TTable>> RenderWithPropertySet<TProperty, TTable>(Expression<Func<NimbleTable<TTable>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleTable<TTable>>(p => p.Add(propertyGetter, propertyValue));
    }

    private IRenderedComponent<NimbleTable<TTable>> RenderTable<TTable>()
    {
        return Render<NimbleTable<TTable>>();
    }
}
