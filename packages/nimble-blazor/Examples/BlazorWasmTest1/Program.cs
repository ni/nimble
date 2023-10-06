#pragma warning disable SA1200 // Using directives should be placed correctly
#pragma warning disable NI1004 // Do not use string literals in code
using Demo.Shared.Pages;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.RootComponents.RegisterCustomElement<ComponentsDemo>("nimbleblazorexample-components-demo");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

await builder.Build().RunAsync().ConfigureAwait(true);
#pragma warning restore NI1004 // Do not use string literals in code
#pragma warning restore SA1200 // Using directives should be placed correctly