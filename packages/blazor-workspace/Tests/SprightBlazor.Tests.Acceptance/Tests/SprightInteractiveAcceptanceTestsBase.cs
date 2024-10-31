using BlazorWorkspace.Testing.Acceptance;
using Xunit;

namespace SprightBlazor.Tests.Acceptance;

public abstract class SprightInteractiveAcceptanceTestsBase : AcceptanceTestsBase, IClassFixture<SprightBlazorWebHostServerFixture>
{
    protected SprightInteractiveAcceptanceTestsBase(
        PlaywrightFixture playwrightFixture,
        SprightBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture)
    {
        ServerAddress = blazorServerClassFixture.ServerAddress!;
    }

    protected override Uri ServerAddress { get; }
    protected override string ComponentLibraryInitializationTestJavaScript => "window.SprightBlazor && window.SprightBlazor.isReady()";
}
