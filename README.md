# Sharp Cast

Sharp Cast is a small model-conversion tool for JSON, C#, and TypeScript.

## What it does

It currently supports:

- `Json -> CSharp`
- `Json -> TypeScript`
- `CSharp -> Json`
- `CSharp -> TypeScript`
- `TypeScript -> CSharp`
- `TypeScript -> Json`

## Project structure

- `src/SharpCast.ModelConverter` - conversion engine
- `src/SharpCast.Ui` - Blazor WebAssembly UI
- `tests/SharpCast.ModelConverter.Tests` - tests

## Key files

- Route handling: `src/SharpCast.Ui/Components/Pages/Converter.razor.cs`
- DI setup: `src/SharpCast.ModelConverter/ModelConverterExtensions.cs`
- C# generation options: `src/SharpCast.ModelConverter/Models/ConversionOptions.cs`
