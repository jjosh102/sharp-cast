
namespace SharpCast.ModelConverter;

public interface IModelConverter<in TOptions>
{
    bool TryConvert(string input, TOptions options, out string output);
}