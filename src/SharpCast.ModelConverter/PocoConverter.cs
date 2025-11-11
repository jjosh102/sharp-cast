using System.Text.Json;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
namespace SharpCast.ModelConverter;
public class PocoConverter
{

    public bool TryConvertJsonToCSharp(string json, ConversionOptions options, out string result)
    {
        try
        {
            using var document = JsonDocument.Parse(json);
            var root = document.RootElement;

            if (root.ValueKind == JsonValueKind.Array)
            {
                if (root.GetArrayLength() == 0)
                    throw new InvalidOperationException("JSON array is empty. Cannot convert to C# POCO.");

                root = root[0];

                if (root.ValueKind != JsonValueKind.Object)
                    throw new InvalidOperationException("First element in JSON array must be an object.");
            }
            else if (root.ValueKind != JsonValueKind.Object)
            {
                throw new InvalidOperationException("JSON root must be an object or array of objects.");
            }

            result = BuildFromJson(root, options);
            return true;
        }
        catch (Exception ex)
        {
            result = $"Error converting JSON to C#: {ex.Message}";
            return false;
        }
    }

    public bool TryConvertCSharpToJson(string csharpCode, bool indented, out string result)
    {
        try
        {
            // Try object initializer first
            result = ConvertCsharpObjectStringToJson(csharpCode, indented);
            return true;
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("No object initializer found"))
        {
            // Fallback: treat as POCO class source
            result = ConvertCsharpSourceToJson(csharpCode, indented);
            return true;
        }
        catch (Exception ex)
        {
            result = $"Error converting C# to JSON: {ex.Message}";
            return false;
        }
    }
    public bool TryConvertCSharpToTypeScript(string csharpCode, out string tsCode, string rootName = "Root", int indent = 2)
    {
        try
        {
            var tree = CSharpSyntaxTree.ParseText(csharpCode);
            var root = tree.GetRoot();

            // Detect object initializer
            var objectCreation = root.DescendantNodes()
                .OfType<ObjectCreationExpressionSyntax>()
                .FirstOrDefault();

            if (objectCreation != null)
            {
                // It's an object initializer → produce TypeScript object literal
                tsCode = ConvertCSharpObjectToTypeScript(csharpCode, indent);
            }
            else
            {
                // Otherwise treat as class definition → produce TypeScript interface
                tsCode = ConvertCSharpToTypeScript(csharpCode, rootName, indent);
            }

            return true;
        }
        catch (Exception ex)
        {
            tsCode = $"Error converting C# to TypeScript: {ex.Message}";
            return false;
        }
    }



    public string BuildFromJson(JsonElement rootElement, ConversionOptions options)
    {
        var declarations = new List<MemberDeclarationSyntax>();
        AddTypeFromJson(rootElement, options.RootTypeName, declarations, options);

        BaseNamespaceDeclarationSyntax namespaceDeclaration = options.UseFileScoped
            ? SyntaxFactory.FileScopedNamespaceDeclaration(SyntaxFactory.ParseName(options.Namespace))
            : SyntaxFactory.NamespaceDeclaration(SyntaxFactory.ParseName(options.Namespace))
                .WithOpenBraceToken(SyntaxFactory.Token(SyntaxKind.OpenBraceToken))
                .WithCloseBraceToken(SyntaxFactory.Token(SyntaxKind.CloseBraceToken));

        namespaceDeclaration = namespaceDeclaration.AddMembers([.. declarations]);

        var compilationUnit = SyntaxFactory.CompilationUnit()
            .AddMembers(namespaceDeclaration);

        if (options.AddAttribute)
        {
            compilationUnit = compilationUnit.AddUsings(
                SyntaxFactory.UsingDirective(SyntaxFactory.ParseName("System.Text.Json.Serialization")));
        }

        return compilationUnit.NormalizeWhitespace().ToFullString();
    }

