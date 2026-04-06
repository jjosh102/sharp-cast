
using System.Text.Json;

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
namespace SharpCast.ModelConverter;

public class JsonToCSharpConverter : IModelConverter<ConversionOptions>
{
    public bool TryConvert(string json, ConversionOptions options, out string csharpCode)

    {
        JsonDocument? innerDocument = null;
        try
        {
            using var document = JsonDocument.Parse(json);
            var root = document.RootElement;

            if (root.ValueKind == JsonValueKind.String)
            {
                var innerJson = root.GetString();
                if (string.IsNullOrWhiteSpace(innerJson))
                {
                    throw new InvalidOperationException("JSON string is empty. Cannot convert to C# POCO.");
                }

                innerDocument = JsonDocument.Parse(innerJson);
                root = innerDocument.RootElement;
            }

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

            csharpCode = BuildFromJson(root, options);
            return true;
        }
        catch (Exception ex)
        {
            csharpCode = $"Error converting JSON to C#: {ex.Message}";
            return false;
        }
        finally
        {
            innerDocument?.Dispose();
        }
    }

    private string BuildFromJson(JsonElement rootElement, ConversionOptions options)
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
        if (propertyValue.ValueKind == JsonValueKind.Object)
        {
            var nestedTypeName = propertyName.ToPascalCase();
            addNestedTypeAction(propertyValue, nestedTypeName, declarations, options);
            return nestedTypeName;
        }

        if (propertyValue.ValueKind == JsonValueKind.Array)
        {
            var elements = propertyValue.EnumerateArray().ToList();
            if (elements.Count > 0)
            {
                var nonNullElements = elements
                    .Where(e => e.ValueKind is not JsonValueKind.Null and not JsonValueKind.Undefined)
                    .ToList();

                if (nonNullElements.Count > 0 && nonNullElements.All(e => e.ValueKind == JsonValueKind.Object))
                {
                    var nestedTypeName = propertyName.ToPascalCase();
                    addNestedTypeAction(nonNullElements[0], nestedTypeName, declarations, options);
                    var elementType = elements.Count != nonNullElements.Count
                        ? MakeNullableType(nestedTypeName)
                        : nestedTypeName;
                    return FormatArrayType(elementType, options.ArrayType);
                }
            }
        }

        string propertyType = DeterminePropertyType(propertyValue, propertyName, options.ArrayType);
        return propertyType;
    }

    private string DeterminePropertyType(JsonElement value, string propertyName, ArrayType arrayType)
    {
        return value.ValueKind switch
        {
            JsonValueKind.Number => DetermineNumberType(value),
            JsonValueKind.String => DateTime.TryParse(value.GetString(), out _) ? "DateTime" : "string",
            JsonValueKind.True or JsonValueKind.False => "bool",
            JsonValueKind.Array => DetermineArrayType(value, propertyName, arrayType),
            JsonValueKind.Object => propertyName.ToPascalCase(),
            _ => "object"
        };
    }

    private static string DetermineNumberType(JsonElement value)
    {
        if (value.TryGetInt32(out _))
            return "int";

        if (value.TryGetInt64(out _))
            return "long";

        return "double";
    }

    private static string GetDefaultValue(string propertyType)
    {
        return propertyType switch
        {
            "string" => "string.Empty",
            "object" => "new()",
            "DateTime" => string.Empty,
            "int" or "long" or "double" or "bool" => string.Empty,
            var type when type.StartsWith("IReadOnlyList") || type.StartsWith("List") || type.EndsWith("[]") => "[]",
            var type when !type.Contains("?") => "new()",
            _ => string.Empty
        };
    }

    private string DetermineArrayType(JsonElement array, string propertyName, ArrayType arrayType)
    {
        var elements = array.EnumerateArray().ToList();
        var nonNullElements = elements
            .Where(e => e.ValueKind is not JsonValueKind.Null and not JsonValueKind.Undefined)
            .ToList();
        var hasNulls = nonNullElements.Count != elements.Count;

        if (nonNullElements.Count == 0)
        {
            var fallbackType = hasNulls ? "object?" : "object";
            return FormatArrayType(fallbackType, arrayType);
        }

        var elementTypes = new List<string>();
        foreach (var element in nonNullElements)
        {
            if (element.ValueKind == JsonValueKind.Object)
            {
                elementTypes.Add("object");
                continue;
            }

            elementTypes.Add(DeterminePropertyType(element, propertyName, arrayType));
        }

        var distinct = elementTypes.Distinct().ToList();
        string elementType;

        if (distinct.Count == 1)
        {
            elementType = distinct[0];
        }
        else if (AllNumeric(distinct))
        {
            elementType = PromoteNumeric(distinct);
        }
        else
        {
            elementType = "object";
        }

        if (hasNulls)
            elementType = MakeNullableType(elementType);

        return FormatArrayType(elementType, arrayType);
    }

    private static bool AllNumeric(IEnumerable<string> types)
        => types.All(t => t is "int" or "long" or "double");

    private static string PromoteNumeric(IReadOnlyList<string> types)
    {
        if (types.Contains("double"))
            return "double";
        if (types.Contains("long"))
            return "long";
        return "int";
    }

    private static string MakeNullableType(string typeName)
    {
        if (typeName.EndsWith("?", StringComparison.Ordinal))
            return typeName;

        return $"{typeName}?";
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
