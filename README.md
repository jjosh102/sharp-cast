# Sharp Cast

Minimal web tool and converter library for transforming JSON, C#, and TypeScript models.


## Project Layout

- `src/SharpCast.ModelConverter`: core conversion logic
- `src/SharpCast.Ui`: Blazor WebAssembly app
- `tests/SharpCast.ModelConverter.Tests`: converter/unit tests

## Supported Conversion Routes

Current routes wired in UI:

- `Json -> CSharp`
- `Json -> TypeScript` (pipeline: `Json -> CSharp -> TypeScript`)
- `CSharp -> Json`
- `CSharp -> TypeScript`
- `TypeScript -> CSharp`
- `TypeScript -> Json` (pipeline: `TypeScript -> CSharp -> Json`)

Route handling lives in:
- `src/SharpCast.Ui/Components/Pages/Converter.razor.cs`

## Converter Entry Points

- `JsonToCSharpConverter : IModelConverter<ConversionOptions>`
- `CSharpToTypeScriptConverter : IModelConverter`
- `CSharpToJsonConverter : IModelConverter<JsonSerializerOptions>`
- `TypeScriptToCSharpConverter : IModelConverter<ConversionOptions>`

DI registration:
- `src/SharpCast.ModelConverter/ModelConverterExtensions.cs`

## C# Generation Options (for model-generation routes)

Defined in `ConversionOptions`:

- `UseRecords`
- `UsePrimaryConstructor`
- `PropertyAccess` (`Mutable` / `Immutable`)
- `ArrayType` (`IReadOnlyList` / `List` / `Array`)
- `AddAttribute`
- `IsNullable`
- `IsRequired`
- `IsDefaultInitialized`
- `UseFileScoped`
- `Namespace`
- `RootTypeName`
