using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

// The list cascades this so that descendant options can talk back to it.
// It's an internal type so it doesn't show up in unrelated components by mistake.
internal class InternalListContext<TOption>
{
    private readonly List<NimbleListOptionBase<TOption>> options = new();

    public ListComponentBase<TOption> ListComponent { get; }

    public InternalListContext(ListComponentBase<TOption> listComponent)
    {
        ListComponent = listComponent;
    }

    /// <summary>
    /// Gets the list of all select items inside of this select component.
    /// </summary>
    public IEnumerable<NimbleListOptionBase<TOption>> Options => options;

    internal void Register(NimbleListOptionBase<TOption> option)
    {
        if (option is null)
        {
            return;
        }

        if (!options.Contains(option))
        {
            options.Add(option);
        }
    }

    internal void Unregister(NimbleListOptionBase<TOption> option)
    {
        if (option is null)
        {
            return;
        }

        options.Remove(option);
    }

    /// <summary>
    /// Gets the event callback to be invoked when the selected value is changed.
    /// </summary>
    public EventCallback<string?> ValueChanged { get; set; }

    /// <summary>
    /// Gets the event callback to be invoked when the selected value is changed.
    /// </summary>
    public EventCallback<TOption?> SelectedOptionChanged { get; set; }
}