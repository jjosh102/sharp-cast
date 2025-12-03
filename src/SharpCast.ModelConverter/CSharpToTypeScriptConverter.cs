using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace SharpCast.ModelConverter;

public sealed class CSharpToTypeScriptConverter : IModelConverter
{
    private const int IndentSize = 2;
    public bool TryConvert(string csharpCode, out string tsCode)
    {
        try
        {
            var tree = CSharpSyntaxTree.ParseText(csharpCode);
            var root = tree.GetRoot();

            var typeNodes = root.DescendantNodes()
                .Where(n =>
                       n is ClassDeclarationSyntax ||
                       n is RecordDeclarationSyntax ||
                       n is StructDeclarationSyntax)
                .Cast<TypeDeclarationSyntax>()
                .ToList();

            if (typeNodes.Count == 0)
            {
                tsCode = "/* No classes/records found */";
                return true;
            }

            var sb = new StringBuilder();

            foreach (var typeDecl in typeNodes)
            {
                EmitType(typeDecl, sb);
            }

            tsCode = sb.ToString();
            return true;
        }
        catch (Exception ex)
        {
            tsCode = $"Error converting C# to TypeScript: {ex.Message}";
            return false;
        }
    }

    private void EmitType(TypeDeclarationSyntax typeDecl, StringBuilder sb)
    {
        var typeName = typeDecl.Identifier.Text;
        sb.AppendLine($"export interface {typeName} {{");

        var typeParams = typeDecl is TypeDeclarationSyntax tds && tds.TypeParameterList != null
            ? tds.TypeParameterList.Parameters.Select(p => p.Identifier.Text).ToHashSet(StringComparer.Ordinal)
            : [];

 
        if (typeDecl is RecordDeclarationSyntax r && r.ParameterList != null)
        {
            foreach (var param in r.ParameterList.Parameters)
            {
                var propNameRaw = param.Identifier.Text;
                var propName = NormalizeIdentifierToken(propNameRaw);
                var (tsType, optional) = MapTypeSyntax(param.Type, typeParams);
                EmitMember(sb, propName, tsType, optional);
            }
        }


        foreach (var prop in typeDecl.Members.OfType<PropertyDeclarationSyntax>())
        {
            var nameToken = prop.Identifier;
            var propNameRaw = nameToken.Text;
            var propName = NormalizeIdentifierToken(propNameRaw);
            var (tsType, optional) = MapTypeSyntax(prop.Type, typeParams);
   
            if (IsNullable(prop.Type)) optional = true;
            EmitMember(sb, propName, tsType, optional);
        }

        foreach (var field in typeDecl.Members.OfType<FieldDeclarationSyntax>())
        {
            if (!field.Modifiers.Any(m => m.IsKind(SyntaxKind.PublicKeyword)))
                continue;

            var fieldType = field.Declaration.Type;
            foreach (var variable in field.Declaration.Variables)
            {
                var propNameRaw = variable.Identifier.Text;
                var propName = NormalizeIdentifierToken(propNameRaw);
                var (tsType, optional) = MapTypeSyntax(fieldType, typeParams);
                EmitMember(sb, propName, tsType, optional);
            }
        }

        sb.AppendLine("}\n");
    }

    private void EmitMember(StringBuilder sb, string propName, string tsType, bool optional)
    {
        sb.Append(' ', IndentSize);
        if (IsValidTsIdentifier(propName))
        {
            sb.Append(propName);
        }
        else
        {
            // Emit quoted property name when it contains invalid characters or starts with a digit
            sb.Append('[');
            sb.Append('"');
            sb.Append(propName);
            sb.Append('"');
            sb.Append(']');
        }

        if (optional)
            sb.Append('?');

        sb.Append(": ");
        sb.Append(tsType);
        sb.AppendLine(";");
    }

    private static string NormalizeIdentifierToken(string raw)
    {
        if (string.IsNullOrEmpty(raw))
            return raw;

        if (raw.Length > 0 && raw[0] == '@')
            return raw.Substring(1);

        return raw;
    }

