namespace NimbleBlazor.Tests.Acceptance
{
    /// <summary>
    /// Main entry point which spins up the web server and allows loading the Razor fixtures/pages in a browser
    /// without running a specific test.
    /// </summary>
    public static class Program
    {
        public static void Main(string[] arguments)
        {
            var builder = WebApplication.CreateBuilder(arguments);

            var startup = new Startup(builder.Configuration);
            startup.ConfigureServices(builder.Services);
            var app = builder.Build();
            startup.Configure(app);

            app.Run();
        }
    }
}
