using System.Text;
using System.Text.RegularExpressions;

namespace SharpCast.ModelConverter;

public sealed partial class TypeScriptToCSharpConverter : IModelConverter<ConversionOptions>
{
    private sealed record TsInterface(string Name, List<TsProperty> Properties, IReadOnlyList<string> TypeParameters);
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
        var typeParameters = iface.TypeParameters.Count > 0
            ? $"<{string.Join(", ", iface.TypeParameters)}>"
            : string.Empty;
        var indentStr = new string(' ', indent * 4);

        if (options.UseRecords && options.UsePrimaryConstructor)
        {
            sb.Append(indentStr).Append("public record ").Append(typeName).Append(typeParameters).AppendLine("(");
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
            sb.Append(indentStr).Append("public record ").Append(typeName).Append(typeParameters).AppendLine();
        else
            sb.Append(indentStr).Append("public class ").Append(typeName).Append(typeParameters).AppendLine();

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
        var normalized = NormalizedRegex().Replace(tsType, " ").Trim();
        normalized = StripReadonlyPrefix(normalized);
        var nullableByUnion = false;

        var unionParts = SplitTopLevel(normalized, '|');
        if (unionParts.Count > 1)
        {
            var nonNullParts = unionParts
                .Where(p => !IsNullish(p))
                .ToList();

            nullableByUnion = nonNullParts.Count != unionParts.Count;

            if (nonNullParts.Count == 0)
            {
                normalized = "any";
            }
            else if (nonNullParts.Count == 1)
            {
                normalized = nonNullParts[0];
            }
            else if (nonNullParts.All(IsStringLiteral))
            {
                normalized = "string";
            }
            else if (nonNullParts.All(IsBooleanLiteral))
            {
                normalized = "boolean";
            }
            else if (nonNullParts.All(IsNumberLiteral))
            {
                normalized = "number";
            }
            else
            {
                normalized = "object";
            }
        }

        normalized = StripReadonlyPrefix(normalized);
        if (IsStringLiteral(normalized))
            normalized = "string";
        if (IsBooleanLiteral(normalized))
            normalized = "boolean";
        if (IsNumberLiteral(normalized))
            normalized = "number";

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

        if (IsObjectLiteral(mapped))
            mapped = "object";

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
        else if (TryParseArrayGenericType(mapped, out var arrayValueType))
        {
            var mappedValueType = MapTsType(arrayValueType, false, arrayType).Type;
            mapped = arrayType switch
            {
                ArrayType.IReadOnlyList => $"IReadOnlyList<{mappedValueType}>",
                ArrayType.List => $"List<{mappedValueType}>",
                ArrayType.Array => $"{mappedValueType}[]",
                _ => $"{mappedValueType}[]"
            };
        }
        else if (TryParseRecordType(mapped, out var valueType))
        {
            var mappedValueType = MapTsType(valueType, false, arrayType).Type;
            mapped = $"Dictionary<string, {mappedValueType}>";
        }
        else if (TryParseTupleType(mapped, out var tupleElements))
        {
            if (tupleElements.Count == 1)
            {
                var elementType = MapTsType(tupleElements[0].Type, tupleElements[0].IsOptional, arrayType).Type;
                mapped = arrayType switch
                {
                    ArrayType.IReadOnlyList => $"IReadOnlyList<{elementType}>",
                    ArrayType.List => $"List<{elementType}>",
                    ArrayType.Array => $"{elementType}[]",
                    _ => $"{elementType}[]"
                };
            }
            else
            {
                var mappedElements = tupleElements
                    .Select(element => MapTsType(element.Type, element.IsOptional, arrayType).Type)
                    .ToList();
                mapped = $"({string.Join(", ", mappedElements)})";
            }
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

    private static bool TryParseArrayGenericType(string tsType, out string valueType)
    {
        var match = ArrayTypeRegex().Match(tsType);
        if (!match.Success)
        {
            valueType = string.Empty;
            return false;
        }

        valueType = match.Groups["value"].Value.Trim();
        return true;
    }

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

    private sealed record TupleElement(string Type, bool IsOptional);

    private static bool TryParseTupleType(string tsType, out List<TupleElement> elements)
    {
        elements = [];
        var trimmed = tsType.Trim();
        if (trimmed.StartsWith("readonly ", StringComparison.OrdinalIgnoreCase))
            trimmed = trimmed[9..].TrimStart();

        if (!trimmed.StartsWith("[", StringComparison.Ordinal) || !trimmed.EndsWith("]", StringComparison.Ordinal))
            return false;

        var inner = trimmed[1..^1].Trim();
        if (inner.Length == 0)
            return true;

        var parts = SplitTopLevel(inner, ',');
        foreach (var raw in parts)
        {
            var part = raw.Trim();
            if (part.Length == 0)
                continue;

            var typePart = StripTupleElementLabel(part);
            var isOptional = typePart.EndsWith("?", StringComparison.Ordinal);
            if (isOptional)
                typePart = typePart[..^1].TrimEnd();

            elements.Add(new TupleElement(typePart, isOptional));
        }

        return true;
    }

    private static string StripTupleElementLabel(string element)
    {
        var depth = 0;
        for (int i = 0; i < element.Length; i++)
        {
            var ch = element[i];
            switch (ch)
            {
                case '<':
                case '(':
                case '[':
                    depth++;
                    break;
                case '>':
                case ')':
                case ']':
                    depth = Math.Max(0, depth - 1);
                    break;
                case ':' when depth == 0:
                    return element[(i + 1)..].Trim();
            }
        }

        return element.Trim();
    }

    private static List<string> SplitTopLevel(string text, char separator)
    {
        var parts = new List<string>();
        var depth = 0;
        var start = 0;

        for (int i = 0; i < text.Length; i++)
        {
            var ch = text[i];
            switch (ch)
            {
                case '<':
                case '(':
                case '[':
                case '{':
                    depth++;
                    break;
                case '>':
                case ')':
                case ']':
                case '}':
                    depth = Math.Max(0, depth - 1);
                    break;
            }

            if (ch == separator && depth == 0)
            {
                parts.Add(text[start..i].Trim());
                start = i + 1;
            }
        }

        parts.Add(text[start..].Trim());
        return parts;
    }

    private static List<TsInterface> ParseInterfaces(string input)
    {
        var result = new List<TsInterface>();
        var matches = InterfaceStartRegex().Matches(input);

        foreach (Match match in matches)
        {
            var name = match.Groups["name"].Value;
            var typeParameters = ParseTypeParameters(match.Groups["generics"].Value);
            var bodyStart = match.Index + match.Length;
            var bodyEnd = FindMatchingBrace(input, bodyStart - 1);
            if (bodyEnd <= bodyStart)
                continue;

            var body = input[bodyStart..bodyEnd];
            var properties = ParseProperties(body);
            result.Add(new TsInterface(name, properties, typeParameters));
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
        foreach (var segment in SplitPropertySegments(body))
        {
            var match = PropertyRegex().Match(segment);
            if (!match.Success)
                continue;

            var rawName = match.Groups["name"].Value.Trim();
            rawName = rawName.Trim('"', '\'');
            var isOptional = match.Groups["optional"].Success;
            var type = match.Groups["type"].Value.Trim();
            props.Add(new TsProperty(rawName, type, isOptional));
        }

        return props;
    }

    private static IEnumerable<string> SplitPropertySegments(string body)
    {
        var parts = new List<string>();
        var depth = 0;
        var start = 0;
        var seenColon = false;

        for (int i = 0; i < body.Length; i++)
        {
            var ch = body[i];
            switch (ch)
            {
                case '<':
                case '(':
                case '[':
                case '{':
                    depth++;
                    break;
                case '>':
                case ')':
                case ']':
                case '}':
                    depth = Math.Max(0, depth - 1);
                    break;
                case ':' when depth == 0:
                    seenColon = true;
                    break;
            }

            if (depth == 0 && ch == ';')
            {
                parts.Add(body[start..i]);
                start = i + 1;
                seenColon = false;
            }
            else if (depth == 0 && ch == '\n' && seenColon)
            {
                var next = i + 1;
                while (next < body.Length && char.IsWhiteSpace(body[next]))
                    next++;

                if (next < body.Length && body[next] != '|' && body[next] != '&')
                {
                    parts.Add(body[start..i]);
                    start = i + 1;
                    seenColon = false;
                }
            }
        }

        if (start < body.Length)
            parts.Add(body[start..]);

        foreach (var part in parts)
        {
            var trimmed = part.Trim();
            if (string.IsNullOrEmpty(trimmed))
                continue;

            if (trimmed.EndsWith(",", StringComparison.Ordinal))
                trimmed = trimmed[..^1].TrimEnd();

            if (!string.IsNullOrEmpty(trimmed))
                yield return trimmed;
        }
    }

    private static string EscapeString(string value)
        => value.Replace("\\", "\\\\").Replace("\"", "\\\"");

    private static IReadOnlyList<string> ParseTypeParameters(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
            return [];

        var trimmed = raw.Trim();
        if (trimmed.StartsWith("<", StringComparison.Ordinal) && trimmed.EndsWith(">", StringComparison.Ordinal))
            trimmed = trimmed[1..^1];

        var parts = SplitTopLevel(trimmed, ',');
        var result = new List<string>();

        foreach (var part in parts)
        {
            var token = part.Trim();
            if (token.Length == 0)
                continue;

            var extendsIndex = token.IndexOf("extends", StringComparison.OrdinalIgnoreCase);
            if (extendsIndex >= 0)
                token = token[..extendsIndex].Trim();

            var defaultIndex = token.IndexOf('=', StringComparison.Ordinal);
            if (defaultIndex >= 0)
                token = token[..defaultIndex].Trim();

            if (token.Length > 0)
                result.Add(token);
        }

        return result;
    }

    private static bool IsNullish(string value)
        => value.Equals("null", StringComparison.OrdinalIgnoreCase) ||
           value.Equals("undefined", StringComparison.OrdinalIgnoreCase);

    private static bool IsStringLiteral(string value)
        => (value.Length >= 2 &&
            ((value.StartsWith("'", StringComparison.Ordinal) && value.EndsWith("'", StringComparison.Ordinal)) ||
             (value.StartsWith("\"", StringComparison.Ordinal) && value.EndsWith("\"", StringComparison.Ordinal))));

    private static bool IsBooleanLiteral(string value)
        => value.Equals("true", StringComparison.OrdinalIgnoreCase) ||
           value.Equals("false", StringComparison.OrdinalIgnoreCase);

    private static bool IsNumberLiteral(string value)
        => double.TryParse(value, out _);

    private static bool IsObjectLiteral(string value)
        => value.StartsWith("{", StringComparison.Ordinal) && value.EndsWith("}", StringComparison.Ordinal);

    private static string StripReadonlyPrefix(string value)
        => value.StartsWith("readonly ", StringComparison.OrdinalIgnoreCase)
            ? value[9..].TrimStart()
            : value;

    [GeneratedRegex(@"\binterface\s+(?<name>[A-Za-z_][A-Za-z0-9_]*)\s*(?<generics><[^>{}]+>)?\s*(?:extends\s+[^{}]+)?\{", RegexOptions.Multiline)]
    private static partial Regex InterfaceStartRegex();

    [GeneratedRegex(@"^\s*(?:readonly\s+)?(?<name>['""][^'""]+['""]|[A-Za-z_$][A-Za-z0-9_$-]*)(?<optional>\?)?\s*:\s*(?<type>.+)\s*$", RegexOptions.Singleline)]
    private static partial Regex PropertyRegex();

    [GeneratedRegex(@"^Record\s*<\s*string\s*,\s*(?<value>.+)\s*>$", RegexOptions.IgnoreCase)]
    private static partial Regex RecordTypeRegex();

    [GeneratedRegex(@"^(?:ReadonlyArray|Array)\s*<\s*(?<value>.+)\s*>$", RegexOptions.IgnoreCase)]
    private static partial Regex ArrayTypeRegex();

    [GeneratedRegex(@"^[A-Za-z_][A-Za-z0-9_]*$")]
    private static partial Regex SimpleIdentifierRegex();

    [GeneratedRegex(@"\s+")]
    private static partial Regex NormalizedRegex();
}