    private static bool IsValidTsIdentifier(string name)
    {
        if (string.IsNullOrEmpty(name)) return false;


        if (char.IsDigit(name[0])) return false;

        for (int i = 0; i < name.Length; i++)
        {
            var ch = name[i];
            if (!(char.IsLetterOrDigit(ch) || ch == '_' || ch == '$'))
                return false;
        }

        return true;
    }

    private static (string TsType, bool Optional) MapTypeSyntax(TypeSyntax? typeSyntax, HashSet<string> parentTypeParameters)
    {
        if (typeSyntax == null)
            return ("any", false);

        if (typeSyntax is NullableTypeSyntax nullableType)
        {
            var (inner, _) = MapTypeSyntax(nullableType.ElementType, parentTypeParameters);
            return (inner, true);
        }

        var raw = typeSyntax.ToString().Trim();

        if (raw.EndsWith("?"))
        {
            raw = raw[..^1].Trim();
            var parsed = SyntaxFactory.ParseTypeName(raw);
            return (MapTypeSyntax(parsed, parentTypeParameters).TsType, true);
        }

        if (typeSyntax is IdentifierNameSyntax idName)
        {
            var id = idName.Identifier.Text;
            if (parentTypeParameters.Contains(id))
                return ("any", false);

            return (MapKnownSimpleType(id), false);
        }

        if (typeSyntax is PredefinedTypeSyntax pre)
        {
            return (MapKnownSimpleType(pre.Keyword.Text), false);
        }

        if (typeSyntax is ArrayTypeSyntax arrayType)
        {
            var (inner, opt) = MapTypeSyntax(arrayType.ElementType, parentTypeParameters);
            return ($"{inner}[]", opt);
        }

        if (typeSyntax is GenericNameSyntax gen)
        {
            var identifier = gen.Identifier.Text;
            var args = gen.TypeArgumentList.Arguments;
            var argNames = args.Select(a => a.ToString().Trim()).ToList();
            if (argNames.Any(n => parentTypeParameters.Contains(n)))
            {
                if (args.Count == 1)
                    return ("any[]", false);

                return ("any", false);
            }

            if (identifier.Equals("List", StringComparison.Ordinal) ||
                identifier.Equals("IReadOnlyList", StringComparison.Ordinal) ||
                identifier.Equals("IEnumerable", StringComparison.Ordinal) ||
                identifier.Equals("IList", StringComparison.Ordinal) ||
                identifier.Equals("ICollection", StringComparison.Ordinal))
            {
                var inner = args.Count > 0 ? MapTypeSyntax(args[0], parentTypeParameters).TsType : "any";
                return ($"{inner}[]", false);
            }

            if (identifier.Equals("Dictionary", StringComparison.Ordinal) ||
                identifier.Equals("IDictionary", StringComparison.Ordinal))
            {
                var valueType = args.Count > 1 ? MapTypeSyntax(args[1], parentTypeParameters).TsType : "any";
                return ($"Record<string, {valueType}>", false);
            }


            if (args.Count == 1)
            {
                var inner = MapTypeSyntax(args[0], parentTypeParameters).TsType;
                return ($"{inner}[]", false);
            }

            return ("any", false);
        }

        if (typeSyntax is QualifiedNameSyntax qn)
        {
            var right = qn.Right.ToString();
            return (MapKnownSimpleType(right), false);
        }

        if (typeSyntax is TupleTypeSyntax)
            return ("any", false);

        var text = typeSyntax.ToString().Trim();
        if (text.Contains('<') || text.Contains('>'))
            return ("any", false);

        return (text, false);
    }

    private static bool IsNullable(TypeSyntax? typeSyntax)
    {
        if (typeSyntax == null) return false;
        if (typeSyntax is NullableTypeSyntax) return true;
        var txt = typeSyntax.ToString().Trim();
        return txt.EndsWith('?');
    }

    private static string MapKnownSimpleType(string token)
    {
        token = token?.Trim() ?? string.Empty;

        return token switch
        {
            "string" => "string",
            "char" => "string",
            "bool" => "boolean",
            "byte" or "sbyte" or "short" or "ushort" or "int" or "uint" or
            "long" or "ulong" or "float" or "double" or "decimal" => "number",
            "DateTime" or "DateTimeOffset" => "string",
            "object" or "any" => "any",
            _ => token 
        };
    }
}