    public string ConvertCsharpSourceToJson(string csharpCode, bool indented = true)
    {
        if (string.IsNullOrWhiteSpace(csharpCode))
            throw new ArgumentException("C# source cannot be null or empty.", nameof(csharpCode));

        var tree = CSharpSyntaxTree.ParseText(csharpCode);
        var root = tree.GetRoot();

        var classNodes = root.DescendantNodes().OfType<ClassDeclarationSyntax>();
        var jsonSchema = new Dictionary<string, object?>();

        foreach (var cls in classNodes)
        {
            var props = new Dictionary<string, object?>();
            foreach (var prop in cls.Members.OfType<PropertyDeclarationSyntax>())
            {
                var name = prop.Identifier.Text;
                var typeName = prop.Type.ToString();
                props[name] = GetSampleValueForType(typeName);
            }

            jsonSchema[cls.Identifier.Text] = props;
        }

        var options = new JsonSerializerOptions { WriteIndented = indented };
        return JsonSerializer.Serialize(jsonSchema, options);
    }


    public string ConvertCsharpObjectStringToJson(string csharpCode, bool indented = true)
    {
        if (string.IsNullOrWhiteSpace(csharpCode))
            throw new ArgumentException("C# object string cannot be null or empty.", nameof(csharpCode));

        var tree = CSharpSyntaxTree.ParseText(csharpCode);
        var root = tree.GetRoot();

        var objectCreation = root.DescendantNodes().OfType<ObjectCreationExpressionSyntax>().FirstOrDefault()
            ?? throw new InvalidOperationException("No object initializer found in the provided code.");

        var jsonMap = new Dictionary<string, object?>();

        foreach (var initializer in objectCreation.Initializer?.Expressions.OfType<AssignmentExpressionSyntax>() ?? [])
        {
            var name = initializer.Left.ToString();
            var valueSyntax = initializer.Right;
            jsonMap[name] = ParseLiteralExpression(valueSyntax);
        }

        var options = new JsonSerializerOptions { WriteIndented = indented };
        return JsonSerializer.Serialize(jsonMap, options);
    }

    private object? ParseLiteralExpression(ExpressionSyntax valueSyntax)
    {
        return valueSyntax switch
        {
            LiteralExpressionSyntax literal => literal.Kind() switch
            {
                SyntaxKind.StringLiteralExpression => literal.Token.ValueText,
                SyntaxKind.NumericLiteralExpression => literal.Token.Value,
                SyntaxKind.TrueLiteralExpression => true,
                SyntaxKind.FalseLiteralExpression => false,
                _ => literal.Token.ValueText
            },
            _ => valueSyntax.ToString()
        };
    }


    private object? GetSampleValueForType(string type)
    {
        return type switch
        {
            "string" => "",
            "int" or "double" or "float" or "decimal" => 0,
            "bool" => false,
            "DateTime" => DateTime.Now,
            var t when t.StartsWith("IReadOnlyList") || t.StartsWith("List") || t.EndsWith("[]") => new object[0],
            _ => null
        };
    }

    public string ConvertCSharpToTypeScript(string csharpCode, string rootName = "Root", int indent = 2)
    {
        var tree = CSharpSyntaxTree.ParseText(csharpCode);
        var root = tree.GetRoot();

        var classNodes = root.DescendantNodes().OfType<ClassDeclarationSyntax>();
        var tsInterfaces = new List<string>();

        foreach (var cls in classNodes)
        {
            var lines = new List<string>();
            var interfaceName = cls.Identifier.Text;
            lines.Add($"export interface {interfaceName} {{");

            foreach (var prop in cls.Members.OfType<PropertyDeclarationSyntax>())
            {
                var tsType = MapCSharpTypeToTypeScript(prop.Type.ToString());
                lines.Add(new string(' ', indent) + $"{prop.Identifier.Text}: {tsType};");
            }

            lines.Add("}");
            tsInterfaces.Add(string.Join("\n", lines));
        }

        return string.Join("\n\n", tsInterfaces);
    }


