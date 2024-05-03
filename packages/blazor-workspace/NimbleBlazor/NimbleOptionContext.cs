using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

internal sealed class NimbleOptionContext
{
    private readonly NimbleOptionContext? _parentContext;

    /// <summary>
    /// Gets the name of the option 'container' (NimbleSelect, NimbleListBox)
    /// </summary>
    public string ContainerComponentName { get; }

    /// <summary>
    /// Gets the current selected value in the input radio group.
    /// </summary>
    public object? CurrentValue { get; }

    /// <summary>
    /// Gets a css class indicating the validation state of input radio elements.
    /// </summary>
    public string FieldClass { get; }

    /// <summary>
    /// Gets the event callback to be invoked when the selected value is changed.
    /// </summary>
    public EventCallback<ChangeEventArgs> ChangeEventCallback { get; }

    /// <summary>
    /// Instantiates a new <see cref="NimbleOptionContext" />.
    /// </summary>
    /// <param name="parentContext">The parent <see cref="NimbleOptionContext" />.</param>
    /// <param name="containerName">The name of the option.</param>
    /// <param name="currentValue">The current selected value in the input radio group.</param>
    /// <param name="fieldClass">The css class indicating the validation state of input radio elements.</param>
    /// <param name="changeEventCallback">The event callback to be invoked when the selected value is changed.</param>
    public NimbleOptionContext(
        NimbleOptionContext? parentContext,
        string containerName,
        object? currentValue,
        string fieldClass,
        EventCallback<ChangeEventArgs> changeEventCallback)
    {
        _parentContext = parentContext;

        ContainerComponentName = containerName;
        CurrentValue = currentValue;
        FieldClass = fieldClass;
        ChangeEventCallback = changeEventCallback;
    }

    /// <summary>
    /// Finds an <see cref="NimbleOptionContext"/> in the context's ancestors with the matching <paramref name="containerName"/>.
    /// </summary>
    /// <param name="containerName">The group name of the ancestor <see cref="NimbleOptionContext"/>.</param>
    /// <returns>The <see cref="NimbleOptionContext"/>, or <c>null</c> if none was found.</returns>
    public NimbleOptionContext? FindContextInAncestors(string containerName)
        => string.Equals(ContainerComponentName, containerName) ? this : _parentContext?.FindContextInAncestors(containerName);
}