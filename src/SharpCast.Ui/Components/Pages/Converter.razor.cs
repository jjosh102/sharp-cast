using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using Microsoft.AspNetCore.Components;
using BlazorMonaco.Editor;
using SharpCast.ModelConverter;
using Microsoft.JSInterop;
using SharpCast.Ui.Components.AppState;
using SharpCast.Ui.Components.Toast;
using Blazored.LocalStorage;
using SharpCast.Ui.Models;
using SharpCast.Ui.Resources;
using SharpCast.Ui.Shared;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis;

namespace SharpCast.Ui.Components.Pages;

public partial class Converter : ComponentBase
{
    private readonly IModelConverter<ConversionOptions> _jsonToCSharpConverter;
    private readonly TypeScriptToCSharpConverter _typeScriptToCSharpConverter;
    private readonly IModelConverter<JsonSerializerOptions> _cSharpToJsonConverter;
    private readonly IModelConverter _cSharpToTypeScriptConverter;
    private readonly ISyncLocalStorageService _localStorageService;
    private readonly ILocalStorageService _localStorageServiceAsync;
    private readonly IJSRuntime _jsRuntime;
    private readonly ToastService _toastService;

    [AllowNull] private StandaloneCodeEditor _inputEditor;
    [AllowNull] private StandaloneCodeEditor _outputEditor;

    [CascadingParameter]
    public required CascadingAppState AppState { get; set; }

    private ConversionOptions _conversionOptions = new();

    private CodeFormat _inputFormat = CodeFormat.Json;
    private CodeFormat _outputFormat = CodeFormat.CSharp;

    private bool _isConverting;
    private bool _showOutputDialog;
    private bool _showSidebar;

    private string _modalOutput = string.Empty;
    private CodeFormat _modalOutputFormat = CodeFormat.CSharp;
    private DateTimeOffset? _lastOutputAt;
    private ConversionSnapshot? _lastSnapshot;
    private bool _suppressInputSave;

    private bool ShowModelGenerationSettings => RouteUsesModelOptions(_inputFormat, _outputFormat);

    private bool HasLastOutput => !string.IsNullOrWhiteSpace(_lastSnapshot?.Output);

    private bool IsCurrentRouteSupported => GetUnsupportedReason(_inputFormat, _outputFormat) is null;

    private string CurrentRouteMessage => GetUnsupportedReason(_inputFormat, _outputFormat) ?? string.Empty;

    public Converter(
        IModelConverter<ConversionOptions> jsonToCsharpConverter,
        TypeScriptToCSharpConverter typeScriptToCSharpConverter,
        IModelConverter<JsonSerializerOptions> cSharpToJsonConverter,
        IModelConverter cSharpToTypeScriptConverter,
        IJSRuntime jsRuntime,
        ISyncLocalStorageService localStorageService,
        ILocalStorageService localStorageServiceAsync,
        ToastService toastService)
    {
        _jsonToCSharpConverter = jsonToCsharpConverter;
        _typeScriptToCSharpConverter = typeScriptToCSharpConverter;
        _cSharpToJsonConverter = cSharpToJsonConverter;
        _cSharpToTypeScriptConverter = cSharpToTypeScriptConverter;
        _jsRuntime = jsRuntime;
        _localStorageService = localStorageService;
        _localStorageServiceAsync = localStorageServiceAsync;
        _toastService = toastService;
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;

        _suppressInputSave = true;

        var preferences = await _localStorageServiceAsync
            .GetItemAsync<Preferences>(Constants.SavedPreferences) ?? AppState.Preferences;

        await LoadSettings(preferences);
        await LoadLastOutputSnapshot();
        await SetEditorLanguageSafe(_inputEditor, _inputFormat);
        await LoadInputContent(preferences);

        _suppressInputSave = false;
    }

