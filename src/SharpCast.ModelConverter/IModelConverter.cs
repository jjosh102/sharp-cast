
namespace SharpCast.ModelConverter;

public interface IModelConverter
{
    bool TryConvert(string input, out string output);
}