using System;
using System.Globalization;

namespace NimbleBlazor.Tests.Unit;

internal sealed class CultureScope : IDisposable
{
    private readonly CultureInfo _originalCulture;

    public CultureScope(string cultureName)
    {
        _originalCulture = CultureInfo.CurrentCulture;
        CultureInfo.CurrentCulture = new CultureInfo(cultureName);
    }

    public void Dispose()
    {
        CultureInfo.CurrentCulture = _originalCulture;
    }
}