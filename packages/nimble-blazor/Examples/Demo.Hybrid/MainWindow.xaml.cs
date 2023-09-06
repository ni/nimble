namespace Demo.Hybrid
{
    using System.Windows;
    using Microsoft.Extensions.DependencyInjection;

    /// <summary>
    /// Interaction logic for MainWindow.xaml.
    /// </summary>
    public partial class MainWindow : Window
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MainWindow"/> class.
        /// </summary>
        public MainWindow()
        {
            this.InitializeComponent();
#if RELEASE
            this.Loaded += this.MainWindow_Loaded;
#endif
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddWpfBlazorWebView();
            serviceCollection.AddBlazorWebViewDeveloperTools();
#pragma warning disable NI1004
            this.Resources.Add("services", serviceCollection.BuildServiceProvider());
#pragma warning restore NI1004
        }

#if RELEASE
#pragma warning disable VSTHRD100 // Avoid async void methods
        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
#pragma warning restore VSTHRD100 // Avoid async void methods
        {
            // We recommend for Release versions to turn off browser accelerator keys
            // for applications that are meant to operate more like a native desktop app.
            await this.blazorWebView.WebView.EnsureCoreWebView2Async().ConfigureAwait(true);
            var settings = this.blazorWebView.WebView.CoreWebView2.Settings;
            settings.AreBrowserAcceleratorKeysEnabled = false;
        }
#endif
    }
}
