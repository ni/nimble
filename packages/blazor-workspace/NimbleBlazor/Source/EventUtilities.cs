using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

internal static class EventUtilities
{
    public static Action AsNonRenderingEventHandler(Action callback)
        => new SyncReceiver(callback).Invoke;

    public static Action<TValue> AsNonRenderingEventHandler<TValue>(Action<TValue> callback)
        => new SyncReceiver<TValue>(callback).Invoke;

    public static Func<Task> AsNonRenderingEventHandler(Func<Task> callback)
        => new AsyncReceiver(callback).InvokeAsync;

    public static Func<TValue, Task> AsNonRenderingEventHandler<TValue>(Func<TValue, Task> callback)
        => new AsyncReceiver<TValue>(callback).InvokeAsync;

    private record SyncReceiver(Action Callback)
        : ReceiverBase
    {
        public void Invoke() => Callback();
    }

    private record SyncReceiver<T>(Action<T> Callback)
        : ReceiverBase
    {
        public void Invoke(T argument) => Callback(argument);
    }

    private record AsyncReceiver(Func<Task> Callback)
        : ReceiverBase
    {
        public Task InvokeAsync() => Callback();
    }

    private record AsyncReceiver<T>(Func<T, Task> Callback)
        : ReceiverBase
    {
        public Task InvokeAsync(T argument) => Callback(argument);
    }

    private record ReceiverBase : IHandleEvent
    {
        public Task HandleEventAsync(EventCallbackWorkItem item, object? argument) =>
            item.InvokeAsync(argument);
    }
}