    private async Task LoadSettings(Preferences preferences)
    {
        if (!preferences.IsSettingsSaved)
            return;

        var saved = await _localStorageServiceAsync
            .GetItemAsync<ConversionOptions>(Constants.SettingsContents);

        if (saved is not null)
            _conversionOptions = saved;

        var savedRoute = await _localStorageServiceAsync
            .GetItemAsync<ConversionRoutePreference>(Constants.ConversionRoute);

        if (savedRoute is null)
            return;

        if (GetUnsupportedReason(savedRoute.InputFormat, savedRoute.OutputFormat) is not null)
            return;

        _inputFormat = savedRoute.InputFormat;
        _outputFormat = savedRoute.OutputFormat;
    }

    private async Task ResetSettingsAsync()
    {
        _conversionOptions = new ConversionOptions();
        OnSettingsChanged();
        await ShowToastAsync("Settings reset to defaults", ToastType.Success, durationMs: 2000);
    }

    private void OnSettingsChanged()
    {
        if (!AppState.Preferences.IsSettingsSaved)
            return;

        _localStorageService
            .SetItem(Constants.SettingsContents, _conversionOptions);
    }

    private async Task SaveRoute()
    {
        if (!AppState.Preferences.IsSettingsSaved)
            return;

        var route = new ConversionRoutePreference
        {
            InputFormat = _inputFormat,
            OutputFormat = _outputFormat
        };

        await _localStorageServiceAsync
            .SetItemAsync(Constants.ConversionRoute, route);
    }

    private async Task LoadInputContent(Preferences preferences)
    {
        if (!preferences.IsEditorContentSaved)
            return;

        var content = await _localStorageServiceAsync
            .GetItemAsStringAsync(Constants.InputEditorContents);

        if (string.IsNullOrWhiteSpace(content))
        {
            content = await _localStorageServiceAsync
                .GetItemAsStringAsync(Constants.JsonEditorContents);
        }

        if (string.IsNullOrWhiteSpace(content))
        {
            content = await _localStorageServiceAsync
                .GetItemAsStringAsync(Constants.CsharpEditorContents);
        }

        if (string.IsNullOrWhiteSpace(content))
        {
            content = await _localStorageServiceAsync
                .GetItemAsync<string>(Constants.InputEditorContents);
        }

        if (string.IsNullOrWhiteSpace(content))
            return;

        var applied = await SetEditorValueSafe(_inputEditor, content, retries: 20, delayMs: 75);
        if (!applied)
        {
            await Task.Delay(150);
            await SetEditorValueSafe(_inputEditor, content, retries: 20, delayMs: 75);
        }
    }

    private async Task SaveInputContent()
    {
        if (!AppState.Preferences.IsEditorContentSaved)
            return;

        var content = await GetEditorValueSafe(_inputEditor);

        if (content is null)
            return;

        await _localStorageServiceAsync
            .SetItemAsStringAsync(Constants.InputEditorContents, content);
    }

    private async Task LoadLastOutputSnapshot()
    {
        _lastSnapshot = await _localStorageServiceAsync
            .GetItemAsync<ConversionSnapshot>(Constants.LastConversionOutput);

        _lastOutputAt = _lastSnapshot?.CreatedAt;
    }