    public string ConvertCSharpObjectToTypeScript(string csharpCode, int indent = 2)
    {
        var tree = CSharpSyntaxTree.ParseText(csharpCode);
        var root = tree.GetRoot();

        var objectCreation = root.DescendantNodes()
            .OfType<ObjectCreationExpressionSyntax>()
            .FirstOrDefault();

        if (objectCreation == null)
            throw new InvalidOperationException("No object initializer found in the provided code.");

        var tsLines = new List<string>();
        tsLines.Add("{");

        foreach (var assign in objectCreation.Initializer?.Expressions.OfType<AssignmentExpressionSyntax>() ?? Enumerable.Empty<AssignmentExpressionSyntax>())
        {
            var name = assign.Left.ToString();
            var valueSyntax = assign.Right;
            var value = MapExpressionToTypeScript(valueSyntax);
            tsLines.Add(new string(' ', indent) + $"{name}: {value},");
        }

        tsLines.Add("}");
        return string.Join("\n", tsLines);
    }


    private string MapCSharpTypeToTypeScript(string csharpType)
    {
        return csharpType switch
        {
            "string" => "string",
            "int" or "double" or "float" or "decimal" => "number",
            "bool" => "boolean",
            "DateTime" => "Date",
            var t when t.EndsWith("[]") => MapCSharpTypeToTypeScript(t.Replace("[]", "")) + "[]",
            var t when t.StartsWith("IReadOnlyList") || t.StartsWith("List") => MapCSharpTypeToTypeScript(t.Substring(t.IndexOf("<") + 1, t.IndexOf(">") - t.IndexOf("<") - 1)) + "[]",
            _ => "any"
        };
    }

    private string MapExpressionToTypeScript(ExpressionSyntax expr)
    {
        return expr switch
        {
            LiteralExpressionSyntax literal => literal.Kind() switch
            {
                SyntaxKind.StringLiteralExpression => $"\"{literal.Token.ValueText}\"",
                SyntaxKind.NumericLiteralExpression => literal.Token.ValueText,
                SyntaxKind.TrueLiteralExpression => "true",
                SyntaxKind.FalseLiteralExpression => "false",
                _ => literal.Token.ValueText
            },
            _ => expr.ToString()
        };
    }

    private void AddTypeFromJson(JsonElement jsonObject,
       string typeName,
       List<MemberDeclarationSyntax> declarations,
       ConversionOptions options)
    {
        typeName = typeName.EnsureValidPropertyName();

        MemberDeclarationSyntax typeDeclaration;

        if (!options.UseRecords)
        {
            var classDeclaration = SyntaxFactory.ClassDeclaration(typeName)
                .AddModifiers(SyntaxFactory.Token(SyntaxKind.PublicKeyword));

            var members = CreatePropertiesFromJson(jsonObject, declarations, options);
            classDeclaration = classDeclaration.AddMembers([.. members]);

            typeDeclaration = classDeclaration;
        }
        else
        {
            var recordDeclaration = SyntaxFactory.RecordDeclaration(SyntaxFactory.Token(SyntaxKind.RecordKeyword), typeName)
                .AddModifiers(SyntaxFactory.Token(SyntaxKind.PublicKeyword));

            if (options.UsePrimaryConstructor)
            {
                var parameters = CreateParametersFromJson(jsonObject, declarations, options);
                recordDeclaration = recordDeclaration
                    .AddParameterListParameters([.. parameters])
                    .WithSemicolonToken(SyntaxFactory.Token(SyntaxKind.SemicolonToken));
            }
            else
            {
                var members = CreatePropertiesFromJson(jsonObject, declarations, options);
                recordDeclaration = recordDeclaration
                    .WithOpenBraceToken(SyntaxFactory.Token(SyntaxKind.OpenBraceToken))
                    .AddMembers([.. members])
                    .WithCloseBraceToken(SyntaxFactory.Token(SyntaxKind.CloseBraceToken));
            }

            typeDeclaration = recordDeclaration;
        }

        declarations.Add(typeDeclaration);
    }

