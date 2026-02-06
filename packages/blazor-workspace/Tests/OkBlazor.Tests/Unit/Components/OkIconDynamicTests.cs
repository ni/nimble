using System.Threading.Tasks;
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.JSInterop;
using Xunit;

namespace OkBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="OkIconDynamic"/>.
/// </summary>
public class OkIconDynamicTests
{
    [Fact]
    public async Task OkIconDynamic_RegisterIconDynamicAsync_InvokesRegisterIconDynamicAsync()
    {
        using var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var javascriptRuntime = context.Services.GetRequiredService<IJSRuntime>();
        const string name = "awesome";
        const string url = "data:image/png;base64,AAAA";

        await OkIconDynamic.RegisterIconDynamicAsync(javascriptRuntime, name, url);

        var invocation = Assert.Single(context.JSInterop.Invocations);
        Assert.Equal("OkBlazor.IconDynamic.registerIconDynamic", invocation.Identifier);
        Assert.Equal(name, invocation.Arguments[0]);
        Assert.Equal(url, invocation.Arguments[1]);
    }
}
