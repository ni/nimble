using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using NimbleBlazor;

namespace Demo.Shared.Pages.Sections;

public partial class TableSection
{
    private NimbleTable<SimpleTableRecord>? _table;

    public IEnumerable<DemoColor> PossibleColors => Enum.GetValues<DemoColor>();

    public DemoColor CurrentColor { get; private set; }
    public string? OpenMenuButtonColumnRecordId { get; private set; }

    [NotNull]
    public IEnumerable<SimpleTableRecord> TableData { get; set; } = Enumerable.Empty<SimpleTableRecord>();

    public TableSection()
    {
        AddTableRows(10);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await _table!.SetDataAsync(TableData);
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
}
