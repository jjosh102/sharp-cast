using System.Text.Json;

using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
namespace SharpCast.ModelConverter;

public class CSharpToJsonConverter : IModelConverter<JsonSerializerOptions>
{
    public ModelConverterType Type => ModelConverterType.CSharpToJson;

    public bool TryConvert(string csharpCode, JsonSerializerOptions jsonOptions, out string json)
    {
        try
        {
            json = ConvertCsharpObjectStringToJson(csharpCode, jsonOptions);
            return true;
        }
        catch (InvalidOperationException)
        {
            json = ConvertCsharpSourceToJson(csharpCode, jsonOptions);
            return true;
        }
        catch (Exception ex)
        {
            json = $"Error converting C# to JSON: {ex.Message}";
            return false;
        }
    }

    private string ConvertCsharpSourceToJson(string csharpCode, JsonSerializerOptions jsonOptions)
    {
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

        return JsonSerializer.Serialize(jsonSchema, jsonOptions);
    }

    private string ConvertCsharpObjectStringToJson(string csharpCode, JsonSerializerOptions jsonOptions)
    {
        var tree = CSharpSyntaxTree.ParseText(csharpCode);
        var root = tree.GetRoot();
        var objectCreation = root.DescendantNodes().OfType<ObjectCreationExpressionSyntax>().FirstOrDefault()
            ?? throw new InvalidOperationException("No object initializer found in the provided code.");

        var jsonMap = new Dictionary<string, object?>();
        foreach (var initializer in objectCreation.Initializer?.Expressions.OfType<AssignmentExpressionSyntax>() ?? Enumerable.Empty<AssignmentExpressionSyntax>())
        {
            var name = initializer.Left.ToString();
            jsonMap[name] = ParseLiteralExpression(initializer.Right);
        }
        return JsonSerializer.Serialize(jsonMap, jsonOptions);
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
            var t when t.StartsWith("IReadOnlyList") || t.StartsWith("List") || t.EndsWith("[]") => Array.Empty<object>(),
            _ => null
        };
    }
}
