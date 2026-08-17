using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Demo.Shared.Pages.Sections;

public partial class ChipSection
{
    private bool _chipSelected;

    [Inject]
    private IJSRuntime? JSRuntime { get; set; }

    public async Task OnChipRemoveAsync()
    {
        await JSRuntime!.InvokeVoidAsync("alert", "Chip removed");
    }
}