using System.Windows;

namespace Demo.Hybrid;

/// <summary>
/// Interaction logic for App.xaml.
/// </summary>
[SuppressMessage("Design", "CA1515:Consider making public types internal", Justification = "WPF requires the App entry-point class to be public for XAML code generation.")]
public partial class App : Application
{
}
