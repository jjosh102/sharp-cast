using System.Text;
using System.Text.RegularExpressions;

namespace SharpCast.ModelConverter;

public sealed partial class TypeScriptToCSharpConverter : IModelConverter<ConversionOptions>
{
    private sealed record TsInterface(string Name, List<TsProperty> Properties);
    private sealed record TsProperty(string Name, string Type, bool IsOptional);

    public bool TryConvert(string input, ConversionOptions options, out string output)
    {
        try
        {
            var interfaces = ParseInterfaces(input);
            if (interfaces.Count == 0)
            {
                output = "Error converting TypeScript to C#: No interfaces found.";
                return false;
            }

            output = RenderCSharp(interfaces, options);
            return true;
        }
        catch (Exception ex)
        {
            output = $"Error converting TypeScript to C#: {ex.Message}";
            return false;
        }
    }

    private static string RenderCSharp(List<TsInterface> interfaces, ConversionOptions options)
    {
        var sb = new StringBuilder();
        var usings = CollectUsings(interfaces, options);

        foreach (var use in usings)
        {
            sb.Append("using ").Append(use).AppendLine(";");
        }

        if (usings.Count > 0)
            sb.AppendLine();

        if (options.UseFileScoped)
        {
            sb.Append("namespace ").Append(options.Namespace).AppendLine(";").AppendLine();
            foreach (var type in interfaces)
            {
                EmitType(sb, type, options, 0);
                sb.AppendLine();
            }
        }
        else
        {
            sb.Append("namespace ").Append(options.Namespace).AppendLine();
            sb.AppendLine("{");
            foreach (var type in interfaces)
            {
                EmitType(sb, type, options, 1);
                sb.AppendLine();
            }
            sb.AppendLine("}");
        }

        return sb.ToString().TrimEnd();
    }

    private static HashSet<string> CollectUsings(List<TsInterface> interfaces, ConversionOptions options)
    {
        var usings = new HashSet<string>(StringComparer.Ordinal);

        if (options.AddAttribute)
            usings.Add("System.Text.Json.Serialization");

        foreach (var iface in interfaces)
        {
            foreach (var prop in iface.Properties)
            {
                var mapped = MapTsType(prop.Type, prop.IsOptional, options.ArrayType);
                if (mapped.Type.Contains("List<", StringComparison.Ordinal) ||
                    mapped.Type.Contains("IReadOnlyList<", StringComparison.Ordinal) ||
                    mapped.Type.Contains("Dictionary<", StringComparison.Ordinal))
                {
                    usings.Add("System.Collections.Generic");
                }
            }
        }

        return usings;
    }

    private static void EmitType(StringBuilder sb, TsInterface iface, ConversionOptions options, int indent)
    {
        var typeName = iface.Name.ToPascalCase().EnsureValidPropertyName();
        var indentStr = new string(' ', indent * 4);

        if (options.UseRecords && options.UsePrimaryConstructor)
        {
            sb.Append(indentStr).Append("public record ").Append(typeName).AppendLine("(");
            for (int i = 0; i < iface.Properties.Count; i++)
            {
                var prop = iface.Properties[i];
                var mapped = MapTsType(prop.Type, prop.IsOptional, options.ArrayType);
                var csharpName = prop.Name.ToPascalCase().EnsureValidPropertyName();
                var separator = i == iface.Properties.Count - 1 ? string.Empty : ",";

                sb.Append(indentStr).Append("    ");
                if (options.AddAttribute)
                {
                    sb.Append("[property: JsonPropertyName(\"")
                        .Append(EscapeString(prop.Name))
                        .Append("\")] ");
                }
                sb.Append(mapped.Type).Append(" ").Append(csharpName).Append(separator).AppendLine();
            }
            sb.Append(indentStr).AppendLine(");");
            return;
        }

        if (options.UseRecords)
            sb.Append(indentStr).Append("public record ").Append(typeName).AppendLine();
        else
            sb.Append(indentStr).Append("public class ").Append(typeName).AppendLine();

        sb.Append(indentStr).AppendLine("{");

        foreach (var prop in iface.Properties)
        {
            EmitProperty(sb, prop, options, indent + 1);
        }

        sb.Append(indentStr).AppendLine("}");
    }

