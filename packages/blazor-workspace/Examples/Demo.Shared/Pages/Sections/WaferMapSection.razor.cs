using System.Diagnostics.CodeAnalysis;
using Apache.Arrow;
using Apache.Arrow.Types;
using NimbleBlazor;

namespace Demo.Shared.Pages.Sections;

public partial class WaferMapSection
{
    private NimbleWaferMap? _waferMap;

    [NotNull]
    public RecordBatch? DiesTable { get; set; }
    [NotNull]
    public IEnumerable<string> HighlightedTags { get; set; } = Enumerable.Empty<string>();
    [NotNull]
    public WaferMapColorScale ColorScale { get; set; } = new WaferMapColorScale(new List<string> { "red", "green" }, new List<string> { "0", "100" });

    public WaferMapSection()
    {
        UpdateDiesTable(5);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await _waferMap!.SetDataAsync(DiesTable);
        await base.OnAfterRenderAsync(firstRender);
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
