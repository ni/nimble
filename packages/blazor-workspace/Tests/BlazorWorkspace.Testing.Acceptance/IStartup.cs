using System.Reflection;

namespace BlazorWorkspace.Testing.Acceptance;

public interface IStartup
{
    void AddAdditionalAssemblies(params Assembly[] assemblies);
    void ConfigureServices(IServiceCollection services);
    void Configure(IApplicationBuilder app);
}
