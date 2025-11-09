namespace JsonToCsharpPoco.Converter;

public abstract class ConverterBase : IConverter
{
    public abstract bool TryConvert(string input, out string output);

    protected virtual string MapCSharpTypeToTypeScript(string csharpType)
    {
        return csharpType switch
        {
            "string" => "string",
            "int" or "double" or "float" or "decimal" => "number",
            "bool" => "boolean",
            "DateTime" => "Date",
            var t when t.EndsWith("[]") => MapCSharpTypeToTypeScript(t[..^2]) + "[]",
            var t when t.StartsWith("IReadOnlyList") || t.StartsWith("List") =>
                MapCSharpTypeToTypeScript(t[(t.IndexOf('<') + 1)..t.IndexOf('>')]) + "[]",
            _ => "any"
        };
    }

    protected object? GetSampleValueForType(string type)
    {
        return type switch
        {
            "string" => "",
            "int" or "double" or "float" or "decimal" => 0,
            "bool" => false,
            "DateTime" => DateTime.Now,
            var t when t.StartsWith("IReadOnlyList") || t.StartsWith("List") || t.EndsWith("[]") => Array.Empty<object>(),
            _ => null
        };
    }
}