    private async Task SaveLastOutputSnapshot(string output)
    {
        _lastSnapshot = new ConversionSnapshot
        {
            InputFormat = _inputFormat,
            OutputFormat = _outputFormat,
            Output = output,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _lastOutputAt = _lastSnapshot.CreatedAt;

        await _localStorageServiceAsync
            .SetItemAsync(Constants.LastConversionOutput, _lastSnapshot);
    }

    private async Task FormatInputAsync()
    {
        var input = await GetEditorValueSafe(_inputEditor);
        if (string.IsNullOrWhiteSpace(input)) return;

        string formatted;
        try
        {
            formatted = _inputFormat switch
            {
                CodeFormat.Json => FormatJson(input),
                CodeFormat.CSharp => FormatCSharp(input),
                _ => await TriggerMonacoFormatAsync() ?? input
            };
        }
        catch
        {
            await ShowToastAsync("Failed to format input", ToastType.Warning);
            return;
        }

        if (formatted != input)
        {
            await SetEditorValueSafe(_inputEditor, formatted);
            await ShowToastAsync("Formatted", ToastType.Success, durationMs: 1500);
        }
    }

    private string FormatJson(string json)
    {
        using var doc = JsonDocument.Parse(json);
        return JsonSerializer.Serialize(doc, new JsonSerializerOptions { WriteIndented = true });
    }

    private string FormatCSharp(string csharp)
    {
        var tree = CSharpSyntaxTree.ParseText(csharp);
        return tree.GetRoot().NormalizeWhitespace().ToFullString();
    }

    private async Task<string?> TriggerMonacoFormatAsync()
    {
        if (_inputEditor == null) return null;
        await _inputEditor.Trigger("source", "editor.action.formatDocument");
        return await _inputEditor.GetValue();
    }

    private async Task ClearInputAsync()
    {
        await SetEditorValueSafe(_inputEditor, string.Empty);
        await SaveInputContent();
    }

    private async Task OnInputChanged(ModelContentChangedEvent _)
    {
        if (_suppressInputSave)
            return;

        var content = await GetEditorValueSafe(_inputEditor);
        if (!string.IsNullOrWhiteSpace(content))
        {
            var detected = FormatUtility.GuessFormat(content);
            if (detected.HasValue && detected.Value != _inputFormat)
            {
                _inputFormat = detected.Value;
                await SetEditorLanguageSafe(_inputEditor, _inputFormat);
                await SaveRoute();
                StateHasChanged();
            }
        }

        await SaveInputContent();
    }

    private static StandaloneEditorConstructionOptions CreateEditorOptions(
        string language,
        bool readOnly = false)
    {
        return new StandaloneEditorConstructionOptions
        {
            Language = language,
            AutomaticLayout = true,
            FontSize = 12,
            ReadOnly = readOnly,
            Minimap = new EditorMinimapOptions { Enabled = false }
        };
    }

    private static string GetMonacoLanguage(CodeFormat format)
    {
        return format switch
        {
            CodeFormat.Json => "json",
            CodeFormat.CSharp => "csharp",
            CodeFormat.TypeScript => "typescript",
            _ => "plaintext"
        };
    }

    private async Task SetEditorLanguageSafe(
        StandaloneCodeEditor? editor,
        CodeFormat format,
        int retries = 6,
        int delayMs = 50)
    {
        if (editor is null)
            return;

        var language = GetMonacoLanguage(format);

        for (var attempt = 0; attempt < retries; attempt++)
        {
            try
            {
                var model = await editor.GetModel();
                await Global.SetModelLanguage(_jsRuntime, model, language);
                return;
            }
            catch (JSException)
            {
                await Task.Delay(delayMs);
            }
        }
    }

    private async Task<bool> SetEditorValueSafe(
        StandaloneCodeEditor? editor,
        string value,
        int retries = 6,
        int delayMs = 50)
    {
        if (editor is null)
            return false;

        for (var attempt = 0; attempt < retries; attempt++)
        {
            try
            {
                await editor.SetValue(value);
                return true;
            }
            catch (JSException)
            {
                await Task.Delay(delayMs);
            }
        }

        return false;
    }

    private async Task<string?> GetEditorValueSafe(
        StandaloneCodeEditor? editor,
        int retries = 6,
        int delayMs = 50)
    {
        if (editor is null)
            return null;

        for (var attempt = 0; attempt < retries; attempt++)
        {
            try
            {
                return await editor.GetValue();
            }
            catch (JSException)
            {
                await Task.Delay(delayMs);
            }
        }

        return null;
    }

    private async Task OnInputFormatChanged(ChangeEventArgs args)
    {
        if (!Enum.TryParse<CodeFormat>(args.Value?.ToString(), out var format))
            return;

        _inputFormat = format;
        await SetEditorLanguageSafe(_inputEditor, _inputFormat);
        await SaveRoute();
    }

    private async Task OnOutputFormatChanged(ChangeEventArgs args)
    {
        if (!Enum.TryParse<CodeFormat>(args.Value?.ToString(), out var format))
            return;

        _outputFormat = format;
        await SaveRoute();
    }

    private async Task SwapFormatsAsync()
    {
        var inputContent = await GetEditorValueSafe(_inputEditor) ?? string.Empty;
        var outputContent = _modalOutput.Length > 0
            ? _modalOutput
            : _lastSnapshot?.Output ?? string.Empty;

        (_inputFormat, _outputFormat) = (_outputFormat, _inputFormat);
        await SetEditorLanguageSafe(_inputEditor, _inputFormat);
        await SetEditorValueSafe(_inputEditor, outputContent);

        _modalOutput = inputContent;
        _modalOutputFormat = _outputFormat;

        if (_lastSnapshot is not null)
        {
            _lastSnapshot = new ConversionSnapshot
            {
                InputFormat = _inputFormat,
                OutputFormat = _outputFormat,
                Output = _modalOutput,
                CreatedAt = DateTimeOffset.UtcNow
            };

            _lastOutputAt = _lastSnapshot.CreatedAt;

            await _localStorageServiceAsync
                .SetItemAsync(Constants.LastConversionOutput, _lastSnapshot);
        }

        await SaveRoute();
    }

    private async Task Convert()
    {
        if (!IsCurrentRouteSupported)
        {
            await ShowToastAsync(CurrentRouteMessage, ToastType.Error, "Unsupported Route");
            return;
        }

        await SaveRoute();

        _isConverting = true;
        await Task.Delay(50);

        var input = await GetEditorValueSafe(_inputEditor);

        if (string.IsNullOrWhiteSpace(input))
        {
            await ShowToastAsync("Input required", ToastType.Error);
            _isConverting = false;
            return;
        }

        if (!TryConvert(input, out var result))
        {
            await ShowToastAsync(result, ToastType.Error, "Conversion Failed");
            _isConverting = false;
            return;
        }

        await SaveLastOutputSnapshot(result);
        await OpenOutputDialogAsync(result, _outputFormat);
        await ShowToastAsync("Conversion successful", ToastType.Success);

        _isConverting = false;
    }

    private bool TryConvert(string input, out string result)
    {
        result = string.Empty;

        return (_inputFormat, _outputFormat) switch
        {
            (CodeFormat.Json, CodeFormat.CSharp) =>
                _jsonToCSharpConverter.TryConvert(input, _conversionOptions, out result),

            (CodeFormat.Json, CodeFormat.TypeScript) =>
                TryConvertJsonToTypeScript(input, out result),

            (CodeFormat.CSharp, CodeFormat.Json) =>
                _cSharpToJsonConverter.TryConvert(input, CreateJsonOutputOptions(), out result),

            (CodeFormat.CSharp, CodeFormat.TypeScript) =>
                _cSharpToTypeScriptConverter.TryConvert(input, out result),

            (CodeFormat.TypeScript, CodeFormat.CSharp) =>
                _typeScriptToCSharpConverter.TryConvert(input, _conversionOptions, out result),

            (CodeFormat.TypeScript, CodeFormat.Json) =>
                TryConvertTypeScriptToJson(input, out result),

            _ => Unsupported(out result)
        };
    }

    private bool TryConvertJsonToTypeScript(string input, out string result)
    {
        result = string.Empty;

        if (!_jsonToCSharpConverter.TryConvert(input, _conversionOptions, out var csharpResult))
        {
            result = "Unable to convert JSON to C# before TypeScript conversion.";
            return false;
        }

        if (!_cSharpToTypeScriptConverter.TryConvert(csharpResult, out result))
        {
            result = "Unable to convert generated C# to TypeScript.";
            return false;
        }

        return true;
    }

    private bool TryConvertTypeScriptToJson(string input, out string result)
    {
        result = string.Empty;

        if (!_typeScriptToCSharpConverter.TryConvert(input, _conversionOptions, out var csharpResult))
        {
            result = "Unable to convert TypeScript to C# before JSON conversion.";
            return false;
        }

        if (!_cSharpToJsonConverter.TryConvert(csharpResult, CreateJsonOutputOptions(), out result))
        {
            result = "Unable to convert generated C# to JSON.";
            return false;
        }

        return true;
    }

    private static JsonSerializerOptions CreateJsonOutputOptions()
    {
        return new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = null
        };
    }

