﻿using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using Apache.Arrow;
using Apache.Arrow.Types;
using NimbleBlazor;

namespace Demo.Shared.Pages;

/// <summary>
/// The components demo page
/// </summary>
public partial class ComponentsDemo
{
    private DrawerLocation _drawerLocation = DrawerLocation.Right;
    private string? ActiveTabId { get; set; }
    private string? ActiveAnchorTabId { get; set; } = "a-tab-1";
    private NimbleDialog<DialogResult>? _dialog;
    private string? DialogClosedReason { get; set; }
    private NimbleDrawer<DialogResult>? _drawer;
    private NimbleTable<SimpleTableRecord>? _table;
    private NimbleTable<PersonTableRecord>? _delayedHierarchyTable;
    private NimbleWaferMap? _waferMap;
    private string? DrawerClosedReason { get; set; }
    private string? SelectedRadio { get; set; } = "2";
    private bool BannerOpen { get; set; }
    private readonly List<PersonTableRecord> _delayedHierarchyTableData = new()
    {
        new PersonTableRecord("jacqueline-bouvier", null, "Jacqueline", "Bouvier", 80, true),
        new PersonTableRecord("mona-simpson", null, "Mona", "Simpson", 77, true),
        new PersonTableRecord("agnes-skinner", null, "Agnes", "Skinner", 88, true)
    };
    private readonly HashSet<string> _recordsLoadingChildren = new();
    private readonly HashSet<string> _recordsWithLoadedChildren = new();

    public const string MarkdownString = "Supported rich text formatting options:\n" +
                                         "1. **Bold**\n" +
                                         "2. *Italics*\n" +
                                         "3. Numbered lists\n" +
                                         "   1. Option 1\n" +
                                         "   2. Option 2\n" +
                                         "4. Bulleted lists\n" +
                                         "   * Option 1\n" +
                                         "   * Option 2\n" +
                                         "5. Absolute link: <https://nimble.ni.dev/>\n";

    public IEnumerable<DemoColor> PossibleColors
    {
        get
        {
            return Enum.GetValues<DemoColor>();
        }
    }

    public DemoColor CurrentColor { get; private set; }
    public string? OpenMenuButtonColumnRecordId { get; private set; }

    [NotNull]
    public IEnumerable<SimpleTableRecord> TableData { get; set; } = Enumerable.Empty<SimpleTableRecord>();
    [NotNull]
    public RecordBatch? DiesTable { get; set; }
    [NotNull]
    public IEnumerable<string> HighlightedTags { get; set; } = Enumerable.Empty<string>();
    [NotNull]
    public WaferMapColorScale ColorScale { get; set; } = new WaferMapColorScale(new List<string> { "red", "green" }, new List<string> { "0", "100" });

    public ComponentsDemo()
    {
        AddTableRows(10);
        UpdateDiesTable(5);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await _table!.SetDataAsync(TableData);
        await _waferMap!.SetDataAsync(DiesTable);
        await UpdateDelayedHierarchyTableAsync();
        await base.OnAfterRenderAsync(firstRender);
    }

    private async void OnMenuButtonColumnBeforeToggle(TableColumnMenuButtonToggleEventArgs e)
    {
        if (e.NewState == false)
        {
            return;
        }

        OpenMenuButtonColumnRecordId = e.RecordId;
        var openRecord = TableData.First(x => x.Id == OpenMenuButtonColumnRecordId);
        if (openRecord == null)
        {
            return;
        }
        CurrentColor = openRecord.Color;
    }

    private void OnColorSelected(DemoColor color)
    {
        var openRecord = TableData.First(x => x.Id == OpenMenuButtonColumnRecordId);
        if (openRecord == null)
        {
            return;
        }
        openRecord.UpdateColor(color);
    }

    private async Task OnRowExpandToggleAsync(TableRowExpandToggleEventArgs e)
    {
        var recordId = e.RecordId;
        if (e.NewState && !_recordsLoadingChildren.Contains(recordId) && !_recordsWithLoadedChildren.Contains(recordId))
        {
            var record = _delayedHierarchyTableData.Find(person => person.Id == recordId);
            if (record == null)
            {
                return;
            }

            _recordsLoadingChildren.Add(recordId);
            await UpdateDelayedHierarchyTableAsync(false);

            await Task.Delay(1500);
            _recordsLoadingChildren.Remove(recordId);
            _recordsWithLoadedChildren.Add(recordId);
            var childrenToAdd = GetChildren(recordId);
            childrenToAdd.ForEach(child => _delayedHierarchyTableData.Add(child));
            await UpdateDelayedHierarchyTableAsync();
        }
    }

