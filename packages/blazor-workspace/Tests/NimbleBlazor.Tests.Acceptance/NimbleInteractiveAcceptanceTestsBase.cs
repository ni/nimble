using BlazorWorkspace.Testing.Acceptance;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance;

public abstract class NimbleInteractiveAcceptanceTestsBase : NimbleAcceptanceTestsBase
{
    protected NimbleInteractiveAcceptanceTestsBase(
        PlaywrightFixture playwrightFixture,
        NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    {
    }

    protected override string ComponentLibraryInitializationTestJavaScript => "window.NimbleBlazor && window.NimbleBlazor.hasRegisteredEvents === true && window.NimbleBlazor.hasRuntimeStarted === true";
}
