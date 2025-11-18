using System.Text.Json;

using Microsoft.Extensions.DependencyInjection;

namespace SharpCast.ModelConverter;

public static class ModelConverterExtensions
{
    public static IServiceCollection AddModelConverters(this IServiceCollection services)
    {
        services.AddSingleton<IModelConverter<ConversionOptions>, JsonToCSharpConverter>();
        services.AddSingleton<IModelConverter<JsonSerializerOptions>, CSharpToJsonConverter>();
        services.AddSingleton<IModelConverter<string>, CSharpToTypeScriptConverter>();
        return services;
    }
}
