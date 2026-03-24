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
    [InlineData("Test1", "test-1")]
    [InlineData("Test1Test1", "test-1-test-1")]
    [InlineData("ThinkIAm", "think-i-am")]
    [InlineData("ArrowURotateLeftIcon", "arrow-u-rotate-left-icon")]
    public void AttributeHelpersConvertToAttributeString_ResultLowercaseWordsSeparatedByHyphen(string property, string expectedResult)
    {
        var actualResult = AttributeHelpers.ConvertToAttributeString(property);

        Assert.Equal(expectedResult, actualResult);
    }
}
