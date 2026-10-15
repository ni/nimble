namespace NimbleBlazor.Tests.Acceptance;

public abstract class NimbleInteractiveAcceptanceTestsBase : NimbleAcceptanceTestsBase
{
    protected NimbleInteractiveAcceptanceTestsBase(NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(blazorServerClassFixture)
    {
    }

    protected override string ComponentLibraryInitializationTestJavaScript => "window.NimbleBlazor && window.NimbleBlazor.isReady()";
}
