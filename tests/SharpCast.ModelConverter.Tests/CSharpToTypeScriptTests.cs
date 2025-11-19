namespace SharpCast.ModelConverter.Tests;

public class CSharpToTypeScriptTests
{
    private readonly CSharpToTypeScriptConverter _converter;

    public CSharpToTypeScriptTests()
    {
        _converter = new CSharpToTypeScriptConverter();
    }

    [Fact]
    public void Convert_ClassWithSimpleProperties_ReturnsValidTypeScriptInterface()
    {
        string code = @"
            public class Person
            {
                public string Name { get; set; }
                public int Age { get; set; }
                public bool IsEmployee { get; set; }
            }
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("export interface Person", ts);
        Assert.Contains("Name: string;", ts);
        Assert.Contains("Age: number;", ts);
        Assert.Contains("IsEmployee: boolean;", ts);
    }

    [Fact]
    public void Convert_RecordWithProperties_ReturnsValidTypeScriptInterface()
    {
        string code = @"
            public record User(string FirstName, int Age);
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("export interface User", ts);
        Assert.Contains("FirstName: string;", ts);
        Assert.Contains("Age: number;", ts);
    }

    [Fact]
    public void Convert_NullableProperties_OptionalMembersGenerated()
    {
        string code = @"
            public class Person
            {
                public string? Name { get; set; }
                public int? Age { get; set; }
            }
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("Name?: string;", ts);
        Assert.Contains("Age?: number;", ts);
    }

    [Fact]
    public void Convert_ArrayProperty_ReturnsTypeScriptArray()
    {
        string code = @"
            public class Data
            {
                public int[] Values { get; set; }
            }
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("Values: number[];", ts);
    }

    [Fact]
    public void Convert_ListProperty_ReturnsTypeScriptArray()
    {
        string code = @"
            public class Data
            {
                public List<string> Tags { get; set; }
            }
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("Tags: string[];", ts);
    }

    [Fact]
    public void Convert_NestedClass_GeneratesMultipleInterfaces()
    {
        string code = @"
            public class Root
            {
                public Person Person { get; set; }
            }

            public class Person
            {
                public string Name { get; set; }
            }
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("export interface Root", ts);
        Assert.Contains("Person: Person;", ts);
        Assert.Contains("export interface Person", ts);
        Assert.Contains("Name: string;", ts);
    }

    [Fact]
    public void Convert_MultipleClasses_CreatesMultipleInterfaces()
    {
        string code = @"
            public class A { public int X { get; set; } }
            public class B { public string Y { get; set; } }
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("export interface A", ts);
        Assert.Contains("export interface B", ts);
    }

    [Fact]
    public void Convert_ComplexNestedStructure_CreatesCorrectInterfaceHierarchy()
    {
        string code = @"
            public class Company
            {
                public List<Department> Departments { get; set; }
            }

            public class Department
            {
                public string Name { get; set; }
                public List<Employee> Employees { get; set; }
            }

            public class Employee
            {
                public int Id { get; set; }
                public Details Details { get; set; }
            }

            public class Details
            {
                public List<string> Skills { get; set; }
            }
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("export interface Company", ts);
        Assert.Contains("Departments: Department[];", ts);

        Assert.Contains("export interface Department", ts);
        Assert.Contains("Employees: Employee[];", ts);

        Assert.Contains("export interface Employee", ts);
        Assert.Contains("Details: Details;", ts);

        Assert.Contains("export interface Details", ts);
        Assert.Contains("Skills: string[];", ts);
    }

    // [Fact]
    // public void Convert_KeywordNamedProperties_RemainsValidInTypeScript()
    // {
    //     string code = @"
    //         public class Reserved
    //         {
    //             public string class { get; set; }
    //             public string namespace { get; set; }
    //         }
    //     ";

    //     _converter.TryConvert(code,  out var ts);

    //     Assert.Contains("class: string;", ts);
    //     Assert.Contains("namespace: string;", ts);
    // }

    // [Fact]
    // public void Convert_SpecialCharacterPropertyNames_ReturnsAsIs()
    // {
    //     string code = @"
    //         public class Special
    //         {
    //             public string @type { get; set; }
    //             public int #id { get; set; }
    //             public double $value { get; set; }
    //         }
    //     ";

    //     _converter.TryConvert(code,  out var ts);

    //     Assert.Contains("type: string;", ts);
    //     Assert.Contains("id: number;", ts);
    //     Assert.Contains("value: number;", ts);
    // }

    [Fact]
    public void Convert_GenericType_IgnoredAndReplacedWithAny()
    {
        string code = @"
            public class Wrapper<T>
            {
                public T Value { get; set; }
            }
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("Value: any;", ts);
    }

    [Fact]
    public void Convert_UnknownType_ReturnsAny()
    {
        string code = @"
            public class UnknownTypeWrapper
            {
                public CustomType Data { get; set; }
            }
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("Data: CustomType;", ts);
    }

    [Fact]
    public void Convert_Struct_GeneratesInterface()
    {
        string code = @"
            public struct Point
            {
                public int X { get; set; }
                public int Y { get; set; }
            }
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("export interface Point", ts);
        Assert.Contains("X: number;", ts);
        Assert.Contains("Y: number;", ts);
    }

    [Fact]
    public void Convert_MixedRecordAndClass_ProducesInterfacesForBoth()
    {
        string code = @"
            public class A { public int Id { get; set; } }
            public record B(string Name, bool Enabled);
        ";

        _converter.TryConvert(code,  out var ts);

        Assert.Contains("export interface A", ts);
        Assert.Contains("Id: number;", ts);

        Assert.Contains("export interface B", ts);
        Assert.Contains("Name: string;", ts);
        Assert.Contains("Enabled: boolean;", ts);
    }
}
