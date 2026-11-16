using System.Text.Json;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace OkBlazor.Tests.Unit.Components;

public class OkFvBindingsTests : BunitTestBase
{
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

        component.Find("ok-fv-multi-select").TriggerEvent("onokfvmultiselectinput", new FvMultiSelectEventArgs { SelectedValues = ["wrong"] });
        layout.Find("ok-fv-split-layout").TriggerEvent("onokfvpositioninput", new FvPositionEventArgs { Source = "input", Position = 99 });
        Assert.Null(selected);
        Assert.Null(position);
        component.Find("ok-fv-multi-select").TriggerEvent("onokfvmultiselectinput", new FvMultiSelectEventArgs { SelectedValues = ["b"], IsMultiSelect = true });
        layout.Find("ok-fv-split-layout").TriggerEvent("onokfvpositioninput", new FvPositionEventArgs { Source = "ok-fv-split-layout", Position = 40 });
        bar.Find("ok-fv-edit-commit-bar").TriggerEvent("onokfvsave", EventArgs.Empty);
        filter.Find("ok-fv-filter-bar").TriggerEvent("onokfveditfilter", new FvFilterBarEventArgs
        {
            Query = JsonSerializer.SerializeToElement(new { version = 1, root = (object?)null })
        });

        Assert.Equal(["b"], selected);
        Assert.True(saved);
        Assert.Equal(40, position);
        Assert.Equal(1, query!.Value.GetProperty("version").GetInt32());
    }
}
