namespace OkBlazor;

public sealed class FvMultiSelectOption
{
    public required string Value { get; set; }
    public required string Label { get; set; }
    public bool Disabled { get; set; }
}

public sealed class FvMultiSelectEventArgs : EventArgs
{
    public IEnumerable<string> SelectedValues { get; set; } = [];
    public bool IsMultiSelect { get; set; }
    public string? Source { get; set; }
}