    private List<PersonTableRecord> GetChildren(string recordId)
    {
        switch (recordId)
        {
            case "jacqueline-bouvier":
                return new List<PersonTableRecord>()
                {
                    new PersonTableRecord("marge-simpson", recordId, "Marge", "Simpson", 35, true),
                    new PersonTableRecord("selma-bouvier", recordId, "Selma", "Bouvier", 45, false),
                    new PersonTableRecord("patty-bouvier", recordId, "Patty", "Bouvier", 45, false)
                };
            case "marge-simpson":
                return new List<PersonTableRecord>()
                {
                    new PersonTableRecord("bart-simpson", recordId, "Bart", "Simpson", 12, false),
                    new PersonTableRecord("lisa-bouvier", recordId, "Lisa", "Simpson", 10, false),
                    new PersonTableRecord("maggie-bouvier", recordId, "Maggie", "Simpson", 1, false)
                };
            case "mona-simpson":
                return new List<PersonTableRecord>()
                {
                    new PersonTableRecord("homer-simpson", recordId, "Homer", "Simpson", 35, false)
                };
            case "agnes-skinner":
                return new List<PersonTableRecord>()
                {
                    new PersonTableRecord("seymour-skinner", recordId, "Seymour", "Skinner", 42, false)
                };
            default:
                return new List<PersonTableRecord>();
        }
    }

    private async Task UpdateDelayedHierarchyTableAsync(bool setData = true)
    {
        if (setData)
        {
            await _delayedHierarchyTable!.SetDataAsync(_delayedHierarchyTableData);
        }

        List<TableSetRecordHierarchyOptions> options = new();
        _delayedHierarchyTableData.ForEach(person =>
        {
            if (_recordsLoadingChildren.Contains(person.Id))
            {
                options.Add(
                    new TableSetRecordHierarchyOptions(
                        person.Id,
                        new TableRecordHierarchyOptions(TableRecordDelayedHierarchyState.LoadingChildren)));
            }
            else if (person.HasChildren && !_recordsWithLoadedChildren.Contains(person.Id))
            {
                options.Add(
                    new TableSetRecordHierarchyOptions(
                        person.Id,
                        new TableRecordHierarchyOptions(TableRecordDelayedHierarchyState.CanLoadChildren)));
            }
        });
        await _delayedHierarchyTable!.SetRecordHierarchyOptionsAsync(options);
    }

    private string DrawerLocationAsString
    {
        get => _drawerLocation.ToString();
        set => _drawerLocation = Enum.Parse<DrawerLocation>(value);
    }

    public async Task OpenDialogAsync()
    {
        var response = await _dialog!.ShowAsync();
        DialogClosedReason = response.Reason == DialogCloseReason.UserDismissed ? "User dismissed"
                                                                          : response.Value.ToString();
    }

    public async Task CloseDialogAsync(DialogResult reason)
    {
        await _dialog!.CloseAsync(reason);
    }

    public async Task OpenDrawerAsync()
    {
        var response = await _drawer!.ShowAsync();
        DrawerClosedReason = response.Reason == DrawerCloseReason.UserDismissed ? "User dismissed"
                                                                          : response.Value.ToString();
    }

    public async Task CloseDrawerAsync(DialogResult reason)
    {
        await _drawer!.CloseAsync(reason);
    }

    public void AddTableRows(int numberOfRowsToAdd)
    {
        var tableData = new List<SimpleTableRecord>(TableData);
        List<string> possibleStatuses = new() { "success", "calculating", "unknown" };
        int numberOfDemoColors = PossibleColors.Count();

        for (int i = 0; i < numberOfRowsToAdd; i++)
        {
            int rowCount = tableData.Count;
            string rowCountString = rowCount.ToString(CultureInfo.CurrentCulture);

            tableData.Add(new SimpleTableRecord(
                rowCountString,
                tableData.Count >= 4 ? (tableData.Count % 4).ToString(CultureInfo.CurrentCulture) : null,
                $"new string {rowCountString}",
                $"bar {rowCountString}",
                "/",
                "Link",
                (rowCount % 2 == 0) ? new DateTime(2023, 8, 16, 2, 56, 11) : new DateTime(2022, 3, 7, 20, 28, 41),
                (rowCount % 2 == 0) ? 100 : 101,
                possibleStatuses.ElementAt(rowCount % 3),
                rowCount / 10.0,
                rowCount * 1000.0 * (1.1 + (2 * 60) + (3 * 3600)),
                (DemoColor)(rowCount % numberOfDemoColors)));
        }

        TableData = tableData;
    }

