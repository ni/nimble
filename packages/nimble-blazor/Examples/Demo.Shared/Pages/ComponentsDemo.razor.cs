using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using NimbleBlazor;

namespace Demo.Shared.Pages
{
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
        private string? DrawerClosedReason { get; set; }
        private string? SelectedRadio { get; set; } = "2";
        private bool BannerOpen { get; set; }

        [NotNull]
        public IEnumerable<SimpleTableRecord> TableData { get; set; } = Enumerable.Empty<SimpleTableRecord>();
        [NotNull]
        public IEnumerable<WaferMapDie> Dies { get; set; } = Enumerable.Empty<WaferMapDie>();
        [NotNull]
        public IEnumerable<string> HighlightedTags { get; set; } = Enumerable.Empty<string>();
        [NotNull]
        public WaferMapColorScale ColorScale { get; set; } = new WaferMapColorScale(new List<string> { "red", "green" }, new List<string> { "0", "100" });

        public ComponentsDemo()
        {
            AddTableRows(10);
            UpdateDies(5);
        }

        private string DrawerLocationAsString
        {
            get => _drawerLocation.ToString();
            set => _drawerLocation = (DrawerLocation)Enum.Parse(typeof(DrawerLocation), value);
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

            for (int i = 0; i < numberOfRowsToAdd; i++)
            {
                int rowCount = tableData.Count;
                string rowCountString = rowCount.ToString(CultureInfo.CurrentCulture);

                tableData.Add(new SimpleTableRecord(
                    rowCountString,
                    $"new string {rowCountString}",
                    $"bar {rowCountString}",
                    "/",
                    "Link",
                    (rowCount % 2 == 0) ? new DateTime(2023, 8, 16, 2, 56, 11) : new DateTime(2022, 3, 7, 20, 28, 41),
                    (rowCount % 2 == 0) ? 100 : 101,
                    (rowCount % 2 == 0) ? "success" : "unknown",
                    rowCount / 10.0,
                    rowCount * 1000.0 * (1.1 + 2 * 60 + 3 * 3600)));
            }

            TableData = tableData;
        }

        public void UpdateDies(int numberOfDies)
        {
            if (numberOfDies < 0)
            {
                return;
            }
            var dies = new List<WaferMapDie>();
            int radius = (int)Math.Ceiling(Math.Sqrt(numberOfDies / Math.PI));
            var centerX = radius;
            var centerY = radius;

            for (var i = centerY - radius; i <= centerY + radius; i++)
            {
                for (
                    var j = centerX;
                    (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY)
                    <= radius * radius;
                    j--)
                {
                    var value = (i + j) % 100;
                    dies.Add(new WaferMapDie(i, j, value.ToString(CultureInfo.CurrentCulture)));
                }
                // generate points right of centerX
                for (
                    var j = centerX + 1;
                    (j - centerX) * (j - centerX) + (i - centerY) * (i - centerY)
                    <= radius * radius;
                    j++)
                {
                    var value = (i + j) % 100;
                    dies.Add(new WaferMapDie(i, j, value.ToString(CultureInfo.CurrentCulture)));
                }
            }
            Dies = dies;
        }
        public void AddDiesToRadius(int numberOfDies)
        {
            UpdateDies(Dies.Count() + (int)(numberOfDies * numberOfDies * Math.PI));
        }
        public void RemoveDiesFromRadius(int numberOfDies)
        {
            UpdateDies(Dies.Count() - (int)(numberOfDies * numberOfDies * Math.PI));
        }
    }

    public class SimpleTableRecord
    {
        public SimpleTableRecord(
            string id,
            string stringValue1,
            string stringValue2,
            string? href,
            string? linkLabel,
            DateTime date,
            int statusCode,
            string result,
            double number,
            double duration)
        {
            Id = id;
            StringValue1 = stringValue1;
            StringValue2 = stringValue2;
            Href = href;
            LinkLabel = linkLabel;
            Date = (ulong)(date - DateTime.UnixEpoch.ToLocalTime()).TotalMilliseconds;
            StatusCode = statusCode;
            Result = result;
            Number = number;
            Duration = duration;
        }

        public string Id { get; }
        public string StringValue1 { get; }
        public string StringValue2 { get; }
        public string? Href { get; }
        public string? LinkLabel { get; }
        public ulong Date { get; }
        public int StatusCode { get; }
        public string Result { get; }
        public double Number { get; }
        public double Duration { get; }
    }

    public enum DialogResult
    {
        OK,
        Cancel
    }
}
