using System.Globalization;
using System.Text.Json;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.JSInterop;
using Xunit;

namespace OkBlazor.Tests.Unit.Components;

public class OkFvBindingsTests : BunitTestBase
{
    [Fact]
    public void TextAndDateInputs_UpdateBindingsAndInvokeCallbacks()
    {
        var model = new FormValues();
        var editContext = new EditContext(model);
        var changeCalls = 0;
        var inputCalls = 0;
        var pickerChangeCalls = 0;
        var wrapper = Render<CascadingValue<EditContext>>(p => p
            .Add(x => x.Value, editContext)
            .AddChildContent<OkFvTextField>(field => field
                .Add(x => x.Value, model.Text)
                .Add(x => x.ValueChanged, value => model.Text = value)
                .Add(x => x.ValueExpression, () => model.Text)
                .Add(x => x.OnChange, _ => changeCalls++))
            .AddChildContent<OkFvDateTimePicker>(picker => picker
                .Add(x => x.Value, model.Date)
                .Add(x => x.ValueChanged, value => model.Date = value)
                .Add(x => x.ValueExpression, () => model.Date)
                .Add(x => x.OnInput, _ => inputCalls++)
                .Add(x => x.OnChange, _ => pickerChangeCalls++)));

        wrapper.Find("ok-fv-text-field").TriggerEvent("onchange", new ChangeEventArgs { Value = "edited" });
        wrapper.Find("ok-fv-date-time-picker").TriggerEvent("oninput", new ChangeEventArgs { Value = "2025-01-02" });
        Assert.Equal("2025-01-02", model.Date);
        wrapper.Find("ok-fv-date-time-picker").TriggerEvent("onchange", new ChangeEventArgs { Value = "2025-01-03" });
        wrapper.Find("ok-fv-date-time-picker").TriggerEvent("onchange", new ChangeEventArgs { Value = "2025-01-03" });

        Assert.Equal("edited", model.Text);
        Assert.Equal("2025-01-03", model.Date);
        Assert.True(editContext.IsModified(FieldIdentifier.Create(() => model.Text)));
        Assert.True(editContext.IsModified(FieldIdentifier.Create(() => model.Date)));
        Assert.Equal(1, changeCalls);
        Assert.Equal(1, inputCalls);
        Assert.Equal(2, pickerChangeCalls);
    }

    private sealed class FormValues
    {
        public string? Text { get; set; }
        public string? Date { get; set; }
    }

    [Fact]
    public void NumericAttributes_UseInvariantCulture()
    {
        var originalCulture = CultureInfo.CurrentCulture;
        try
        {
            CultureInfo.CurrentCulture = CultureInfo.GetCultureInfo("de-DE");
            var handle = Render<OkFvSplitter>(p => p
                .Add(x => x.Position, 60.5)
                .Add(x => x.Min, 10.25)
                .Add(x => x.Max, 90.75)
                .Add(x => x.Step, 0.5));
            var layout = Render<OkFvSplitLayout>(p => p
                .Add(x => x.Position, 60.5)
                .Add(x => x.Min, 10.25)
                .Add(x => x.Max, 90.75)
                .Add(x => x.MinSecondaryPixels, 20.5)
                .Add(x => x.Step, 0.5));

            var handleElement = handle.Find("ok-fv-splitter");
            Assert.Equal("60.5", handleElement.GetAttribute("position"));
            Assert.Equal("10.25", handleElement.GetAttribute("min"));
            Assert.Equal("90.75", handleElement.GetAttribute("max"));
            Assert.Equal("0.5", handleElement.GetAttribute("step"));

            var layoutElement = layout.Find("ok-fv-split-layout");
            Assert.Equal("60.5", layoutElement.GetAttribute("position"));
            Assert.Equal("10.25", layoutElement.GetAttribute("min"));
            Assert.Equal("90.75", layoutElement.GetAttribute("max"));
            Assert.Equal("20.5", layoutElement.GetAttribute("min-secondary-pixels"));
            Assert.Equal("0.5", layoutElement.GetAttribute("step"));
        }
        finally
        {
            CultureInfo.CurrentCulture = originalCulture;
        }
    }

