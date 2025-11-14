namespace SharpCast.ModelConverter;
public sealed class ModelConverterProvider : IModelConverterProvider
{
    private readonly IDictionary<ModelConverterType, object> _map;

    public ModelConverterProvider(IEnumerable<object> converters)
    {
        _map = converters
            .Where(c => c is IModelConverterMarker)
            .Cast<IModelConverterMarker>()
            .ToDictionary(c => c.Type, c => (object)c);
    }

    public IModelConverter<TOptions> Get<TOptions>(ModelConverterType type)
    {
        return (IModelConverter<TOptions>)_map[type];
    }
}