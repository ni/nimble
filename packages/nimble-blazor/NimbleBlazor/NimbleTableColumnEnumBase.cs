using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public class NimbleTableColumnEnumBase<TKey> : NimbleTableColumn, IGroupableColumn
{
    /// <summary>
    /// Gets or sets the field in the element representing a row of data in a <see cref="NimbleTable{TData}"/>to display
    /// </summary>
    [Parameter]
    [DisallowNull]
    public string FieldName { get; set; } = null!;

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Specifies the grouping precedence of the column within the set of all columns participating in grouping.
    /// Columns are rendered in the grouping tree from lowest group-index as the tree root to highest
    /// group-index as tree leaves.
    /// </summary>
    [Parameter]
    public int? GroupIndex { get; set; }

    /// <summary>
    /// Whether or not this column can be used to group rows by
    /// </summary>
    [Parameter]
    public bool? GroupingDisabled { get; set; }

    private readonly Type[] cSharpNumberTypes = new[]
    {
        typeof(int),
        typeof(uint),
        typeof(short),
        typeof(ushort),
        typeof(long),
        typeof(ulong),
        typeof(byte),
        typeof(sbyte),
        typeof(float),
        typeof(double),
        typeof(decimal)
    };

    protected string GetTKeyAsJSType()
    {
        if (cSharpNumberTypes.Contains(typeof(TKey)))
        {
            return "number";
        }
        if (typeof(TKey) == typeof(bool))
        {
            return "boolean";
        }
        if (typeof(TKey) == typeof(string))
        {
            return "string";
        }

        throw new ArgumentException("TKey was not a numeric, boolean, or string.");
    }
}
