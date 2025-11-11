using System.Text.RegularExpressions;
using Humanizer;

<<<<<<<< HEAD:src/SharpCast.Ui/Extensions/StringHelperExtensions.cs
namespace SharpCast.Ui.Extensions;
========
namespace JsonToCsharpPoco.Ui.Extensions;
>>>>>>>> e004fa85858166851984f373607cbfdc07546e35:src/Ui/Extensions/StringHelperExtensions.cs
public static partial class StringHelperExtensions
{
    [GeneratedRegex("[^a-zA-Z0-9_.-]", RegexOptions.Compiled)]
    private static partial Regex SpecialCharactersRegex();

    public static string ToPascalCase(this string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return input;

        // This approach is not optimal, but it functions correctly for the time being. Optimization will be addressed later.
        return input.Humanize(LetterCasing.LowerCase)
                    .Pascalize()
                    .RemoveSpecialCharacters()
                    // If still not in PascalCase, apply Pascalize again
                    .Pascalize()
                    .EnsureValidPropertyName();
    }

    public static string EnsureValidPropertyName(this string propertyName)
    {
        if (int.TryParse(propertyName, out _))
        {
            propertyName = $"_{propertyName}";
        }
        return propertyName;
    }

    public static string RemoveSpecialCharacters(this string input) =>
        SpecialCharactersRegex().Replace(input, string.Empty);
}