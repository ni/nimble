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
                    "https://nimble.ni.dev");
            }
            tableData[numberOfRows] = new Person(
                numberOfRows.ToString(null, null),
                null,
                null,
                null);

            TableData = tableData;
        }
    }

    public class Person
    {
        public Person(string id, string? firstName, string? lastName, string? link)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Link = link;
        }

        public string Id { get; }
        public string? FirstName { get; }
        public string? LastName { get; }
        public string? Link { get; }
    }

    public enum DialogResult
    {
        OK,
        Cancel
    }
}
