using BlazorWorkspace.Testing.Acceptance;
using Xunit;

namespace SprightBlazor.Tests.Acceptance;

public abstract class SprightInteractiveAcceptanceTestsBase : AcceptanceTestsBase, IClassFixture<SprightBlazorWebHostServerFixture>
{
    private readonly SprightBlazorWebHostServerFixture _blazorServerClassFixture;

    protected SprightInteractiveAcceptanceTestsBase(SprightBlazorWebHostServerFixture blazorServerClassFixture)
    {
        _blazorServerClassFixture = blazorServerClassFixture;
    }

    protected override Uri ServerAddress => _blazorServerClassFixture.ServerAddress!;

    protected override string ComponentLibraryInitializationTestJavaScript => "window.SprightBlazor && window.SprightBlazor.isReady()";
}
