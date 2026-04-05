# Sharp Cast

Sharp Cast is a small .NET library that converts between JSON, C#, and TypeScript models. It is designed for quick schema translation and code generation in tools and apps.

## Supported conversions

- Json -> CSharp
- Json -> TypeScript
- CSharp -> Json
- CSharp -> TypeScript
- TypeScript -> CSharp
- TypeScript -> Json

## Install

This repo contains the library and tests. Add the project reference from your solution:

```bash
dotnet add <YourProject>.csproj reference src/SharpCast.ModelConverter/SharpCast.ModelConverter.csproj
```

## Quick start

```csharp
using System.Text.Json;
using SharpCast.ModelConverter;

var options = new ConversionOptions
{
    Namespace = "My.Models",
    UseRecords = true,
    UsePrimaryConstructor = true,
    PropertyAccess = PropertyAccess.Immutable,
    ArrayType = ArrayType.IReadOnlyList,
    AddAttribute = true
};

var jsonToCsharp = new JsonToCSharpConverter();
jsonToCsharp.TryConvert("{ \"name\": \"Ada\", \"age\": 30 }", options, out var csharpCode);

var tsToCsharp = new TypeScriptToCSharpConverter();
tsToCsharp.TryConvert("interface Person { name: string; age?: number; }", options, out var csharpFromTs);

var csharpToTs = new CSharpToTypeScriptConverter();
csharpToTs.TryConvert("public class Person { public string Name { get; set; } }", out var tsCode);

var csharpToJson = new CSharpToJsonConverter();
csharpToJson.TryConvert(csharpCode, new JsonSerializerOptions { WriteIndented = true }, out var jsonSchema);
```

## Conversion options

These apply to `JsonToCSharpConverter` and `TypeScriptToCSharpConverter`:

- `Namespace`: Namespace for generated types.
- `RootTypeName`: Root type name for JSON conversion.
- `UseRecords`: Generate records instead of classes.
- `UsePrimaryConstructor`: Use primary constructors for records.
- `PropertyAccess`: `Immutable` (`get; init;`) or `Mutable` (`get; set;`).
- `ArrayType`: `IReadOnlyList`, `List`, or `Array`.
- `AddAttribute`: Add `JsonPropertyName` attributes.
- `IsNullable`: Emit nullable properties.
- `IsRequired`: Emit `required` properties.
- `IsDefaultInitialized`: Add default initializers for non-nullable properties.
- `UseFileScoped`: Use file-scoped namespaces.

## Notes

- `CSharpToJsonConverter` emits a JSON schema-like structure using sample values.
- `CSharpToTypeScriptConverter` produces TypeScript interfaces from public members.

## Tests

```bash
dotnet test sharp-cast.sln -c Debug
```
