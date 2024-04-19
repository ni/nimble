﻿using System.Text.Json.Serialization;

namespace NimbleBlazor;

public interface IWaferMapValidity
{
    public bool InvalidGridDimensions { get; }
}

internal sealed class WaferMapValidity : IWaferMapValidity
{
    [JsonPropertyName("invalidGridDimensions")]
    public bool InvalidGridDimensions { get; set; }
}