namespace SharpCast.ModelConverter;

public interface IModelConverterProvider
{
      IModelConverter<TOptions> Get<TOptions>(ModelConverterType type);
}