    private static void EmitProperty(StringBuilder sb, TsProperty prop, ConversionOptions options, int indent)
    {
        var indentStr = new string(' ', indent * 4);
        var mapped = MapTsType(prop.Type, prop.IsOptional, options.ArrayType);
        var csharpName = prop.Name.ToPascalCase().EnsureValidPropertyName();

        if (options.AddAttribute)
        {
            sb.Append(indentStr)
                .Append("[JsonPropertyName(\"")
                .Append(EscapeString(prop.Name))
                .AppendLine("\")]");
        }

        var accessors = options.PropertyAccess == PropertyAccess.Mutable ? "{ get; set; }" : "{ get; init; }";
        var requiredKeyword = options.IsRequired ? "required " : string.Empty;
        var initializer = string.Empty;

        if (options.IsDefaultInitialized && !mapped.IsNullable)
        {
            initializer = GetDefaultInitializer(mapped.Type);
        }

        sb.Append(indentStr)
            .Append("public ")
            .Append(requiredKeyword)
            .Append(mapped.Type)
            .Append(" ")
            .Append(csharpName)
            .Append(" ")
            .Append(accessors);

        if (!string.IsNullOrEmpty(initializer))
            sb.Append(" = ").Append(initializer).Append(";");

        sb.AppendLine();
    }

    private static string GetDefaultInitializer(string csharpType)
    {
        return csharpType switch
        {
            "string" => "string.Empty",
            "DateTime" => "default",
            "DateTime?" => "default",
            "bool" or "bool?" => "default",
            "int" or "int?" or "long" or "long?" or "double" or "double?" or "decimal" or "decimal?" => "default",
            var t when t.EndsWith("[]", StringComparison.Ordinal) => "[]",
            var t when t.StartsWith("List<", StringComparison.Ordinal) || t.StartsWith("IReadOnlyList<", StringComparison.Ordinal) => "[]",
            var t when t.StartsWith("Dictionary<", StringComparison.Ordinal) => "new()",
            var t when t.EndsWith("?", StringComparison.Ordinal) => string.Empty,
            _ => "new()"
        };
    }

    private sealed record TypeMapping(string Type, bool IsNullable);

