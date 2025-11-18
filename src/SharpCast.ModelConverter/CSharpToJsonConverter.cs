using System.Text.Json;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace SharpCast.ModelConverter;

public sealed class CSharpToJsonConverter : IModelConverter<JsonSerializerOptions>
{
    public bool TryConvert(string csharpCode, JsonSerializerOptions jsonOptions, out string json)
    {
        try
        {
            var tree = CSharpSyntaxTree.ParseText(csharpCode);
            var root = tree.GetRoot();

            var obj = root.DescendantNodes().OfType<ObjectCreationExpressionSyntax>().FirstOrDefault();
            if (obj != null && obj.Initializer != null)
            {
                json = ConvertObjectInitializer(obj, jsonOptions);
                return true;
            }

            json = ConvertTypeSchemas(root, jsonOptions);
            return true;
        }
        catch (Exception ex)
        {
            json = $"Error converting C# to JSON: {ex.Message}";
            return false;
        }
    }

    private string ConvertTypeSchemas(SyntaxNode root, JsonSerializerOptions jsonOptions)
    {
        var types = root.DescendantNodes()
            .Where(n =>
                n is ClassDeclarationSyntax ||
                n is RecordDeclarationSyntax ||
                n is StructDeclarationSyntax)
            .Cast<TypeDeclarationSyntax>();

        var result = new SortedDictionary<string, object?>();

        foreach (var t in types)
        {
            var props = new SortedDictionary<string, object?>();

            foreach (var p in t.Members.OfType<PropertyDeclarationSyntax>())
            {
                props[p.Identifier.Text] = SampleValue(p.Type);
            }

            if (t is RecordDeclarationSyntax r && r.ParameterList != null)
            {
                foreach (var p in r.ParameterList.Parameters)
                {
                    props[p.Identifier.Text] = SampleValue(p.Type);
                }
            }

            result[t.Identifier.Text] = props;
        }

        return JsonSerializer.Serialize(result, jsonOptions);
    }

    private string ConvertObjectInitializer(ObjectCreationExpressionSyntax obj, JsonSerializerOptions jsonOptions)
    {
        var dict = new SortedDictionary<string, object?>();

        foreach (var a in obj.Initializer!.Expressions.OfType<AssignmentExpressionSyntax>())
        {
            dict[a.Left.ToString()] = Literal(a.Right);
        }

        return JsonSerializer.Serialize(dict, jsonOptions);
    }

    private object? Literal(ExpressionSyntax e)
    {
        return e switch
        {
            LiteralExpressionSyntax lit => lit.Kind() switch
            {
                SyntaxKind.StringLiteralExpression => lit.Token.ValueText,
                SyntaxKind.NumericLiteralExpression => lit.Token.Value,
                SyntaxKind.TrueLiteralExpression => true,
                SyntaxKind.FalseLiteralExpression => false,
                _ => throw new InvalidOperationException("Unsupported literal")
            },

            PrefixUnaryExpressionSyntax u when u.Operand is LiteralExpressionSyntax lit =>
                lit.Token.Value is int i ? -i :
                lit.Token.Value is double d ? -d :
                throw new InvalidOperationException("Unsupported unary literal"),

            _ => throw new InvalidOperationException("Only pure literals allowed in object initializer")
        };
    }

    private static object? SampleValue(TypeSyntax? type)
    {
        var t = type?.ToString();

        return t switch
        {
            "string" => "",
            "bool" => false,
            "int" or "long" or "float" or "double" or "decimal" => 0,
            "DateTime" => "0001-01-01T00:00:00Z",
            _ when t is not null && t.EndsWith("[]") => Array.Empty<object>(),
            _ when t is not null && (t.StartsWith("List<") || t.StartsWith("IReadOnlyList<")) => Array.Empty<object>(),
            _ => null
        };
    }
}
