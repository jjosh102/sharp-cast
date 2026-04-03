using System.Text.Json;

namespace SharpCast.ModelConverter.Tests;

public sealed class TypeScriptToCSharpTests
{
    private readonly TypeScriptToCSharpConverter _converter = new();

    [Fact]
    public void Convert_InterfaceToRecord_PrimaryConstructor_GeneratesExpectedMembers()
    {
        var ts = """
            export interface Person {
              firstName: string;
              age?: number;
            }
            """;

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = true,
            UsePrimaryConstructor = true,
            AddAttribute = true
        };

        var ok = _converter.TryConvert(ts, options, out var csharp);

        Assert.True(ok);
        Assert.Contains("public record Person(", csharp);
        Assert.Contains("[property: JsonPropertyName(\"firstName\")]", csharp);
        Assert.Contains("string FirstName", csharp);
        Assert.Contains("double? Age", csharp);
    }

    [Fact]
    public void Convert_InterfaceWithArrayAndRecordType_MapsCollectionsCorrectly()
    {
        var ts = """
            interface Payload {
              tags: string[];
              metadata: Record<string, number>;
            }
            """;

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            ArrayType = ArrayType.List
        };

        var ok = _converter.TryConvert(ts, options, out var csharp);

        Assert.True(ok);
        Assert.Contains("public class Payload", csharp);
        Assert.Contains("public List<string> Tags", csharp);
        Assert.Contains("public Dictionary<string, double> Metadata", csharp);
    }

    [Fact]
    public void Convert_InterfaceWithTuple_MapsToCSharpTuple()
    {
        var ts = """
            interface Location {
              coordinates: [number, number];
              labeled: [name: string, value: number?];
            }
            """;

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false
        };

        var ok = _converter.TryConvert(ts, options, out var csharp);

        Assert.True(ok);
        Assert.Contains("public (double, double) Coordinates", csharp);
        Assert.Contains("public (string, double?) Labeled", csharp);
    }

    [Fact]
    public void Convert_SingleElementTuple_MapsToArray()
    {
        var ts = """
            interface Playlist {
              tags: [string];
            }
            """;

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            ArrayType = ArrayType.List
        };

        var ok = _converter.TryConvert(ts, options, out var csharp);

        Assert.True(ok);
        Assert.Contains("public List<string> Tags", csharp);
    }

    [Fact]
    public void Convert_NoInterface_ReturnsFalse()
    {
        var ts = "type X = string;";
        var ok = _converter.TryConvert(ts, new ConversionOptions(), out var output);

        Assert.False(ok);
        Assert.Contains("No interfaces found", output);
    }

    [Fact]
    public void Convert_UnionWithMultipleTypes_MapsToObject()
    {
        var ts = """
            interface Example {
              value: string | number;
            }
            """;

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false
        };

        var ok = _converter.TryConvert(ts, options, out var csharp);

        Assert.True(ok);
        Assert.Contains("public object? Value", csharp);
    }

    [Fact]
    public void Convert_GenericArrayAndReadonlyTypes_MapToConfiguredArrayType()
    {
        var ts = """
            interface DataSet {
              tags: Array<string>;
              scores: ReadonlyArray<number>;
              readonly names: readonly string[];
            }
            """;

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            ArrayType = ArrayType.List
        };

        var ok = _converter.TryConvert(ts, options, out var csharp);

        Assert.True(ok);
        Assert.Contains("public List<string> Tags", csharp);
        Assert.Contains("public List<double> Scores", csharp);
        Assert.Contains("public List<string> Names", csharp);
    }

    [Fact]
    public void Convert_GenericInterface_EmitsGenericType()
    {
        var ts = """
            export interface Page<T> extends ResultBase {
              items: Array<T>;
              total: number;
            }
            """;

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false
        };

        var ok = _converter.TryConvert(ts, options, out var csharp);

        Assert.True(ok);
        Assert.Contains("public class Page<T>", csharp);
        Assert.Contains("public IReadOnlyList<T> Items", csharp);
        Assert.Contains("public double Total", csharp);
    }

    [Fact]
    public void Convert_ObjectLiteralProperty_MapsToObject()
    {
        var ts = """
            interface Config {
              settings: {
                theme: string;
                dark: boolean;
              };
            }
            """;

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false
        };

        var ok = _converter.TryConvert(ts, options, out var csharp);

        Assert.True(ok);
        Assert.Contains("public object? Settings", csharp);
    }

    [Fact]
    public void Convert_TypeScriptToJson_ViaCSharpPipeline_Works()
    {
        var ts = """
            interface Item {
              name: string;
              active: boolean;
            }
            """;

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false
        };

        var tsToCsOk = _converter.TryConvert(ts, options, out var csharp);
        Assert.True(tsToCsOk);

        var csharpToJson = new CSharpToJsonConverter();
        var jsonOk = csharpToJson.TryConvert(csharp, new JsonSerializerOptions { WriteIndented = false }, out var json);

        Assert.True(jsonOk);
        Assert.Contains("\"Item\"", json);
        Assert.Contains("\"Name\":\"\"", json);
        Assert.Contains("\"Active\":false", json);
    }
}
