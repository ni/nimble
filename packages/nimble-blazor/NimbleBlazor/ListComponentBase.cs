using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

/// <summary>
/// Component that provides a list of options.
/// </summary>
/// <typeparam name="TOption">The type of the option value</typeparam>

public abstract class ListComponentBase<TOption> : ComponentBase
{
    private readonly List<TOption> _selectedOptions = new();

    // We cascade the InternalListContext to descendants, which in turn call it to add themselves to the options list
    internal InternalListContext<TOption> _internalListContext;

    protected string? InternalValue
    {
        get
        {
            return GetOptionValue(SelectedOption);
        }
        set
        {
            if (value != null && OptionValue != null && Items != null)
            {
                TOption? item = Items.FirstOrDefault(i => GetOptionValue(i) == value);

                if (!Equals(item, SelectedOption))
                {
                    SelectedOption = item;

                    Value = value;
                    // Raise Changed events in another thread
                    Task.Run(() => RaiseChangedEventsAsync());
                }
            }
        }
    }

    /// <summary>
    /// Unique identifier.
    /// The value will be used as the HTML <see href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id">global id attribute</see>.
    /// </summary>
    [Parameter]
    public virtual string? Id { get; set; }

    /// <summary>
    /// Text used on aria-label attribute.
    /// </summary>
    [Parameter]
    public virtual string? Title { get; set; }

    /// <summary>
    /// If true, will disable the list of items.
    /// </summary>
    [Parameter]
    public virtual bool Disabled { get; set; } = false;

    /// <summary>
    /// Gets or sets the content to be rendered inside the component.
    /// In this case list of FluentOptions
    /// </summary>
    [Parameter]
    public virtual RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Function used to determine which text to display for each option.
    /// </summary>
    [Parameter]
    public virtual Func<TOption, string?> OptionText { get; set; }

    /// <summary>
    /// Function used to determine which text to return for the selected item.
    /// </summary>
    [Parameter]
    public virtual Func<TOption, string?> OptionValue { get; set; }

    /// <summary>
    /// Function used to determine if an option is disabled.
    /// </summary>
    [Parameter]
    public virtual Func<TOption, bool>? OptionDisabled { get; set; }

    /// <summary>
    /// Function used to determine if an option is initially selected.
    /// </summary>
    [Parameter]
    public virtual Func<TOption, bool>? OptionSelected { get; set; }

    /// <summary>
    /// Data source of all items to display in this list.
    /// </summary>
    [Parameter]
    public virtual IEnumerable<TOption>? Items { get; set; }

    /// <summary>
    /// Gets or sets the selected item.
    /// ⚠️ Only available when Multiple = false.
    /// </summary>
    [Parameter]
    public virtual TOption? SelectedOption { get; set; }

    /// <summary>
    /// Called whenever the selection changed.
    /// ⚠️ Only available when Multiple = false.
    /// </summary>
    [Parameter]
    public virtual EventCallback<TOption?> SelectedOptionChanged { get; set; }

    /// <summary>
    /// Gets or sets the selected value.
    /// When Multiple = true this only reflects the first selected option value.
    /// </summary>
    [Parameter]
    public virtual string? Value { get; set; }


    /// <summary>
    /// Called whenever the selection changed.
    /// ⚠️ Only available when Multiple = false.
    /// </summary>
    [Parameter]
    public virtual EventCallback<string?> ValueChanged { get; set; }


    /// <summary>
    /// Gets or sets all selected items.
    /// ⚠️ Only available when Multiple = true.
    /// </summary>
    [Parameter]
    public virtual IEnumerable<TOption>? SelectedOptions { get; set; }

    /// <summary>
    /// Called whenever the selection changed.
    /// ⚠️ Only available when Multiple = true.
    /// </summary>
    [Parameter]
    public virtual EventCallback<IEnumerable<TOption>?> SelectedOptionsChanged { get; set; }

    /// <summary />
    protected ListComponentBase()
    {
        _internalListContext = new(this);

        OptionText = (item) => item?.ToString() ?? null;
        OptionValue = (item) => OptionText.Invoke(item) ?? item?.ToString() ?? null;
    }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public virtual IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    protected override void OnInitialized()
    {
        if (SelectedOption == null && Items != null && OptionSelected != null)
        {
            TOption? item = Items.FirstOrDefault(i => OptionSelected.Invoke(i));
            InternalValue = GetOptionValue(item);
        }
    }

    protected override void OnParametersSet()
    {

        if (_internalListContext.ValueChanged.HasDelegate == false)
        {
            _internalListContext.ValueChanged = ValueChanged;
        }

        if (_internalListContext.SelectedOptionChanged.HasDelegate == false)
        {
            _internalListContext.SelectedOptionChanged = SelectedOptionChanged;
        }

        if (InternalValue is null && Value is not null) // || InternalValue != Value)
        {
            InternalValue = Value;
        }

        base.OnParametersSet();
    }

    /// <summary />
    protected virtual bool DisabledItem(TOption item)
    {
        return Disabled;  // To allow overrides
    }

