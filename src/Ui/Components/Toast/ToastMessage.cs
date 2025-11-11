<<<<<<<< HEAD:src/SharpCast.Ui/Components/Toast/ToastMessage.cs
﻿namespace SharpCast.Ui.Components.Toast;
========
﻿namespace JsonToCsharpPoco.Ui.Ui.Components.Toast;
>>>>>>>> e004fa85858166851984f373607cbfdc07546e35:src/Ui/Components/Toast/ToastMessage.cs

public class ToastMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public ToastType Type { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public int DurationMs { get; set; }
    public bool IsVisible { get; set; } = true;
}