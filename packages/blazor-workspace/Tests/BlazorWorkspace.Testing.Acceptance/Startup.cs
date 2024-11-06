using System.Reflection;

namespace BlazorWorkspace.Testing.Acceptance;

/// <summary>
/// Web server initialization for Blazor Server
/// </summary>
public sealed class Startup<TApp> : IStartup
{
    private readonly List<Assembly> _additionalAssemblies = new List<Assembly>();

    public void AddAdditionalAssemblies(params Assembly[] assemblies)
    {
        _additionalAssemblies.AddRange(assemblies);
    }

    public void ConfigureServices(IServiceCollection services)
    {
        var razorBuilder = services.AddRazorComponents();
        razorBuilder.AddInteractiveServerComponents();
        razorBuilder.AddInteractiveWebAssemblyComponents();
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseDeveloperExceptionPage();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseAntiforgery();
        app.UseStatusCodePages();
        app.UseEndpoints(app =>
        {
            app.MapRazorComponents<TApp>()
                .AddAdditionalAssemblies([.. _additionalAssemblies])
                .AddInteractiveServerRenderMode()
                .AddInteractiveWebAssemblyRenderMode();
        });
    }
}