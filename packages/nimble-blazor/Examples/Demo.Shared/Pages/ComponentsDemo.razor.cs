using Faker;
using NimbleBlazor;
using System.Diagnostics.CodeAnalysis;

namespace Demo.Shared.Pages
{
    /// <summary>
    /// The components demo page
    /// </summary>
    public partial class ComponentsDemo
    {
        private DrawerLocation _drawerLocation = DrawerLocation.Right;
        private string? ActiveTabId { get; set; }
        private NimbleDialog<DialogResult>? _dialog;
        private string? DialogClosedReason { get; set; }
        private NimbleDrawer<DialogResult>? _drawer;
        private string? DrawerClosedReason { get; set; }
        private string? SelectedRadio { get; set; } = "2";

        private Person[] _persons = new Person[10000];

        [NotNull]
        public IEnumerable<object> TableData { get; set; }

        public ComponentsDemo()
        {
            UpdateTableData(10);
            for (int i = 0; i < 10000; i++)
            {
                _persons[i] = new Person(Faker.Name.First(), Faker.Name.Last());
            }
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

        public void UpdateTableData(int numRows)
        {
            var tableData = new Person[numRows];
            if (numRows != 10000)
            {
                for (int i = 0; i < numRows; i++)
                {
                    tableData[i] = new Person(Faker.Name.First(), Faker.Name.Last());
                }
            }
            else
            {
                tableData = _persons;
            }

            TableData = tableData;
        }

        private class Person
        {
            public Person(string firstName, string lastName)
            {
                FirstName = firstName;
                LastName = lastName;
            }

            public string FirstName { get; }
            public string LastName { get; }
        }
    }

    public enum DialogResult
    {
        OK,
        Cancel
    }
}
