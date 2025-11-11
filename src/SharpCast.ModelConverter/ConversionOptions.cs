namespace SharpCast.ModelConverter;

public sealed class ConversionOptions
{
    public bool UseRecords { get; set; }
    public bool UsePrimaryConstructor { get; set; }
    public PropertyAccess PropertyAccess { get; set; }
    public ArrayType ArrayType { get; set; }
    public bool AddAttribute { get; set; } = true;
    public bool IsNullable { get; set; }
    public bool IsRequired { get; set; }
    public bool IsDefaultInitialized { get; set; }
    public bool UseFileScoped { get; set; }
    public string Namespace { get; set; } = "JsonToCsharp";
    public string RootTypeName { get; set; } = "Root";
}
