namespace SharpCast.UiTests;

<<<<<<< HEAD
using SharpCast.ModelConverter;
=======
namespace JsonToCsharpPoco.UiTests;

using JsonToCsharpPoco.Converter;
>>>>>>> e004fa85858166851984f373607cbfdc07546e35

using Xunit;

public class JsonToCSsharpClassTests
{
    private readonly PocoConverter _converter;
    private readonly ConversionOptions _defaultOptions;

    public JsonToCSsharpClassTests()
    {
        _converter = new PocoConverter();
        _defaultOptions = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            RootTypeName = "RootClass"
        };
    }

    [Fact]
    public void ConvertJsonToClass_ValidJson_ReturnsExpectedClass()
    {
        string json = @"{
            ""name"": ""John"",
            ""age"": 30,
            ""isEmployee"": true
        }";

        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);

        Assert.Contains("public class RootClass", result);
        Assert.Contains("public string Name", result);
        Assert.Contains("public int Age", result);
        Assert.Contains("public bool IsEmployee", result);
    }

    [Fact]
    public void ConvertJsonToClass_InvalidJson_ThrowsError()
    {

        string invalidJson = @"{ name: John }";

        _converter.TryConvertJsonToCSharp(invalidJson, _defaultOptions, out var result);

        Assert.StartsWith("Error converting JSON", result);
    }

    [Fact]
    public void ConvertJsonToClass_EmptyObjectJson_ReturnsEmptyClass()
    {
        string emptyJson = "{}";

        _converter.TryConvertJsonToCSharp(emptyJson, _defaultOptions, out var result);

        Assert.Contains("public class RootClass", result);
        Assert.DoesNotContain("public", result.Replace("public class RootClass", ""));
    }

    [Fact]
    public void ConvertJsonToClass_NestedObject_ReturnsNestedClasses()
    {

        string json = @"{
            ""person"": {
                ""name"": ""John"",
                ""address"": {
                    ""street"": ""Main St"",
                    ""city"": ""New York""
                }
            }
        }";

        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);

        Assert.Contains("public class RootClass", result);
        Assert.Contains("public Person Person", result);
        Assert.Contains("public class Person", result);
        Assert.Contains("public Address Address", result);
        Assert.Contains("public class Address", result);
    }

    [Fact]
    public void ConvertJsonToClass_ArrayProperty_ReturnsListType()
    {

        string json = @"{
            ""items"": [
                { ""id"": 1, ""value"": ""A"" },
                { ""id"": 2, ""value"": ""B"" }
            ]
        }";

        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);

        Assert.Contains("public IReadOnlyList<Items> Items", result);
        Assert.Contains("public class Items", result);
        Assert.Contains("public int Id", result);
        Assert.Contains("public string Value", result);
    }

    [Fact]
    public void ConvertJsonToClass_MixedArray_ReturnsObjectType()
    {

        string json = @"{
            ""data"": [""text"", true, 1]
        }";

        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);

        Assert.Contains("public IReadOnlyList<object> Data", result);
    }

    [Fact]
    public void ConvertJsonToClass_NumericPropertyName_ConvertsToValidStringPropertyName()
    {

        string json = @"{
            ""123"": ""value"",
            ""456"": 100
        }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            RootTypeName = "123"
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("public class _123", result);
        Assert.Contains("public string _123", result);
        Assert.Contains("public int _456", result);
    }
    [Fact]
    public void ConvertJsonToClass_PropertyAccessMutable_GeneratesGettersAndSetters()
    {

        string json = @"{
            ""name"": ""John"",
            ""age"": 30
        }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            PropertyAccess = PropertyAccess.Mutable
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("public string Name { get; set; }", result);
        Assert.Contains("public int Age { get; set; }", result);
    }

    [Fact]
    public void ConvertJsonToClass_PropertyAccessImmutable_GeneratesGettersAndInitOnlySetters()
    {

        string json = @"{
            ""name"": ""John"",
            ""age"": 30
        }";
        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            PropertyAccess = PropertyAccess.Immutable
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("public string Name { get; init; }", result);
        Assert.Contains("public int Age { get; init; }", result);
    }

    [Fact]
    public void ConvertJsonToClass_AddAttribute_AttributesShouldBeAdded()
    {
        string json = @"{
            ""123"": ""value"",
            ""456"": 100
        }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            AddAttribute = true


        };
        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("[JsonPropertyName(\"123\")]", result);
        Assert.Contains("[JsonPropertyName(\"456\")]", result);

    }

    [Fact]
    public void ConvertJsonToClass_RemoveAttributes_AttributesShouldNotBeAdded()
    {
        string json = @"{
            ""123"": ""value"",
            ""456"": 100
        }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            AddAttribute = false


        };
        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.DoesNotContain("[JsonPropertyName(\"123\")]", result);
        Assert.DoesNotContain("[JsonPropertyName(\"456\")]", result);

    }

    [Fact]
    public void ConvertJsonToClass_NullableAndRequiredProperties_GeneratesCorrectSyntax()
    {
        string json = @"{
        ""name"": ""John"",
        ""age"": 30,
        ""email"": """"
    }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            UsePrimaryConstructor = false,
            AddAttribute = false,
            IsNullable = true,
            IsRequired = true,
            PropertyAccess = PropertyAccess.Immutable
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("public required string? Name { get; init; }", result);
        Assert.Contains("public required int? Age { get; init; }", result);
        Assert.Contains("public required string? Email { get; init; }", result);


        options.IsNullable = false;
        _converter.TryConvertJsonToCSharp(json, options, out var result2);
        Assert.Contains("public required string Name { get; init; }", result2);
        Assert.Contains("public required int Age { get; init; }", result2);
    }

    [Fact]
    public void ConvertJsonToClass_DefaultInitializationWithArraysAndObjects_GeneratesDefaultValues()
    {
        string json = @"{
        ""name"": ""John"",
        ""age"": 30,
        ""isActive"": true,
        ""tags"": [""tag1"", ""tag2""],
        ""address"": {
            ""street"": ""Main St"",
            ""city"": ""New York""
        }
    }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            RootTypeName = "RootClass",
            UseRecords = false,
            UsePrimaryConstructor = false,
            AddAttribute = false,
            IsDefaultInitialized = true
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("public class RootClass", result);
        Assert.Contains("public string Name { get; init; } = string.Empty;", result);
        Assert.Contains("public IReadOnlyList<string> Tags { get; init; } = [];", result);
        Assert.Contains("public Address Address { get; init; } = new();", result);
        Assert.Contains("public class Address", result);
        Assert.Contains("public string Street { get; init; } = string.Empty;", result);
        Assert.Contains("public string City { get; init; } = string.Empty;", result);

        options.IsDefaultInitialized = false;
        _converter.TryConvertJsonToCSharp(json, options, out var result2);

        Assert.DoesNotContain("= string.Empty", result2);
        Assert.DoesNotContain("= [];", result2);
        Assert.DoesNotContain("= new();", result2);
    }

    [Fact]
    public void ConvertJsonToClass_ArrayType_RespectsSelectedArrayType()
    {
        string json = @"{
        ""items"": [
            { ""id"": 1, ""value"": ""A"" },
            { ""id"": 2, ""value"": ""B"" }
        ]
    }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            UsePrimaryConstructor = false,
            ArrayType = ArrayType.List
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("public List<Items> Items { get; init; }", result);
        Assert.Contains("public class Items", result);
        Assert.Contains("public int Id { get; init; }", result);
        Assert.Contains("public string Value { get; init; }", result);

        options.ArrayType = ArrayType.IReadOnlyList;
        _converter.TryConvertJsonToCSharp(json, options, out var result2);

        Assert.Contains("public IReadOnlyList<Items> Items { get; init; }", result2);

        options.ArrayType = ArrayType.Array;
        _converter.TryConvertJsonToCSharp(json, options, out var result3);

        Assert.Contains("public Items[] Items { get; init; }", result3);
    }

    [Fact]
    public void ConvertJsonToClass_CollectionRoot_ReturnsClassForFirstObject()
    {
        string json = @"[
        { ""name"": ""John"", ""age"": 30 },
        { ""name"": ""Jane"", ""age"": 25 }
    ]";

        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);

        Assert.Contains("public class RootClass", result);
        Assert.Contains("public string Name", result);
        Assert.Contains("public int Age", result);
    }

    [Fact]
    public void ConvertJsonToClass_EmptyCollection_ThrowsInvalidOperationException()
    {
        string json = "[]";
        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);
        Assert.NotEmpty(result);
    }

    [Fact]
    public void ConvertJsonToClass_CollectionWithNonObjectFirstElement_ThrowsInvalidOperationException()
    {
        string json = @"[42, ""invalid""]";
        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);
        Assert.NotEmpty(result);
    }

    [Fact]
    public void ConvertJsonToClass_CollectionWithNestedObjects_ReturnsNestedClassStructure()
    {
        string json = @"[
        {
            ""person"": {
                ""name"": ""John"",
                ""address"": {
                    ""street"": ""Main St"",
                    ""city"": ""New York""
                }
            }
        }
    ]";

        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);

        Assert.Contains("public class RootClass", result);
        Assert.Contains("public Person Person", result);
        Assert.Contains("public class Person", result);
        Assert.Contains("public Address Address", result);
        Assert.Contains("public class Address", result);
        Assert.Contains("public string Street", result);
        Assert.Contains("public string City", result);
    }

    [Fact]
    public void ConvertJsonToClass_CollectionWithArrayProperty_ReturnsListTypeInClass()
    {
        string json = @"[
        {
            ""items"": [
                { ""id"": 1, ""value"": ""A"" },
                { ""id"": 2, ""value"": ""B"" }
            ]
        }
    ]";

        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);

        Assert.Contains("public class RootClass", result);
        Assert.Contains("public IReadOnlyList<Items> Items", result);
        Assert.Contains("public class Items", result);
        Assert.Contains("public int Id", result);
        Assert.Contains("public string Value", result);
    }

    [Fact]
    public void ConvertJsonToClass_CollectionWithDateTimeProperty_ReturnsDateTimeTypeInClass()
    {
        string json = @"[
        {
            ""createdAt"": ""2024-01-11T10:00:00Z"",
            ""updatedAt"": ""2024-01-11""
        }
    ]";

        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);

        Assert.Contains("public class RootClass", result);
        Assert.Contains("public DateTime CreatedAt", result);
        Assert.Contains("public DateTime UpdatedAt", result);
    }

    [Fact]
    public void ConvertJsonToClass_CollectionWithComplexNestedStructure_GeneratesCorrectClassHierarchy()
    {
        string json = @"[
        {
            ""company"": {
                ""departments"": [
                    {
                        ""name"": ""IT"",
                        ""employees"": [
                            {
                                ""id"": 1,
                                ""details"": {
                                    ""position"": ""Developer"",
                                    ""skills"": [""C#"", ""JavaScript""]
                                }
                            }
                        ]
                    }
                ]
            }
        }
    ]";

        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);

        Assert.Contains("public class RootClass", result);
        Assert.Contains("public Company Company", result);
        Assert.Contains("public class Company", result);
        Assert.Contains("public IReadOnlyList<Departments> Departments", result);
        Assert.Contains("public class Departments", result);
        Assert.Contains("public IReadOnlyList<Employees> Employees", result);
        Assert.Contains("public class Employees", result);
        Assert.Contains("public Details Details", result);
        Assert.Contains("public class Details", result);
        Assert.Contains("public IReadOnlyList<string> Skills", result);
    }

    [Fact]
    public void ConvertJsonToClass_CollectionWithSpecialCharacters_HandlesCorrectlyInClass()
    {
        string json = @"[
        {
            ""@type"": ""person"",
            ""#id"": 123,
            ""$price"": 99.99
        }
    ]";

        _converter.TryConvertJsonToCSharp(json, _defaultOptions, out var result);

        Assert.Contains("public class RootClass", result);
        Assert.Contains("[JsonPropertyName(\"type\")]", result);
        Assert.Contains("[JsonPropertyName(\"id\")]", result);
        Assert.Contains("[JsonPropertyName(\"price\")]", result);
        Assert.Contains("public string Type", result);
        Assert.Contains("public int Id", result);
        Assert.Contains("public double Price", result);
    }

    [Fact]
    public void ConvertJsonToClass_CollectionWithNullableAndRequiredProperties_GeneratesCorrectSyntax()
    {
        string json = @"[
        {
            ""name"": ""John"",
            ""age"": 30,
            ""email"": """"
        }
    ]";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            UsePrimaryConstructor = false,
            AddAttribute = false,
            IsNullable = true,
            IsRequired = true,
            PropertyAccess = PropertyAccess.Immutable
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("public required string? Name { get; init; }", result);
        Assert.Contains("public required int? Age { get; init; }", result);
        Assert.Contains("public required string? Email { get; init; }", result);

        options.IsNullable = false;
        _converter.TryConvertJsonToCSharp(json, options, out var result2);

        Assert.Contains("public required string Name { get; init; }", result2);
        Assert.Contains("public required int Age { get; init; }", result2);
    }

    [Fact]
    public void ConvertJsonToClass_CollectionWithDefaultInitialization_GeneratesDefaultValues()
    {
        string json = @"[
        {
            ""name"": ""John"",
            ""age"": 30,
            ""isActive"": true,
            ""tags"": [""tag1"", ""tag2""],
            ""address"": {
                ""street"": ""Main St"",
                ""city"": ""New York""
            }
        }
    ]";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            RootTypeName = "RootClass",
            UseRecords = false,
            UsePrimaryConstructor = false,
            AddAttribute = false,
            IsDefaultInitialized = true
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("public class RootClass", result);
        Assert.Contains("public string Name { get; init; } = string.Empty;", result);
        Assert.Contains("public IReadOnlyList<string> Tags { get; init; } = [];", result);
        Assert.Contains("public Address Address { get; init; } = new();", result);
        Assert.Contains("public class Address", result);
        Assert.Contains("public string Street { get; init; } = string.Empty;", result);
        Assert.Contains("public string City { get; init; } = string.Empty;", result);

        options.IsDefaultInitialized = false;
        _converter.TryConvertJsonToCSharp(json, options, out var result2);

        Assert.DoesNotContain("= string.Empty", result2);
        Assert.DoesNotContain("= [];", result2);
        Assert.DoesNotContain("= new();", result2);
    }

    [Fact]
    public void ConvertJsonToClass_CollectionWithArrayType_RespectsSelectedArrayType()
    {
        string json = @"[
        {
            ""items"": [
                { ""id"": 1, ""value"": ""A"" },
                { ""id"": 2, ""value"": ""B"" }
            ]
        }
    ]";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            UsePrimaryConstructor = false,
            ArrayType = ArrayType.List
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("public List<Items> Items { get; init; }", result);
        Assert.Contains("public class Items", result);
        Assert.Contains("public int Id { get; init; }", result);
        Assert.Contains("public string Value { get; init; }", result);

        options.ArrayType = ArrayType.IReadOnlyList;
        _converter.TryConvertJsonToCSharp(json, options, out var result2);

        Assert.Contains("public IReadOnlyList<Items> Items { get; init; }", result2);

        options.ArrayType = ArrayType.Array;
        _converter.TryConvertJsonToCSharp(json, options, out var result3);

        Assert.Contains("public Items[] Items { get; init; }", result3);
    }
    [Fact]
    public void ConvertJsonToClass_PreservesAttributeNames_ForSpecialCharacters()
    {
        string json = @"{
        ""@type"": ""user"",
        ""#id"": 1001,
        ""$value"": 99.99
    }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            AddAttribute = true
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("[JsonPropertyName(\"type\")]", result);
        Assert.Contains("[JsonPropertyName(\"id\")]", result);
        Assert.Contains("[JsonPropertyName(\"value\")]", result);
        Assert.Contains("public string Type", result);
        Assert.Contains("public int Id", result);
        Assert.Contains("public double Value", result);
    }

    [Fact]
    public void ConvertJsonToClass_PreservesAttributeNames_ForNumericProperties()
    {
        string json = @"{
        ""123"": ""invalid"",
        ""456item"": true
    }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            AddAttribute = true
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("[JsonPropertyName(\"123\")]", result);
        Assert.Contains("[JsonPropertyName(\"456item\")]", result);
        Assert.Contains("public string _123", result);
        Assert.Contains("public bool 456item", result);
    }

    [Fact]
    public void ConvertJsonToClass_PreservesAttributeNames_InNestedStructures()
    {
        string json = @"{
        ""user"": {
            ""@email"": ""test@example.com"",
            ""!roles"": [""admin"", ""user""]
        }
    }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            AddAttribute = true
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("[JsonPropertyName(\"email\")]", result);
        Assert.Contains("[JsonPropertyName(\"roles\")]", result);
        Assert.Contains("public string Email", result);
        Assert.Contains("public IReadOnlyList<string> Roles", result);
    }

    [Fact]
    public void ConvertJsonToClass_PreservesAttributeNames_WithExactCasing()
    {
        string json = @"{
        ""FirstName"": ""John"",
        ""lastName"": ""Doe""
    }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            AddAttribute = true
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("[JsonPropertyName(\"FirstName\")]", result);
        Assert.Contains("[JsonPropertyName(\"lastName\")]", result);
        Assert.Contains("public string FirstName", result);
        Assert.Contains("public string LastName", result);
    }

    [Fact]
    public void ConvertJsonToClass_PreservesAttributeNames_ForArrayElements()
    {
        string json = @"{
        ""items"": [
            { ""item-id"": 1, ""item.value"": ""A"" }
        ]
    }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            AddAttribute = true
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("[JsonPropertyName(\"item-id\")]", result);
        Assert.Contains("[JsonPropertyName(\"item.value\")]", result);
        Assert.Contains("public int ItemId", result);
        Assert.Contains("public string ItemValue", result);
    }

    [Fact]
    public void ConvertJsonToClass_PreservesAttributeNames_ForReservedKeywords()
    {
        string json = @"{
        ""class"": ""advanced"",
        ""namespace"": ""system""
    }";

        var options = new ConversionOptions
        {
            Namespace = "TestNamespace",
            UseRecords = false,
            AddAttribute = true
        };

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("[JsonPropertyName(\"class\")]", result);
        Assert.Contains("[JsonPropertyName(\"namespace\")]", result);
        Assert.Contains("public string Class", result);
        Assert.Contains("public string Namespace", result);
    }

    [Fact]
    public void ConvertJsonToClass_FileScopedNamespace_GeneratesCorrectSyntax()
    {
        var options = new ConversionOptions
        {
            UseRecords = false,
            Namespace = "TestNamespace",
            UseFileScoped = true
        };

        string json = "{}";

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("namespace TestNamespace;", result);
    }

    [Fact]
    public void ConvertJsonToClass_BlockScopedNamespace_GeneratesCorrectSyntax()
    {
        var options = new ConversionOptions
        {
            UseRecords = false,
            Namespace = "TestNamespace",
            UseFileScoped = false
        };

        string json = "{}";

        _converter.TryConvertJsonToCSharp(json, options, out var result);

        Assert.Contains("namespace TestNamespace", result);
        Assert.Contains("{", result);
        Assert.Contains("}", result);
    }
}