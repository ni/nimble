using BlazorWorkspace.Testing.Acceptance;
using Xunit;

namespace OkBlazor.Tests.Acceptance;

public abstract class OkInteractiveAcceptanceTestsBase : AcceptanceTestsBase, IClassFixture<OkBlazorWebHostServerFixture>
{
    protected OkInteractiveAcceptanceTestsBase(
        PlaywrightFixture playwrightFixture,
        OkBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture)
    {
        ServerAddress = blazorServerClassFixture.ServerAddress!;
    }

    protected override Uri ServerAddress { get; }
    protected override string ComponentLibraryInitializationTestJavaScript => "window.OkBlazor && window.OkBlazor.isReady()";
}