    private string HandlePropertyType(JsonElement propertyValue,
        string propertyName,
        List<MemberDeclarationSyntax> declarations,
        Action<JsonElement, string, List<MemberDeclarationSyntax>, ConversionOptions> addNestedTypeAction,
        ConversionOptions options)
    {
        string propertyType = DeterminePropertyType(propertyValue, propertyName, options.ArrayType);

        if (propertyValue.ValueKind == JsonValueKind.Object)
        {
            var nestedTypeName = propertyName.ToPascalCase();
            addNestedTypeAction(propertyValue, nestedTypeName, declarations, options);
            return nestedTypeName;
        }

        if (propertyValue.ValueKind == JsonValueKind.Array &&
            propertyValue.EnumerateArray().Any() &&
            propertyValue[0].ValueKind == JsonValueKind.Object)
        {
            var nestedTypeName = propertyName.ToPascalCase();
            addNestedTypeAction(propertyValue[0], nestedTypeName, declarations, options);
            return FormatArrayType(nestedTypeName, options.ArrayType);
        }

        return propertyType;
    }

    private string DeterminePropertyType(JsonElement value, string propertyName, ArrayType arrayType)
    {
        return value.ValueKind switch
        {
            JsonValueKind.Number => value.TryGetInt32(out _) ? "int" : "double",
            JsonValueKind.String => DateTime.TryParse(value.GetString(), out _) ? "DateTime" : "string",
            JsonValueKind.True or JsonValueKind.False => "bool",
            JsonValueKind.Array => DetermineArrayType(value, propertyName, arrayType),
            JsonValueKind.Object => propertyName.ToPascalCase(),
            _ => "object"
        };
    }

    private string GetDefaultValue(string propertyType)
    {
        return propertyType switch
        {
            "string" => "string.Empty",
            "object" => "new()",
            "DateTime" => string.Empty,
            "int" or "double" or "bool" => string.Empty,
            var type when type.StartsWith("IReadOnlyList") || type.StartsWith("List") || type.EndsWith("[]") => "[]",
            var type when !type.Contains("?") => "new()",
            _ => string.Empty
        };
    }

    private string DetermineArrayType(JsonElement array, string propertyName, ArrayType arrayType)
    {
        string elementType;

        if (!array.EnumerateArray().Any())
        {
            elementType = "object";
        }
        else
        {
            var elementTypes = array.EnumerateArray()
                .Select(element => DeterminePropertyType(element, propertyName, arrayType))
                .Distinct()
                .ToList();

            elementType = elementTypes.Count == 1 ? elementTypes.First() : "object";
        }

        return FormatArrayType(elementType, arrayType);
    }

    private string FormatArrayType(string elementType, ArrayType arrayType)
    {
        return arrayType switch
        {
            ArrayType.IReadOnlyList => $"IReadOnlyList<{elementType}>",
            ArrayType.List => $"List<{elementType}>",
            ArrayType.Array => $"{elementType}[]",
            _ => throw new ArgumentOutOfRangeException(nameof(arrayType), arrayType, null)
        };
    }

    private PropertyDeclarationSyntax GenerateClassProperty(string propertyName, string propertyType, ConversionOptions options)
    {
        if (options.IsNullable && !options.IsDefaultInitialized)
        {
            propertyType += "?";
        }

        var accessors = GenerateAccessors(options);

        var propertyDeclaration = SyntaxFactory.PropertyDeclaration(
                SyntaxFactory.ParseTypeName(propertyType),
                SyntaxFactory.Identifier(propertyName.ToPascalCase()))
            .AddModifiers(SyntaxFactory.Token(SyntaxKind.PublicKeyword));

        if (options.IsRequired)
        {
            propertyDeclaration = propertyDeclaration.AddModifiers(SyntaxFactory.Token(SyntaxKind.RequiredKeyword));
        }

        propertyDeclaration = propertyDeclaration.AddAccessorListAccessors(accessors);

        if (options.IsDefaultInitialized && !options.IsNullable)
        {
            var defaultValue = GetDefaultValue(propertyType);
            if (!string.IsNullOrEmpty(defaultValue))
            {
                propertyDeclaration = propertyDeclaration.WithInitializer(
                    SyntaxFactory.EqualsValueClause(SyntaxFactory.ParseExpression(defaultValue)))
                    .WithSemicolonToken(SyntaxFactory.Token(SyntaxKind.SemicolonToken));
            }
        }

        if (options.AddAttribute)
        {
            var attribute = CreateJsonPropertyNameAttribute(propertyName);
            return propertyDeclaration.AddAttributeLists(
                SyntaxFactory.AttributeList(SyntaxFactory.SingletonSeparatedList(attribute)));
        }

        return propertyDeclaration;
    }

