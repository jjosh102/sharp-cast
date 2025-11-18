using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;
using BlazorMonaco.Editor;
using SharpCast.ModelConverter;
using Microsoft.JSInterop;
using SharpCast.Ui.Components.AppState;
using SharpCast.Ui.Components.Toast;
using Blazored.LocalStorage;
using SharpCast.Ui.Shared;
using SharpCast.Ui.Resources;
namespace SharpCast.Ui.Components.Pages;


public partial class Converter : ComponentBase
{
    private readonly IModelConverter<ConversionOptions> _converter;
    private readonly ISyncLocalStorageService _localStorageService;
    private readonly ILocalStorageService _localStorageServiceAsync;
    private readonly IJSRuntime _jsRuntime;
    private readonly ToastService _toastService;
    private bool _showSidebar = true;
    private ConversionOptions _conversionOptions = new();

    [AllowNull] private StandaloneCodeEditor _jsonEditor;
    [AllowNull] private StandaloneCodeEditor _csharpEditor;

    [CascadingParameter] public required CascadingAppState AppState { get; set; }

    private bool _isConverting;

    public Converter(
        IModelConverter<ConversionOptions> converter,
        IJSRuntime jsRuntime,
        ISyncLocalStorageService localStorageService,
        ILocalStorageService localStorageServiceAsync,
        ToastService toastService)
    {
        _converter = converter;
        _jsRuntime = jsRuntime;
        _localStorageService = localStorageService;
        _localStorageServiceAsync = localStorageServiceAsync;
        _toastService = toastService;
    }

    protected override async Task OnInitializedAsync()
    {
        await LoadEditorSettings();
        await LoadEditorContent(Constants.JsonEditorContents, _jsonEditor);
        await LoadEditorContent(Constants.CsharpEditorContents, _csharpEditor);
    }

    private async Task LoadEditorSettings()
    {
        var savedSettings = await _localStorageServiceAsync.GetItemAsync<ConversionOptions>(Constants.SettingsContents);
        if (savedSettings != null && AppState.Preferences.IsSettingsSaved)
        {
            _conversionOptions = savedSettings;
        }
    }

    private async Task LoadEditorContent(string storageKey, StandaloneCodeEditor? editor)
    {
        if (editor is null || !AppState.Preferences.IsEditorContentSaved)
            return;

        var content = await _localStorageServiceAsync.GetItemAsync<string>(storageKey);
        if (!string.IsNullOrWhiteSpace(content))
        {
            await editor!.SetValue(content);
        }
    }

    private void OnSettingsChanged()
    {
        if (AppState.Preferences.IsSettingsSaved)
        {
            _localStorageService.SetItem(Constants.SettingsContents, _conversionOptions);
        }
    }

    private static StandaloneEditorConstructionOptions CreateEditorOptions(string language)
    {
        return new StandaloneEditorConstructionOptions
        {
            Language = language,
            AutomaticLayout = true,
            FontSize = 12
        };
    }

    private async Task SaveEditorContent(string storageKey, StandaloneCodeEditor editor)
    {
        if (editor is null || !AppState.Preferences.IsEditorContentSaved)
            return;

        var content = await editor.GetValue();
        await _localStorageServiceAsync.SetItemAsStringAsync(storageKey, content);
    }

    private async Task Convert()
    {
        _isConverting = true;
        await Task.Delay(50);

        var jsonToConvert = await _jsonEditor.GetValue();
        if (string.IsNullOrWhiteSpace(jsonToConvert))
        {
            await ShowToastAsync(Localizer.EnterJson, ToastType.Error, "Error");
            _isConverting = false;
            return;
        }

        if (_converter.TryConvert(jsonToConvert, _conversionOptions, out var result))
        {
            await _csharpEditor.SetValue(result);
            await ShowToastAsync(Localizer.JsonConversionSuccess, ToastType.Success, Localizer.ConversionSuccess);
        }
        else
        {
            await ShowToastAsync(Localizer.JsonConversionError, ToastType.Error, $"{Localizer.ConversionFailed} - {result}");
        }

        _isConverting = false;
    }

    // private async Task ConvertToJson()
    // {
    //     _isConverting = true;
    //     await Task.Delay(500);

    //     var pocoToConvert = await _csharpEditor.GetValue();
    //     if (string.IsNullOrWhiteSpace(pocoToConvert))
    //     {
    //         await ShowToastAsync(Localizer.EnterJson, ToastType.Error, "Error");
    //         _isConverting = false;
    //         return;
    //     }

    //     if (_pocoConverter.TryConvertCSharpToTypeScript(pocoToConvert, out var result))
    //     {
    //         await _jsonEditor.SetValue(result);
    //         await ShowToastAsync(Localizer.JsonConversionSuccess, ToastType.Success, Localizer.ConversionSuccess);
    //     }
    //     else
    //     {
    //         await ShowToastAsync(Localizer.JsonConversionError, ToastType.Error, $"{Localizer.ConversionFailed} - {result}");
    //     }

    //     _isConverting = false;
    // }

    public async Task CopyToClipboard()
    {
        var csharpCode = await _csharpEditor.GetValue();
        if (string.IsNullOrWhiteSpace(csharpCode))
            return;

        await _jsRuntime.InvokeVoidAsync("navigator.clipboard.writeText", csharpCode);
        await ShowToastAsync(Localizer.ClipboardCopySuccess, ToastType.Success);
    }

    private async Task ShowToastAsync(string message, ToastType type, string title = "", int durationMs = 3000)
    {
        await _toastService.ShowToastAsync(message, type, title, durationMs);
    }

    private async Task HandleFileUpload(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            return;

        await _jsonEditor.SetValue(content);
        await InvokeAsync(StateHasChanged);
    }



    private async Task OnEditorContentChanged(ModelContentChangedEvent eventArgs, string storageKey, StandaloneCodeEditor editor) =>
      await SaveEditorContent(storageKey, editor);

    private async Task OnJsonDidChangeModelContent(ModelContentChangedEvent eventArgs) =>
      await OnEditorContentChanged(eventArgs, Constants.JsonEditorContents, _jsonEditor);


    private async Task OnCsharpDidChangeModelContent(ModelContentChangedEvent eventArgs) =>
      await OnEditorContentChanged(eventArgs, Constants.CsharpEditorContents, _csharpEditor);

}
