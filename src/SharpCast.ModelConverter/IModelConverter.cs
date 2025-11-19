
namespace SharpCast.ModelConverter;

public partial interface IModelConverter<in TOptions>
{
    bool TryConvert(string input, TOptions options, out string output);
}

public partial interface IModelConverter
{
    bool TryConvert(string input, out string output);
}
