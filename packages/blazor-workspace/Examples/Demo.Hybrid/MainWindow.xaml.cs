using System.Windows;
using Microsoft.Extensions.DependencyInjection;

namespace Demo.Hybrid;

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
        InitializeComponent();
#if RELEASE
        Loaded += MainWindow_Loaded;
#endif
        var serviceCollection = new ServiceCollection();
        serviceCollection.AddWpfBlazorWebView();
        serviceCollection.AddBlazorWebViewDeveloperTools();
        Resources.Add("services", serviceCollection.BuildServiceProvider());
    }

#if RELEASE
#pragma warning disable VSTHRD100 // Avoid async void methods
    private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
#pragma warning restore VSTHRD100 // Avoid async void methods
    {
        // We recommend for Release versions to turn off browser accelerator keys
        // for applications that are meant to operate more like a native desktop app.
        await blazorWebView.WebView.EnsureCoreWebView2Async().ConfigureAwait(true);
        var settings = blazorWebView.WebView.CoreWebView2.Settings;
        settings.AreBrowserAcceleratorKeysEnabled = false;
    }
#endif
}