    public void UpdateDiesTable(int numberOfDies)
    {
        if (numberOfDies < 0)
        {
            return;
        }
        var colIndexes = new Int32Array.Builder();
        var rowIndexes = new Int32Array.Builder();
        var values = new DoubleArray.Builder();

        int radius = (int)Math.Ceiling(Math.Sqrt(numberOfDies / Math.PI));
        var centerX = radius;
        var centerY = radius;

        for (var i = centerY - radius; i <= centerY + radius; i++)
        {
            for (
                var j = centerX;
                ((j - centerX) * (j - centerX)) + ((i - centerY) * (i - centerY))
                <= radius * radius;
                j--)
            {
                var value = (i + j) % 100;
                colIndexes.Append(i);
                rowIndexes.Append(j);
                values.Append(value);
            }
            // generate points right of centerX
            for (
                var j = centerX + 1;
                ((j - centerX) * (j - centerX)) + ((i - centerY) * (i - centerY))
                <= radius * radius;
                j++)
            {
                var value = (i + j) % 100;
                colIndexes.Append(i);
                rowIndexes.Append(j);
                values.Append(value);
            }
        }
        var colIndexField = new Field("colIndex", new Int32Type(), false);
        var rowIndexField = new Field("rowIndex", new Int32Type(), false);
        var valueField = new Field("value", new DoubleType(), false);
        var schema = new Schema.Builder()
            .Field(colIndexField)
            .Field(rowIndexField)
            .Field(valueField)
            .Build();

        DiesTable = new RecordBatch(
            schema,
            new List<IArrowArray>
            {
                colIndexes.Build(),
                rowIndexes.Build(),
                values.Build()
            },
            colIndexes.Length);
    }
    public void AddDiesToRadius(int numberOfDies)
    {
        UpdateDiesTable(DiesTable.Length + (int)(numberOfDies * numberOfDies * Math.PI));
    }
    public void RemoveDiesFromRadius(int numberOfDies)
    {
        UpdateDiesTable(DiesTable.Length - (int)(numberOfDies * numberOfDies * Math.PI));
    }
}

public enum DemoColor
{
    Red,
    Green,
    Blue,
    Black,
    Yellow
}

public class SimpleTableRecord
{
    public SimpleTableRecord(
        string id,
        string? parentId,
        string stringValue1,
        string stringValue2,
        string? href,
        string? linkLabel,
        DateTime date,
        int statusCode,
        string result,
        double number,
        double duration,
        DemoColor color)
    {
        Id = id;
        ParentId = parentId;
        StringValue1 = stringValue1;
        StringValue2 = stringValue2;
        Href = href;
        LinkLabel = linkLabel;
        Date = (ulong)(date - DateTime.UnixEpoch.ToLocalTime()).TotalMilliseconds;
        StatusCode = statusCode;
        Result = result;
        Number = number;
        Duration = duration;
        UpdateColor(color);
    }

    public void UpdateColor(DemoColor newColor)
    {
        Color = newColor;
        ColorString = Enum.GetName(newColor)!;
    }

    public string Id { get; }
    public string? ParentId { get; }
    public string StringValue1 { get; }
    public string StringValue2 { get; }
    public string? Href { get; }
    public string? LinkLabel { get; }
    public ulong Date { get; }
    public int StatusCode { get; }
    public string Result { get; }
    public double Number { get; }
    public double Duration { get; }
    public string ColorString { get; private set; } = string.Empty;
    public DemoColor Color { get; private set; }
}

public class PersonTableRecord
{
    public PersonTableRecord(string id, string? parentId, string firstName, string lastName, int age, bool hasChildren)
    {
        Id = id;
        ParentId = parentId;
        FirstName = firstName;
        LastName = lastName;
        Age = age;
        HasChildren = hasChildren;
    }

    public string Id { get; }
    public string? ParentId { get; }
    public string FirstName { get; }
    public string LastName { get; }
    public int Age { get; }
    public bool HasChildren { get; }
}

public enum DialogResult
{
    OK,
    Cancel
}
