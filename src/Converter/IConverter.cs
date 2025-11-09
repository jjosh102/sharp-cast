
namespace JsonToCsharpPoco.Converter;

public interface IConverter
{
    bool TryConvert(string input, out string output);
}