using System.Threading.Tasks;
using BlazorWorkspace.Testing.Unit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.JSInterop;
using Xunit;

namespace OkBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="OkTsIconDynamic"/>.
/// </summary>
public class OkTsIconDynamicTests : BunitTestBase
{
    [Fact]
    public async Task OkTsIconDynamic_RegisterIconDynamicAsync_InvokesRegisterIconDynamicAsync()
    {
        var javascriptRuntime = Services.GetRequiredService<IJSRuntime>();
        const string tagName = "ok-ts-icon-dynamic-awesome";
        const string url = "data:image/png;base64,AAAA";

        await OkTsIconDynamic.RegisterIconDynamicAsync(javascriptRuntime, tagName, url);

        var invocation = Assert.Single(JSInterop.Invocations);
        Assert.Equal("OkBlazor.TsIconDynamic.registerIconDynamic", invocation.Identifier);
        Assert.Equal(tagName, invocation.Arguments[0]);
        Assert.Equal(url, invocation.Arguments[1]);
    }
}
