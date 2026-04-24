using System.Threading.Tasks;
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.JSInterop;
using Xunit;

namespace OkBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="OkTsIconDynamic"/>.
/// </summary>
public class OkTsIconDynamicTests
{
    [Fact]
    public async Task OkTsIconDynamic_RegisterIconDynamicAsync_InvokesRegisterIconDynamicAsync()
    {
        using var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var javascriptRuntime = context.Services.GetRequiredService<IJSRuntime>();
        const string tagName = "ok-ts-icon-dynamic-awesome";
        const string url = "data:image/png;base64,AAAA";

        await OkTsIconDynamic.RegisterIconDynamicAsync(javascriptRuntime, tagName, url);

        var invocation = Assert.Single(context.JSInterop.Invocations);
        Assert.Equal("OkBlazor.TsIconDynamic.registerIconDynamic", invocation.Identifier);
        Assert.Equal(tagName, invocation.Arguments[0]);
        Assert.Equal(url, invocation.Arguments[1]);
    }
}