    [Fact]
    public void TextFieldAndDateTimePicker_ApplyParentValueUpdatesAfterInput()
    {
        var textField = Render<OkFvTextField>(p => p
            .Add(x => x.Value, "initial")
            .Add(x => x.OnChange, _ => { }));
        textField.Find("ok-fv-text-field").TriggerEvent("onchange", new ChangeEventArgs { Value = "edited" });
        textField.Render(p => p
            .Add(x => x.Value, "parent update")
            .Add(x => x.OnChange, _ => { }));
        Assert.Equal("parent update", textField.Find("ok-fv-text-field").GetAttribute("current-value"));

        var dateTimePicker = Render<OkFvDateTimePicker>(p => p
            .Add(x => x.Value, "2025-01-01")
            .Add(x => x.OnInput, _ => { }));
        dateTimePicker.Find("ok-fv-date-time-picker").TriggerEvent("oninput", new ChangeEventArgs { Value = "2025-01-02" });
        dateTimePicker.Render(p => p
            .Add(x => x.Value, "2025-01-03")
            .Add(x => x.OnInput, _ => { }));
        Assert.Equal("2025-01-03", dateTimePicker.Find("ok-fv-date-time-picker").GetAttribute("current-value"));
    }

    [Fact]
    public async Task TextField_ForwardsAndClearsMaskOptions()
    {
        var mask = new MaskReference();
        var field = Render<OkFvTextField>(p => p.Add(x => x.MaskOptions, mask));

        await field.InvokeAsync(() => field.Instance.SetParametersAsync(ParameterView.FromDictionary(
            new Dictionary<string, object?> { [nameof(OkFvTextField.MaskOptions)] = null })));

        var calls = JSInterop.Invocations.Where(x => x.Identifier == "OkBlazor.setProperty").ToArray();
        Assert.Equal(2, calls.Length);
        Assert.Equal("maskOptions", calls[0].Arguments[1]);
        Assert.Same(mask, calls[0].Arguments[2]);
        Assert.Null(calls[1].Arguments[2]);
    }

