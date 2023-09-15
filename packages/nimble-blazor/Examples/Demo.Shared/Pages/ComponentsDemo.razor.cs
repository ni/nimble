using System.Diagnostics.CodeAnalysis;
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
        public IEnumerable<Person> TableData { get; set; } = Enumerable.Empty<Person>();

        public ComponentsDemo()
        {
            UpdateTableData(10);
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

        public void UpdateTableData(int numberOfRows)
        {
            var tableData = new Person[numberOfRows + 1];
            for (int i = 0; i < numberOfRows; i++)
            {
                tableData[i] = new Person(
                    i.ToString(null, null),
                    Faker.Name.First(),
                    Faker.Name.Last(),
                    "https://nimble.ni.dev",
                    "Link",
                    i % 2 == 0 ? new DateTime(2023, 8, 16, 3, 56, 11, DateTimeKind.Local) : new DateTime(2022, 3, 7, 20, 28, 41, DateTimeKind.Local),
                    i % 2 == 0 ? 100 : 101,
                    (i % 2 == 0) ? "success" : "unknown",
                    i / 10.0);
            }
            tableData[numberOfRows] = new Person(
                numberOfRows.ToString(null, null),
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);

            TableData = tableData;
        }
    }

    public class Person
    {
        public Person(string id, string? firstName, string? lastName, string? href, string? linkLabel, DateTime? date, int? statusCode, string? result, double? number)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Href = href;
            LinkLabel = linkLabel;
            Date = (ulong?)(date - DateTime.UnixEpoch.ToLocalTime())?.TotalMilliseconds;
            StatusCode = statusCode;
            Result = result;
            Number = number;
        }

        public string Id { get; }
        public string? FirstName { get; }
        public string? LastName { get; }
        public string? Href { get; }
        public string? LinkLabel { get; }
        public ulong? Date { get; }
        public int? StatusCode { get; }
        public string? Result { get; }
        public double? Number { get; }
    }

    public enum DialogResult
    {
        OK,
        Cancel
    }
}