    private static bool Unsupported(out string result)
    {
        result = "Conversion path not implemented.";
        return false;
    }

    private static string? GetUnsupportedReason(CodeFormat from, CodeFormat to)
    {
        if (from == to)
            return "Select different input and format.";

        return (from, to) switch
        {
            (CodeFormat.Json, CodeFormat.CSharp) => null,
            (CodeFormat.Json, CodeFormat.TypeScript) => null,
            (CodeFormat.CSharp, CodeFormat.Json) => null,
            (CodeFormat.CSharp, CodeFormat.TypeScript) => null,
            (CodeFormat.TypeScript, CodeFormat.CSharp) => null,
            (CodeFormat.TypeScript, CodeFormat.Json) => null,
            _ => "This conversion route is not implemented yet."
        };
    }

    private static bool RouteUsesModelOptions(CodeFormat from, CodeFormat to)
    {
        return (from, to) switch
        {
            (CodeFormat.Json, CodeFormat.CSharp) => true,
            (CodeFormat.TypeScript, CodeFormat.CSharp) => true,
            _ => false
        };
    }

    private async Task OpenOutputDialogAsync(string output, CodeFormat format)
    {
        _modalOutput = output;
        _modalOutputFormat = format;
        _showOutputDialog = true;

        await InvokeAsync(StateHasChanged);
        await SetEditorLanguageSafe(_outputEditor, _modalOutputFormat);
        await SetEditorValueSafe(_outputEditor, _modalOutput);
    }

