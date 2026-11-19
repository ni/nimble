namespace OkBlazor;

public sealed class FvEventArgs : EventArgs
{
    public string? Source { get; set; }
}

public sealed class FvToggleEventArgs : EventArgs
{
    public bool Open { get; set; }
    public string? Source { get; set; }
}

public sealed class FvListChangeEventArgs : EventArgs
{
    public string? Value { get; set; }
    public string? Source { get; set; }
}

public sealed class FvPositionEventArgs : EventArgs
{
    public double Position { get; set; }
    public string? Source { get; set; }
}
