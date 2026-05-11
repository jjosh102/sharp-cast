using SharpCast.ModelConverter;
using Xunit;

namespace SharpCast.ModelConverter.Tests;

public class FormatUtilityTests
{
    [Theory]
    [InlineData("{\"name\": \"test\"}", CodeFormat.Json)]
    [InlineData("[1, 2, 3]", CodeFormat.Json)]
    [InlineData("public class Test { }", CodeFormat.CSharp)]
    [InlineData("namespace MyNamespace { }", CodeFormat.CSharp)]
    [InlineData("public record Person(string Name);", CodeFormat.CSharp)]
    [InlineData("export interface ITest { }", CodeFormat.TypeScript)]
    [InlineData("export type Test = { name: string };", CodeFormat.TypeScript)]
    [InlineData("interface ITest { name: string; }", CodeFormat.TypeScript)]
    [InlineData("type MyType = string | number;", CodeFormat.TypeScript)]
    public void GuessFormat_ShouldDetectCorrectFormat(string input, CodeFormat expected)
    {
        // Act
        var result = FormatUtility.GuessFormat(input);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void GuessFormat_ShouldReturnNull_ForUnknownFormat()
    {
        // Act
        var result = FormatUtility.GuessFormat("random text that is not code");

        // Assert
        Assert.Null(result);
    }
}