    private AccessorDeclarationSyntax[] GenerateAccessors(ConversionOptions options)
    {
        return options.PropertyAccess switch
        {
            PropertyAccess.Mutable =>
            [
                SyntaxFactory.AccessorDeclaration(SyntaxKind.GetAccessorDeclaration).WithSemicolonToken(SyntaxFactory.Token(SyntaxKind.SemicolonToken)),
                SyntaxFactory.AccessorDeclaration(SyntaxKind.SetAccessorDeclaration).WithSemicolonToken(SyntaxFactory.Token(SyntaxKind.SemicolonToken))
            ],
            PropertyAccess.Immutable =>
            [
                SyntaxFactory.AccessorDeclaration(SyntaxKind.GetAccessorDeclaration).WithSemicolonToken(SyntaxFactory.Token(SyntaxKind.SemicolonToken)),
                SyntaxFactory.AccessorDeclaration(SyntaxKind.InitAccessorDeclaration).WithSemicolonToken(SyntaxFactory.Token(SyntaxKind.SemicolonToken))
            ],
            _ => []
        };
    }

    private AttributeSyntax CreateJsonPropertyNameAttribute(string propertyName)
    {
        var argument = SyntaxFactory.AttributeArgument(
            SyntaxFactory.LiteralExpression(SyntaxKind.StringLiteralExpression, SyntaxFactory.Literal(propertyName.RemoveSpecialCharacters())));

        return SyntaxFactory.Attribute(SyntaxFactory.ParseName("JsonPropertyName")).AddArgumentListArguments(argument);
    }

    private ParameterSyntax GenerateRecordParameter(string propertyName, string propertyType, ConversionOptions options)
    {
        if (options.IsNullable)
        {
            propertyType += "?";
        }

        var parameterDeclaration = SyntaxFactory.Parameter(
                SyntaxFactory.Identifier(propertyName.ToPascalCase()))
            .WithType(SyntaxFactory.ParseTypeName(propertyType));

        if (!options.AddAttribute)
            return parameterDeclaration;

        var attribute = SyntaxFactory.Attribute(
                   SyntaxFactory.IdentifierName("property: JsonPropertyName"))
               .AddArgumentListArguments(
                   SyntaxFactory.AttributeArgument(
                       SyntaxFactory.LiteralExpression(
                           SyntaxKind.StringLiteralExpression,
                           SyntaxFactory.Literal(propertyName.RemoveSpecialCharacters()))));

        var attributeList = SyntaxFactory.AttributeList(
            SyntaxFactory.SingletonSeparatedList(attribute));

        return parameterDeclaration.AddAttributeLists(attributeList);
    }

    private List<ParameterSyntax> CreateParametersFromJson(JsonElement jsonObject,
        List<MemberDeclarationSyntax> declarations, ConversionOptions options)
    {
        var parameters = new List<ParameterSyntax>();

        foreach (var property in jsonObject.EnumerateObject())
        {
            var propertyType = HandlePropertyType(property.Value, property.Name, declarations, AddTypeFromJson, options);
            var parameter = GenerateRecordParameter(property.Name, propertyType, options);
            parameters.Add(parameter);
        }

        return parameters;
    }

    private List<MemberDeclarationSyntax> CreatePropertiesFromJson(JsonElement jsonObject,
        List<MemberDeclarationSyntax> declarations, ConversionOptions options)
    {
        var properties = new List<MemberDeclarationSyntax>();

        foreach (var property in jsonObject.EnumerateObject())
        {
            var propertyType = HandlePropertyType(property.Value, property.Name, declarations, AddTypeFromJson, options);
            var propertyDeclaration = GenerateClassProperty(property.Name, propertyType, options);
            properties.Add(propertyDeclaration);
        }

        return properties;
    }
}
