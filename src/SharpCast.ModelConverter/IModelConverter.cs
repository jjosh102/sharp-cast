
namespace SharpCast.ModelConverter;

public interface IModelConverterMarker
{
    ModelConverterType Type { get; }
}

public interface IModelConverter<in TOptions> : IModelConverterMarker
{
    bool TryConvert(string input, TOptions options, out string output);
}