using NimbleBlazor.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit;

/// <summary>
/// Tests for the <see cref="AttributeHelpers"/> class.
/// </summary>
public class AttributeHelpersTests
{
    [Theory]
    [InlineData("Test", "test")]
    [InlineData("TestTest", "test-test")]
    [InlineData("Test1", "test1")]
    [InlineData("Test1Test1", "test1-test1")]
    public void AttributeHelpersConvertToAttributeString_ResultLowercaseWordsSeparatedByHyphen(string property, string expectedResult)
    {
        var actualResult = AttributeHelpers.ConvertToAttributeString(property);

        Assert.Equal(expectedResult, actualResult);
    }
}
