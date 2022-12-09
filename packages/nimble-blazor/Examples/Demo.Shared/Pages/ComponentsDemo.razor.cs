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

        [NotNull]
        public IEnumerable<Dictionary<string, object>> TableData { get; set; }

        public ComponentsDemo()
        {
            UpdateTableData();
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

        public void UpdateTableData()
        {
            var tableData = new Dictionary<string, object>[]
            {
                new Dictionary<string, object>()
                {
                    { "firstName", Faker.Name.First() },
                    { "lastName", Faker.Name.Last() }
                },
                new Dictionary<string, object>()
                {
                    { "firstName", Faker.Name.First() },
                    { "lastName", Faker.Name.Last() }
                }
            };
            TableData = tableData;
        }
    }

    public enum DialogResult
    {
        OK,
        Cancel
    }
}