    /// <summary />
    protected virtual bool GetOptionSelected(TOption item)
    {
        if (OptionSelected != null)
        {
            return OptionSelected.Invoke(item);
        }
        else if (SelectedOption == null)
        {
            return false;
        }
        else if (OptionValue != null && SelectedOption != null)
        {
            return GetOptionValue(item) == GetOptionValue(SelectedOption);
        }
        else
        {
            return Equals(item, SelectedOption);
        }
    }

    /// <summary />
    protected virtual string? GetOptionValue(TOption? item)
    {
        if (item != null)
        {
            return OptionValue.Invoke(item) ?? OptionText.Invoke(item) ?? item.ToString();
        }

        return null;
    }

    protected virtual bool? GetOptionDisabled(TOption? item)
    {
        if (item != null)
        {
            return OptionDisabled != null ? OptionDisabled(item) : null;
        }

        return null;
    }

    /// <summary />
    protected virtual string? GetOptionText(TOption? item)
    {
        return item != null
            ? OptionText.Invoke(item) ?? item.ToString()
            : null;
    }

    /// <summary />
    protected virtual async Task OnSelectedItemChangedHandlerAsync(TOption? item)
    {
        if (Disabled || item == null)
        {
            return;
        }

        if (!Equals(item, SelectedOption))
        {
            SelectedOption = item;
            await RaiseChangedEventsAsync();
        }
    }

    /// <summary />
    protected virtual async Task RaiseChangedEventsAsync()
    {
        if (SelectedOptionChanged.HasDelegate)
        {
            await SelectedOptionChanged.InvokeAsync(SelectedOption);
        }

        if (ValueChanged.HasDelegate)
        {
            await ValueChanged.InvokeAsync(InternalValue);
        }

        await InvokeAsync(StateHasChanged);
    }



    /// <summary />
    protected virtual RenderFragment? GetListOptions(IEnumerable<TOption>? items)
    {
        ////if (items is not null)
        ////{
        ////    return new RenderFragment(builder =>
        ////    {
        ////        foreach (TOption item in items)
        ////        {
        ////            builder.OpenComponent<FluentOption<TOption>>(0);
        ////            builder.AddAttribute(1, "Value", GetOptionValue(item));
        ////            builder.AddAttribute(2, "Selected", GetOptionSelected(item));
        ////            builder.AddAttribute(3, "Disabled", GetOptionDisabled(item));

        ////            builder.AddAttribute(4, "ChildContent", (RenderFragment)(content =>
        ////            {
        ////                content.AddContent(5, GetOptionText(item));
        ////                if (item!.GetType().IsGenericType && item.GetType().GetGenericTypeDefinition() == typeof(Option<>))
        ////                {
        ////                    Option<string>? t = item as Option<string>;
        ////                    if (t is not null)
        ////                    {
        ////                        (string Name, IconSize? Size, IconVariant? Variant, Color? Color, string? Slot) = t.Icon;
        ////                        if (!string.IsNullOrEmpty(Name))
        ////                        {
        ////                            content.OpenComponent<FluentIcon>(6);
        ////                            content.AddAttribute(7, "Name", Name);

        ////                            if (Size is not null)
        ////                                content.AddAttribute(8, "Size", Size);
        ////                            if (Variant is not null)
        ////                                content.AddAttribute(9, "Variant", Variant);
        ////                            if (Slot is not null)
        ////                                content.AddAttribute(10, "Slot", Slot);
        ////                            if (Color is not null)
        ////                                content.AddAttribute(11, "Color", Color);

        ////                            content.CloseComponent();
        ////                        }
        ////                    }
        ////                }
        ////            }));

        ////            // Needed in fluent-listbox and fluent-select with mutliple select enabled
        ////            if (this is FluentListbox<TOption> || (this is FluentSelect<TOption> && Multiple))
        ////            {
        ////                builder.AddAttribute(12, "OnSelect", OnSelectCallback(item));
        ////            }

        ////            builder.CloseComponent();
        ////        }
        ////    });
        ////}
        ////else
        ////{
        return new RenderFragment(builder =>
        {
            builder.AddContent(0, ChildContent);
        });
        ////}

        ////EventCallback<string> OnSelectCallback(TOption? item)
        ////{
        ////    return EventCallback.Factory.Create<string>(this, (e) => OnSelectedItemChangedHandlerAsync(item));
        ////}
    }

    /// <summary />
    protected virtual async Task OnChangedHandlerAsync(ChangeEventArgs e)
    {
        if (e.Value is not null && Items is not null)
        {
            TOption? item = Items.FirstOrDefault(i => GetOptionValue(i) == e.Value.ToString());

            await OnSelectedItemChangedHandlerAsync(item);
        }
    }

    /// <summary />
    protected virtual bool RemoveSelectedItem(TOption? item)
    {
        if (item == null)
        {
            return false;
        }

        return _selectedOptions.Remove(item);
    }

    /// <summary />
    protected virtual void AddSelectedItem(TOption? item)
    {
        if (item == null)
        {
            return;
        }

        _selectedOptions.Add(item);
    }
}
