<<<<<<<< HEAD:src/SharpCast.Ui/Models/Preference.cs
namespace SharpCast.Ui.Models;
========
namespace JsonToCsharpPoco.Ui.Models;
>>>>>>>> e004fa85858166851984f373607cbfdc07546e35:src/Ui/Models/Preference.cs
public class Preferences
{
    public bool IsSettingsSaved { get; set; }
    public bool IsEditorContentSaved { get; set; }
    public string CurrentTheme { get; set; } = "light";
}