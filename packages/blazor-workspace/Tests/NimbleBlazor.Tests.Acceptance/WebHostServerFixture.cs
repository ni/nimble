using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance;

public abstract class WebHostServerFixture : IAsyncLifetime, IDisposable
{
    private IHost? _host;

    public Uri? ServerAddress { get; set; }

    public async Task InitializeAsync()
    {
        _host = CreateWebHost();
        await _host.StartAsync();

        var server = _host.Services.GetRequiredService<IServer>();
        var addressFeature = server.Features.Get<IServerAddressesFeature>();
        ServerAddress = new Uri(addressFeature!.Addresses.First());
    }

    public async Task DisposeAsync()
    {
        if (_host != null)
        {
            await _host.StopAsync();
            _host.Dispose();
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            _host?.Dispose();
        }
    }

    protected abstract IHost CreateWebHost();
}
