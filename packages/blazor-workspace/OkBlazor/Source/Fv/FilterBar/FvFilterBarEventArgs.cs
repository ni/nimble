using System.Text.Json;

namespace OkBlazor;

public sealed class FvFilterBarEventArgs : EventArgs
{
    public JsonElement Query { get; set; }
}
