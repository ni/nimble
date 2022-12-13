using System.Diagnostics;
using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace NimbleBlazor;

public partial class NimbleTable : ComponentBase
{
    private ElementReference _table;
    internal static string SetTableDataMethodName = "NimbleBlazor.Table.setData";

    [Inject]
    private IJSRuntime? JSRuntime { get; set; }

    [Parameter]
    public IEnumerable<object>? Data { get; set; }

    [Parameter]
    public EventCallback<IEnumerable<object>?> DataChanged { get; set; }

    protected override Task OnAfterRenderAsync(bool firstRender)
    {
        return JSRuntime!.InvokeVoidAsync(SetTableDataMethodName, JsonSerializer.Serialize(Data), _table).AsTask();
    }
}
