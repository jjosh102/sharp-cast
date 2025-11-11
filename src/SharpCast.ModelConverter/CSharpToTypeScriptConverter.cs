
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
namespace SharpCast.ModelConverter;

public class CSharpToTypeScriptConverter : IModelConverter

{
    private readonly string _rootName;
    private readonly int _indent;

    public CSharpToTypeScriptConverter(string rootName = "Root", int indent = 2)
    {
        _rootName = rootName;
        _indent = indent;
    }

    public bool TryConvert(string csharpCode, out string tsCode)
    {
        try
        {
            var tree = CSharpSyntaxTree.ParseText(csharpCode);
            var root = tree.GetRoot();

            var objectCreation = root.DescendantNodes().OfType<ObjectCreationExpressionSyntax>().FirstOrDefault();

            if (objectCreation != null)
            {
                tsCode = ConvertCSharpObjectToTypeScript(csharpCode);
            }
            else
            {
                tsCode = ConvertCSharpToTypeScriptInterface(csharpCode);
            }

            return true;
        }
        catch (Exception ex)
        {
            tsCode = $"Error converting C# to TypeScript: {ex.Message}";
            return false;
        }
    }

    private string ConvertCSharpToTypeScriptInterface(string csharpCode)
    {
        var tree = CSharpSyntaxTree.ParseText(csharpCode);
        var root = tree.GetRoot();

        var classNodes = root.DescendantNodes().OfType<ClassDeclarationSyntax>();
        var sb = new System.Text.StringBuilder();

        foreach (var cls in classNodes)
        {
            sb.AppendLine($"export interface {cls.Identifier.Text} {{");

            foreach (var prop in cls.Members.OfType<PropertyDeclarationSyntax>())
            {
                var tsType = MapCSharpTypeToTypeScript(prop.Type.ToString());
                sb.Append(' ', _indent);
                sb.AppendLine($"{prop.Identifier.Text}: {tsType};");
            }

            sb.AppendLine("}\n");
        }

        return sb.ToString();
    }

    private string ConvertCSharpObjectToTypeScript(string csharpCode)
    {
        var tree = CSharpSyntaxTree.ParseText(csharpCode);
        var root = tree.GetRoot();
        var objectCreation = root.DescendantNodes().OfType<ObjectCreationExpressionSyntax>().FirstOrDefault()
            ?? throw new InvalidOperationException("No object initializer found.");

        var sb = new System.Text.StringBuilder();
        sb.AppendLine("{");

        foreach (var assign in objectCreation.Initializer?.Expressions.OfType<AssignmentExpressionSyntax>() ?? Enumerable.Empty<AssignmentExpressionSyntax>())
        {
            var name = assign.Left.ToString();
            var value = MapExpressionToTypeScript(assign.Right);
            sb.Append(' ', _indent);
            sb.AppendLine($"{name}: {value},");
        }

        sb.AppendLine("}");
        return sb.ToString();
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

    private string MapCSharpTypeToTypeScript(string csharpType)
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
}
