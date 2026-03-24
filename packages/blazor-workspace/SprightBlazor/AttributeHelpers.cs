using System.Text;
using System.Text.RegularExpressions;

namespace SprightBlazor;

internal static class AttributeHelpers
{
    public static Dictionary<TEnum, string> GetEnumNamesAsKebabCaseValues<TEnum>()
        where TEnum : struct, Enum
    {
        return Enum.GetValues<TEnum>().ToDictionary(id => id, id => ConvertToAttributeString(id.UnsafeGetName()));
    }

    /// <summary>
    /// This method assumes 'name' is of expected C# property naming conventions
    /// </summary>
    /// <param name="name">The property name to convert into an expected attribute string</param>
    /// <returns>The attribute string form of the property name</returns>
    internal static string ConvertToAttributeString(string name)
    {
        var expression = new Regex(@"[A-Z]{1}[a-z]*|[0-9]*");
        MatchCollection matches = expression.Matches(name);
        var attributeValue = new StringBuilder();
        for (int i = 0; i < matches.Count && matches[i].Value.Length > 0; i++)
        {
            if (i > 0)
            {
                attributeValue.Append('-');
            }

#pragma warning disable CA1308 // We want all lowercase
            attributeValue.Append(matches[i].Value.ToLowerInvariant());
#pragma warning restore CA1308 // We want all lowercase
        }

        return attributeValue.ToString();
    }
}