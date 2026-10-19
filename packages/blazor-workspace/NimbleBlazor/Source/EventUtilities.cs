using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

/*
 * This class was copied and adapted from the Microsoft documentation:
 * https://learn.microsoft.com/en-us/aspnet/core/blazor/performance/rendering?view=aspnetcore-10.0#avoid-rerendering-after-handling-events-without-state-changes
 */
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

    private sealed record SyncReceiver(Action Callback)
        : ReceiverBase
    {
        public void Invoke() => Callback();
    }

    private sealed record SyncReceiver<T>(Action<T> Callback)
        : ReceiverBase
    {
        public void Invoke(T argument) => Callback(argument);
    }

    private sealed record AsyncReceiver(Func<Task> Callback)
        : ReceiverBase
    {
        public Task InvokeAsync() => Callback();
    }

    private sealed record AsyncReceiver<T>(Func<T, Task> Callback)
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