    private sealed class MaskReference : IJSObjectReference
    {
        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args) => throw new NotSupportedException();
        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, CancellationToken cancellationToken, object?[]? args) => throw new NotSupportedException();
        public ValueTask DisposeAsync() => ValueTask.CompletedTask;
    }

    [Fact]
    public void ObjectProperties_AreSentToTheWebComponents()
    {
        var options = new[] { new FvMultiSelectOption { Value = "a", Label = "A" } };
        var selection = new[] { "a" };
        var query = new { version = 1, root = (object?)null };
        var definition = new { fields = Array.Empty<object>(), operators = Array.Empty<object>() };
        var message = new FvCommitMessage { Severity = "error", Text = "Failed" };

        Render<OkFvMultiSelect>(p => p
            .Add(x => x.Options, options)
            .Add(x => x.SelectedValues, selection));
        Render<OkFvFilterBar>(p => p
            .Add(x => x.Query, query)
            .Add(x => x.Definition, definition));
        Render<OkFvEditCommitBar>(p => p.Add(x => x.Message, message));

        var calls = JSInterop.Invocations.Where(x => x.Identifier == "OkBlazor.setProperty").ToArray();
        Assert.Equal(5, calls.Length);
        Assert.Contains(calls, x => Equals(x.Arguments[1], "options") && ReferenceEquals(x.Arguments[2], options));
        Assert.Contains(calls, x => Equals(x.Arguments[1], "selectedValues") && ReferenceEquals(x.Arguments[2], selection));
        Assert.Contains(calls, x => Equals(x.Arguments[1], "query") && ReferenceEquals(x.Arguments[2], query));
        Assert.Contains(calls, x => Equals(x.Arguments[1], "definition") && ReferenceEquals(x.Arguments[2], definition));
        Assert.Contains(calls, x => Equals(x.Arguments[1], "message") && ReferenceEquals(x.Arguments[2], message));
    }

    [Fact]
    public void CustomEvents_InvokeCallbacks()
    {
        IEnumerable<string>? selected = null;
        var saved = false;
        JsonElement? query = null;
        double? position = null;
        var component = Render<OkFvMultiSelect>(p => p.Add(x => x.SelectedValuesChanged, values => selected = values));
        var bar = Render<OkFvEditCommitBar>(p => p.Add(x => x.Save, () => saved = true));
        var filter = Render<OkFvFilterBar>(p => p.Add(x => x.EditFilter, args => query = args.Query));
        var layout = Render<OkFvSplitLayout>(p => p.Add(x => x.OnInput, args => position = args.Position));
        var multiSource = component.Find("ok-fv-multi-select").GetAttribute("data-ok-fv-event-source");
        var layoutSource = layout.Find("ok-fv-split-layout").GetAttribute("data-ok-fv-event-source");
        var barSource = bar.Find("ok-fv-edit-commit-bar").GetAttribute("data-ok-fv-event-source");
        var filterSource = filter.Find("ok-fv-filter-bar").GetAttribute("data-ok-fv-event-source");

        component.Find("ok-fv-multi-select").TriggerEvent("onokfvmultiselectinput", new FvMultiSelectEventArgs { SelectedValues = ["wrong"] });
        layout.Find("ok-fv-split-layout").TriggerEvent("onokfvpositioninput", new FvPositionEventArgs { Source = "input", Position = 99 });
        Assert.Null(selected);
        Assert.Null(position);
        component.Find("ok-fv-multi-select").TriggerEvent("onokfvmultiselectinput", new FvMultiSelectEventArgs { SelectedValues = ["b"], Source = multiSource });
        layout.Find("ok-fv-split-layout").TriggerEvent("onokfvpositioninput", new FvPositionEventArgs { Source = layoutSource, Position = 40 });
        bar.Find("ok-fv-edit-commit-bar").TriggerEvent("onokfvsave", new FvEventArgs { Source = barSource });
        filter.Find("ok-fv-filter-bar").TriggerEvent("onokfveditfilter", new FvFilterBarEventArgs
        {
            Query = JsonSerializer.SerializeToElement(new { version = 1, root = (object?)null }),
            Source = filterSource
        });

        Assert.Equal(["b"], selected);
        Assert.True(saved);
        Assert.Equal(40, position);
        Assert.Equal(1, query!.Value.GetProperty("version").GetInt32());
    }

    [Fact]
    public void ListAndSplitButtons_IgnoreBubbledEventsFromOtherElements()
    {
        var listCalls = 0;
        var buttonCalls = 0;
        var anchorCalls = 0;
        var resetCalls = 0;
        var list = Render<OkFvMasterDetailList>(p => p.Add(x => x.SelectionChanged, _ => listCalls++));
        var button = Render<OkFvSplitButton>(p => p.Add(x => x.Toggle, _ => buttonCalls++));
        var anchor = Render<OkFvSplitButtonAnchor>(p => p.Add(x => x.Toggle, _ => anchorCalls++));
        var bulk = Render<OkFvBulkEditField>(p => p.Add(x => x.Reset, () => resetCalls++));
        var listElement = list.Find("ok-fv-master-detail-list");
        var buttonElement = button.Find("ok-fv-split-button");
        var anchorElement = anchor.Find("ok-fv-split-button-anchor");
        var bulkElement = bulk.Find("ok-fv-bulk-edit-field");

        listElement.TriggerEvent("onokfvlistchange", new FvListChangeEventArgs { Source = "nested", Value = "wrong" });
        buttonElement.TriggerEvent("onokfvtoggle", new FvToggleEventArgs { Source = "nested" });
        anchorElement.TriggerEvent("onokfvtoggle", new FvToggleEventArgs { Source = "nested" });
        bulkElement.TriggerEvent("onokfvreset", new FvEventArgs { Source = "nested" });
        Assert.Equal(0, listCalls);
        Assert.Equal(0, buttonCalls);
        Assert.Equal(0, anchorCalls);
        Assert.Equal(0, resetCalls);

        listElement.TriggerEvent("onokfvlistchange", new FvListChangeEventArgs { Source = listElement.GetAttribute("data-ok-fv-event-source"), Value = "right" });
        buttonElement.TriggerEvent("onokfvtoggle", new FvToggleEventArgs { Source = buttonElement.GetAttribute("data-ok-fv-event-source"), Open = true });
        anchorElement.TriggerEvent("onokfvtoggle", new FvToggleEventArgs { Source = anchorElement.GetAttribute("data-ok-fv-event-source"), Open = true });
        bulkElement.TriggerEvent("onokfvreset", new FvEventArgs { Source = bulkElement.GetAttribute("data-ok-fv-event-source") });
        Assert.Equal(1, listCalls);
        Assert.Equal(1, buttonCalls);
        Assert.Equal(1, anchorCalls);
        Assert.Equal(1, resetCalls);
    }
}
