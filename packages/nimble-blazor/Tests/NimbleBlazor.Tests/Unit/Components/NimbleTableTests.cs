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
    internal class TableRecord
    {
        public TableRecord(string firstName, string lastName)
        {
            FirstName = firstName;
            LastName = lastName;
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    internal class BadTableRecord
    {
        public BadTableRecord(string firstName, string lastName, BadTableRecord? parent = null)
        {
            FirstName = firstName;
            LastName = lastName;
            Parent = parent;
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public BadTableRecord? Parent { get; set; }
    }

    [Fact]
    public void NimbleTable_Rendered_HasTableMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-table";
        var table = context.RenderComponent<NimbleTable<TableRecord>>();

        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTable_GivenSupportedData_ThrowsNoException()
    {
        var parentRecord = new TableRecord("Bob", "Smith");
        var childRecord = new TableRecord("Sally", "Smith");
        var tableData = new TableRecord[] { parentRecord, childRecord };

        var ex = Record.Exception(() => { RenderWithPropertySet<IEnumerable<TableRecord>, TableRecord>(x => x.Data, tableData); });

        Assert.Null(ex);
    }

    [Fact]
    public void NimbleTable_GivenUnsupportedData_ThrowsJsonException()
    {
        var parentRecord = new BadTableRecord("Bob", "Smith");
        var childRecord = new BadTableRecord("Sally", "Smith", parentRecord);
        var tableData = new BadTableRecord[] { parentRecord, childRecord };

        var ex = Record.Exception(() => { RenderWithPropertySet<IEnumerable<BadTableRecord>, BadTableRecord>(x => x.Data, tableData); });

        Assert.IsType<JsonException>(ex);
    }

    private IRenderedComponent<NimbleTable<TTable>> RenderWithPropertySet<TProperty, TTable>(Expression<Func<NimbleTable<TTable>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTable<TTable>>(p => p.Add(propertyGetter, propertyValue));
    }
}