    private void CloseOutputDialog()
    {
        _showOutputDialog = false;
    }

    private async Task ShowLastOutputAsync()
    {
        if (!HasLastOutput)
        {
            await ShowToastAsync("No previous output found.", ToastType.Warning);
            return;
        }

        await OpenOutputDialogAsync(_lastSnapshot!.Output, _lastSnapshot.OutputFormat);
    }

    private async Task CopyModalOutputToClipboard()
    {
        if (string.IsNullOrWhiteSpace(_modalOutput))
        {
            await ShowToastAsync(GetText("NoOutputToCopy_Message", "No output to copy."), ToastType.Warning);
            return;
        }

        await _jsRuntime.InvokeVoidAsync("navigator.clipboard.writeText", _modalOutput);
        await ShowToastAsync(GetText("OutputCopySuccess_Message", "Output copied to clipboard."), ToastType.Success);
    }

    private async Task HandleFileUpload(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            return;

        await SetEditorValueSafe(_inputEditor, content);
    }

    private async Task ShowToastAsync(
        string message,
        ToastType type,
        string title = "",
        int durationMs = 3000)
    {
        await _toastService
            .ShowToastAsync(message, type, title, durationMs);
    }

    private static string GetText(string key, string fallback)
        => Localizer.ResourceManager.GetString(key, Localizer.Culture) ?? fallback;
}

public sealed class ConversionSnapshot
{
    public CodeFormat InputFormat { get; set; }
    public CodeFormat OutputFormat { get; set; }
    public string Output { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
}

public sealed class ConversionRoutePreference
{
    public CodeFormat InputFormat { get; set; }
    public CodeFormat OutputFormat { get; set; }
}
