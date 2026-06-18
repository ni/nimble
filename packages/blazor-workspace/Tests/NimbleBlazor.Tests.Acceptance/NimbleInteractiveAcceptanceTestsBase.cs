using BlazorWorkspace.Testing.Acceptance;

namespace NimbleBlazor.Tests.Acceptance;

public abstract class NimbleInteractiveAcceptanceTestsBase : NimbleAcceptanceTestsBase
{
    protected NimbleInteractiveAcceptanceTestsBase(
        PlaywrightFixture playwrightFixture,
        NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    {
    }

    protected override string ComponentLibraryInitializationTestJavaScript => "window.NimbleBlazor && window.NimbleBlazor.isReady()";
}
