namespace NimbleBlazor.Tests.Acceptance;

/// <summary>
/// Test fixture which starts up a Blazor Server web server
/// </summary>
public class BlazorServerWebHostFixture : WebHostServerFixture
{
    protected override IHost CreateWebHost()
    {
        return new HostBuilder()
            .ConfigureWebHost(webHostBuilder => webHostBuilder
                .UseKestrel()
                .UseStartup<Startup>()
                .UseStaticWebAssets()
                .UseUrls("http://127.0.0.1:0")) // Pick a port dynamically
            .Build();
    }
}
