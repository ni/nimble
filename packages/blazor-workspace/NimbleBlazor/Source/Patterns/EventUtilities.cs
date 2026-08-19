using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

#pragma warning disable IDE1006 // Naming Styles
#pragma warning disable SA1300 // Element should begin with upper-case letter
#pragma warning disable VSTHRD200 // Use "Async" suffix for async methods
public static class EventUtilities
{
    public static Action AsNonRenderingEventHandler(Action callback)
        => new SyncReceiver(callback).Invoke;
    public static Action<TValue> AsNonRenderingEventHandler<TValue>(
            Action<TValue> callback)
        => new SyncReceiver<TValue>(callback).Invoke;
    public static Func<Task> AsNonRenderingEventHandler(Func<Task> callback)
        => new AsyncReceiver(callback).Invoke;
    public static Func<TValue, Task> AsNonRenderingEventHandler<TValue>(
            Func<TValue, Task> callback)
        => new AsyncReceiver<TValue>(callback).Invoke;

    private record SyncReceiver(Action callback)
        : ReceiverBase
    { public void Invoke() => callback(); }
    private record SyncReceiver<T>(Action<T> callback)
        : ReceiverBase
    { public void Invoke(T arg) => callback(arg); }
    private record AsyncReceiver(Func<Task> callback)
        : ReceiverBase
    { public Task Invoke() => callback(); }
    private record AsyncReceiver<T>(Func<T, Task> callback)
        : ReceiverBase
    { public Task Invoke(T arg) => callback(arg); }

    private record ReceiverBase : IHandleEvent
    {
        public Task HandleEventAsync(EventCallbackWorkItem item, object arg) =>
            item.InvokeAsync(arg);
    }
}
#pragma warning restore IDE1006 // Naming Styles
#pragma warning restore SA1300 // Element should begin with upper-case letter
#pragma warning restore VSTHRD200 // Use "Async" suffix for async methods
