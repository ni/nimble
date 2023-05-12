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
            var hostFixture = new BlazorServerWebHostFixture();
            hostFixture.InitializeAsync().Wait();
            Console.WriteLine($"Listening at {hostFixture.ServerAddress!.AbsoluteUri}, press any key to exit.");
            Console.ReadKey();
        }
    }
}
