# Sharp Cast

Sharp Cast is a free web tool for developers who want a quick way to convert models between JSON, C#, and TypeScript.
It is meant for the very normal "I have this model in one format and need it in another one" moment. Paste your input, pick the conversion you want, adjust a few settings if needed, and get the result in the browser.

## What Sharp Cast does

- Convert `JSON -> C#`
- Convert `JSON -> TypeScript`
- Convert `C# -> JSON`
- Convert `C# -> TypeScript`
- Convert `TypeScript -> C#`
- Convert `TypeScript -> JSON`

## Web app highlights

- Blazor WebAssembly app with an in-browser editor
- Easy switching between input and output formats
- C# model generation settings when you need them
- Saved editor content and settings in local storage
- Last output snapshot so you can reopen recent results
- File upload support for source input

## C# generation options

When converting into C#, Sharp Cast supports options such as:

- `Namespace`
- `RootTypeName`
- `UseRecords`
- `UsePrimaryConstructor`
- `PropertyAccess`
- `ArrayType`
- `AddAttribute`
- `IsNullable`
- `IsRequired`
- `IsDefaultInitialized`
- `UseFileScoped`

## Project structure

- `src/SharpCast.Ui`: the web tool
- `src/SharpCast.ModelConverter`: the converter logic used by the app
- `tests/SharpCast.ModelConverter.Tests`: converter test coverage

## Run locally

Run the web app locally with:

```bash
dotnet run --project src/SharpCast.Ui/SharpCast.Ui.csproj
```

If you want to use the converter logic inside another .NET project, add a project reference:

```bash
dotnet add <YourProject>.csproj reference src/SharpCast.ModelConverter/SharpCast.ModelConverter.csproj
```

## Library example

The repo also includes the reusable converter library that powers the app:

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

var csharpToTs = new CSharpToTypeScriptConverter();
csharpToTs.TryConvert("public class Person { public string Name { get; set; } }", out var tsCode);

var csharpToJson = new CSharpToJsonConverter();
csharpToJson.TryConvert(csharpCode, new JsonSerializerOptions { WriteIndented = true }, out var jsonSchema);
```

## Tests

```bash
dotnet test tests/SharpCast.ModelConverter.Tests/SharpCast.ModelConverter.Tests.csproj -c Debug --no-restore
```
