namespace Demo.Shared.Pages;

/// <summary>
/// The components demo page
/// </summary>
public partial class ComponentsDemo
{
}

public enum DemoColor
{
    Red,
    Green,
    Blue,
    Black,
    Yellow
}

public class SimpleTableRecord
{
    public SimpleTableRecord(
        string id,
        string? parentId,
        string stringValue1,
        string stringValue2,
        string? href,
        string? linkLabel,
        DateTime date,
        int statusCode,
        string result,
        double number,
        double duration,
        DemoColor color)
    {
        Id = id;
        ParentId = parentId;
        StringValue1 = stringValue1;
        StringValue2 = stringValue2;
        Href = href;
        LinkLabel = linkLabel;
        Date = (ulong)(date - DateTime.UnixEpoch.ToLocalTime()).TotalMilliseconds;
        StatusCode = statusCode;
        Result = result;
        Number = number;
        Duration = duration;
        UpdateColor(color);
    }

    public void UpdateColor(DemoColor newColor)
    {
        Color = newColor;
        ColorString = Enum.GetName(newColor)!;
    }

    public string Id { get; }
    public string? ParentId { get; }
    public string StringValue1 { get; }
    public string StringValue2 { get; }
    public string? Href { get; }
    public string? LinkLabel { get; }
    public ulong Date { get; }
    public int StatusCode { get; }
    public string Result { get; }
    public double Number { get; }
    public double Duration { get; }
    public string ColorString { get; private set; } = string.Empty;
    public DemoColor Color { get; private set; }
}

public class PersonTableRecord
{
    public PersonTableRecord(string id, string? parentId, string firstName, string lastName, int age, bool hasChildren)
    {
        Id = id;
        ParentId = parentId;
        FirstName = firstName;
        LastName = lastName;
        Age = age;
        HasChildren = hasChildren;
    }

    public string Id { get; }
    public string? ParentId { get; }
    public string FirstName { get; }
    public string LastName { get; }
    public int Age { get; }
    public bool HasChildren { get; }
}

public enum DialogResult
{
    OK,
    Cancel
}
