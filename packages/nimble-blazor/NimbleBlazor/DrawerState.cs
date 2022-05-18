﻿namespace NimbleBlazor;

public enum DrawerState
{
    Opening,
    Opened,
    Closing,
    Closed
}

internal static class DrawerStateExtensions
{
    private static readonly Dictionary<DrawerState, string> _drawerStateValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<DrawerState>();

    public static string? ToAttributeValue(this DrawerState? value) => value == null ? null : _drawerStateValues[value.Value];
}
