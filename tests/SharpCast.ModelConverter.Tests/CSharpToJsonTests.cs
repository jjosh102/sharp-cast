using System.Text.Json;
using SharpCast.ModelConverter;
using Xunit;


public sealed class CSharpToJsonTests
{
   
    private readonly JsonSerializerOptions _opts = new() { WriteIndented = false };

    [Fact]
    public void Converts_ObjectInitializer_ToJson()
    {
        var code = @"
            var x = new Person {
                Name = ""A"",
                Age = 30,
                Active = true
            };
        ";

        var conv = new CSharpToJsonConverter();
        var ok = conv.TryConvert(code, _opts, out var json);

        Assert.True(ok);
        Assert.Equal(
            "{\"Active\":true,\"Age\":30,\"Name\":\"A\"}",
            json);
    }

    [Fact]
    public void Converts_Class_ToJsonSchema()
    {
        var code = @"
            public class Person {
                public string Name { get; set; }
                public int Age { get; set; }
                public bool Active { get; set; }
            }
        ";

        var conv = new CSharpToJsonConverter();
        var ok = conv.TryConvert(code, _opts, out var json);

        Assert.True(ok);
        Assert.Equal(
            "{\"Person\":{\"Active\":false,\"Age\":0,\"Name\":\"\"}}",
            json);
    }

    [Fact]
    public void Converts_Multiple_Classes()
    {
        var code = @"
            public class A { public string X { get; set; } }
            public class B { public int Y { get; set; } }
        ";

        var conv = new CSharpToJsonConverter();
        var ok = conv.TryConvert(code, _opts, out var json);

        Assert.True(ok);
        Assert.Equal(
            "{\"A\":{\"X\":\"\"},\"B\":{\"Y\":0}}",
            json);
    }

    [Fact]
    public void Handles_Array_Types()
    {
        var code = @"
            public class P {
                public string[] Tags { get; set; }
                public List<int> Scores { get; set; }
            }
        ";

        var conv = new CSharpToJsonConverter();
        var ok = conv.TryConvert(code, _opts, out var json);

        Assert.True(ok);
        Assert.Equal(
            "{\"P\":{\"Scores\":[],\"Tags\":[]}}", 
            json);
    }

    [Fact]
    public void Handles_Unknown_TypeAsNull()
    {
        var code = @"
            public class P {
                public CustomType Z { get; set; }
            }
        ";

        var conv = new CSharpToJsonConverter();
        var ok = conv.TryConvert(code, _opts, out var json);

        Assert.True(ok);
        Assert.Equal(
            "{\"P\":{\"Z\":null}}",
            json);
    }

    [Fact]
    public void Converts_Class_WhenNoObjectInitializerPresent()
    {
        var code = @"
            public class P { public int A { get; set; } }
        ";

        var conv = new CSharpToJsonConverter();
        var ok = conv.TryConvert(code, _opts, out var json);

        Assert.True(ok);
        Assert.Equal("{\"P\":{\"A\":0}}", json);
    }

    [Fact]
    public void Parses_Literal_ValuesCorrectly()
    {
        var code = @"
            var x = new T {
                S = ""abc"",
                N = 42,
                B = false
            };
        ";

        var conv = new CSharpToJsonConverter();
        var ok = conv.TryConvert(code, _opts, out var json);

        Assert.True(ok);
        Assert.Equal(
            "{\"B\":false,\"N\":42,\"S\":\"abc\"}", 
            json);
    }

    [Fact]
    public void Returns_Error_When_ExceptionNotHandled()
    {
        var conv = new CSharpToJsonConverter();
        var ok = conv.TryConvert(null!, _opts, out var json);

        Assert.False(ok);
        Assert.Contains("Error converting C#", json);
    }    
}