    private static TypeMapping MapTsType(string tsType, bool optional, ArrayType arrayType)
    {
        var normalized = Regex.Replace(tsType, @"\s+", " ").Trim();
        var nullableByUnion = false;

        if (normalized.Contains('|'))
        {
            var parts = normalized.Split('|', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
            nullableByUnion = parts.Any(p => p.Equals("null", StringComparison.OrdinalIgnoreCase) ||
                                             p.Equals("undefined", StringComparison.OrdinalIgnoreCase));
            normalized = parts.FirstOrDefault(p => !p.Equals("null", StringComparison.OrdinalIgnoreCase) &&
                                                   !p.Equals("undefined", StringComparison.OrdinalIgnoreCase)) ?? "any";
        }

        var isNullable = optional || nullableByUnion;
        var mapped = normalized switch
        {
            "string" => "string",
            "number" => "double",
            "boolean" => "bool",
            "Date" => "DateTime",
            "any" or "unknown" or "object" => "object",
            _ => normalized
        };

        if (mapped.EndsWith("[]", StringComparison.Ordinal))
        {
            var inner = MapTsType(mapped[..^2], false, arrayType).Type;
            mapped = arrayType switch
            {
                ArrayType.IReadOnlyList => $"IReadOnlyList<{inner}>",
                ArrayType.List => $"List<{inner}>",
                ArrayType.Array => $"{inner}[]",
                _ => $"{inner}[]"
            };
        }
        else if (TryParseRecordType(mapped, out var valueType))
        {
            var mappedValueType = MapTsType(valueType, false, arrayType).Type;
            mapped = $"Dictionary<string, {mappedValueType}>";
        }
        else if (IsGenericType(mapped))
        {
            mapped = "object";
        }

        if ((isNullable || mapped == "object") && !mapped.EndsWith("?", StringComparison.Ordinal) && mapped != "string")
        {
            mapped += "?";
        }

        if (isNullable && mapped == "string")
            mapped += "?";

        mapped = NormalizeTypeIdentifier(mapped);

        return new TypeMapping(mapped, isNullable);
    }

    private static string NormalizeTypeIdentifier(string mapped)
    {
        var nullableSuffix = mapped.EndsWith("?", StringComparison.Ordinal) ? "?" : string.Empty;
        var core = nullableSuffix.Length == 0 ? mapped : mapped[..^1];

        if (core is "string" or "double" or "bool" or "object" or "DateTime")
            return mapped;

        if (SimpleIdentifierRegex().IsMatch(core))
            return core.ToPascalCase().EnsureValidPropertyName() + nullableSuffix;

        return mapped;
    }

    private static bool IsGenericType(string tsType)
        => tsType.Contains('<') && tsType.Contains('>');

    private static bool TryParseRecordType(string tsType, out string valueType)
    {
        var match = RecordTypeRegex().Match(tsType);
        if (!match.Success)
        {
            valueType = string.Empty;
            return false;
        }

        valueType = match.Groups["value"].Value.Trim();
        return true;
    }

    private static List<TsInterface> ParseInterfaces(string input)
    {
        var result = new List<TsInterface>();
        var matches = InterfaceStartRegex().Matches(input);

        foreach (Match match in matches)
        {
            var name = match.Groups["name"].Value;
            var bodyStart = match.Index + match.Length;
            var bodyEnd = FindMatchingBrace(input, bodyStart - 1);
            if (bodyEnd <= bodyStart)
                continue;

            var body = input[bodyStart..bodyEnd];
            var properties = ParseProperties(body);
            result.Add(new TsInterface(name, properties));
        }

        return result;
    }

    private static int FindMatchingBrace(string input, int openBraceIndex)
    {
        int depth = 0;
        for (int i = openBraceIndex; i < input.Length; i++)
        {
            if (input[i] == '{') depth++;
            if (input[i] == '}')
            {
                depth--;
                if (depth == 0) return i;
            }
        }
        return -1;
    }

    private static List<TsProperty> ParseProperties(string body)
    {
        var props = new List<TsProperty>();
        var matches = PropertyRegex().Matches(body);

        foreach (Match match in matches)
        {
            var rawName = match.Groups["name"].Value.Trim();
            rawName = rawName.Trim('"', '\'');
            var isOptional = match.Groups["optional"].Success;
            var type = match.Groups["type"].Value.Trim();
            props.Add(new TsProperty(rawName, type, isOptional));
        }

        return props;
    }

    private static string EscapeString(string value)
        => value.Replace("\\", "\\\\").Replace("\"", "\\\"");

    [GeneratedRegex(@"\binterface\s+(?<name>[A-Za-z_][A-Za-z0-9_]*)\s*\{", RegexOptions.Multiline)]
    private static partial Regex InterfaceStartRegex();

    [GeneratedRegex(@"^\s*(?:readonly\s+)?(?<name>['""][^'""]+['""]|[A-Za-z_$][A-Za-z0-9_$-]*)(?<optional>\?)?\s*:\s*(?<type>[^;]+);?\s*$", RegexOptions.Multiline)]
    private static partial Regex PropertyRegex();

    [GeneratedRegex(@"^Record\s*<\s*string\s*,\s*(?<value>.+)\s*>$", RegexOptions.IgnoreCase)]
    private static partial Regex RecordTypeRegex();

    [GeneratedRegex(@"^[A-Za-z_][A-Za-z0-9_]*$")]
    private static partial Regex SimpleIdentifierRegex();
}
