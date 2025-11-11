
namespace JsonToCsharpPoco.Ui.Ui.Converter;

public interface IConverter
{
    bool TryConvert(string input, out string output);
}