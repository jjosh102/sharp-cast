namespace SharpCast.ModelConverter;

public static class FormatUtility
{
    public static CodeFormat? GuessFormat(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            return null;

        var trimmed = content.TrimStart();

        if (trimmed.StartsWith('{') || trimmed.StartsWith('['))
        {
            return CodeFormat.Json;
        }

        if (trimmed.Contains("public class ") || 
            trimmed.Contains("public record ") || 
            trimmed.Contains("namespace ") ||
            trimmed.Contains("public partial class "))
        {
            return CodeFormat.CSharp;
        }

        if (trimmed.Contains("export interface ") || 
            trimmed.Contains("export type ") || 
            (trimmed.Contains("interface ") && trimmed.Contains(": ")) ||
            (trimmed.Contains("type ") && trimmed.Contains(" = ")))
        {
            return CodeFormat.TypeScript;
        }

        return null;
    }
}
