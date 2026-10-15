using BlazorWorkspace.Testing.Acceptance;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance;

public abstract class NimbleAcceptanceTestsBase : AcceptanceTestsBase, IClassFixture<NimbleBlazorWebHostServerFixture>
{
    private readonly NimbleBlazorWebHostServerFixture _blazorServerClassFixture;

    protected NimbleAcceptanceTestsBase(NimbleBlazorWebHostServerFixture blazorServerClassFixture)
    {
        _blazorServerClassFixture = blazorServerClassFixture;
    }

    protected override Uri ServerAddress => _blazorServerClassFixture.ServerAddress!;
}
