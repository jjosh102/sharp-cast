
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using SharpCast.Ui.Shared;
using Blazored.LocalStorage;
using SharpCast.Ui.Models;
using BlazorMonaco.Editor;

<<<<<<<< HEAD:src/SharpCast.Ui/Components/AppState/CascadingAppState.razor.cs
namespace SharpCast.Ui.Components.AppState;
========
namespace JsonToCsharpPoco.Ui.Ui.Components.AppState;
>>>>>>>> e004fa85858166851984f373607cbfdc07546e35:src/Ui/Components/AppState/CascadingAppState.razor.cs

public partial class CascadingAppState : ComponentBase
{
    private readonly IJSRuntime _jsRuntime;
    private readonly ILocalStorageService _localStorageService;

    public CascadingAppState(IJSRuntime jsRuntime, ILocalStorageService localStorageService)
    {
        _jsRuntime = jsRuntime;
        _localStorageService = localStorageService;
    }


    [Parameter]
    public RenderFragment? ChildContent { get; set; }
    public Preferences Preferences { get; set; } = new();

    protected override async Task OnInitializedAsync()
    {
        await InitilizedCustomDarkTheme();
        if (await _localStorageService.GetItemAsync<Preferences>(Constants.SavedPreferences) is { } preferences)
        {
            Preferences = preferences;
        }
        else
        {
            string systemTheme = await _jsRuntime.InvokeAsync<string>("getSystemTheme");
            Preferences.CurrentTheme = systemTheme;
        }

        await Global.SetTheme(_jsRuntime, IsDarkTheme ? "github-dark" : "vs-light");
    }

    public async Task ToggleTheme()
    {
        var currentTheme = IsDarkTheme ? "light" : "dark";
        await UpdatePreferenceAsync(t => t.CurrentTheme = currentTheme, Constants.SavedPreferences);
        await Global.SetTheme(_jsRuntime, IsDarkTheme ? "github-dark" : "vs-light");
        StateHasChanged();
    }

    public bool IsDarkTheme => Preferences.CurrentTheme == "dark";

    public async Task UpdatePreferenceAsync(Action<Preferences> updateAction, string storageKey)
    {
        updateAction(Preferences);
        await _localStorageService.SetItemAsync(storageKey, Preferences);
    }

    private async Task InitilizedCustomDarkTheme()
    {
        await Global.DefineTheme(_jsRuntime, "github-dark", new StandaloneThemeData
        {
            Base = "vs-dark",
            Inherit = true,
            Rules =
            [
            new() { Token = string.Empty, Foreground = "c9d1d9", Background = "0d1117" },
            new() { Token = "comment", Foreground = "8b949e" },
            new() { Token = "keyword", Foreground = "ff7b72" },
            new() { Token = "number", Foreground = "79c0ff" },
            new() { Token = "string", Foreground = "a5d6ff" },
            new() { Token = "delimiter", Foreground = "e1e4e8" },
            new() { Token = "type", Foreground = "ffa657" },
            new() { Token = "function", Foreground = "d2a8ff" }
            ],
            Colors = new Dictionary<string, string>
            {
                ["editor.background"] = "#0d1117",
                ["editor.foreground"] = "#c9d1d9",
                ["editorCursor.foreground"] = "#c9d1d9",
                ["editor.lineHighlightBackground"] = "#161b22",
                ["editorLineNumber.foreground"] = "#8b949e",
                ["editor.selectionBackground"] = "#264f78",
                ["editor.inactiveSelectionBackground"] = "#3b3f44"
            }
        });
    }

}