using BlazorWorkspace.Testing.Acceptance;
using Xunit;

namespace OkBlazor.Tests.Acceptance;

public abstract class OkInteractiveAcceptanceTestsBase : AcceptanceTestsBase, IClassFixture<OkBlazorWebHostServerFixture>
{
    private readonly OkBlazorWebHostServerFixture _blazorServerClassFixture;

    protected OkInteractiveAcceptanceTestsBase(OkBlazorWebHostServerFixture blazorServerClassFixture)
    {
        _blazorServerClassFixture = blazorServerClassFixture;
    }

    protected override Uri ServerAddress => _blazorServerClassFixture.ServerAddress!;

    protected override string ComponentLibraryInitializationTestJavaScript => "window.OkBlazor && window.OkBlazor.isReady()";
}
