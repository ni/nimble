using BlazorWorkspace.Testing.Acceptance;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance;

public abstract class NimbleAcceptanceTestsBase : AcceptanceTestsBase, IClassFixture<NimbleBlazorWebHostServerFixture>
{
    protected NimbleAcceptanceTestsBase(
        PlaywrightFixture playwrightFixture,
        NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture)
    {
        ServerAddress = blazorServerClassFixture.ServerAddress!;
    }

    protected override Uri ServerAddress { get; }
    protected override string ComponentLibraryInitializationTestJavaScript => "window.NimbleBlazor && window.NimbleBlazor.hasInitialized === true";
}
