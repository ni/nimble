﻿using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class TableColumnMappingTests : NimbleInteractiveAcceptanceTestsBase
{
    public TableColumnMappingTests(PlaywrightFixture playwrightFixture, NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task TableColumnMapping_BoolKeyAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/TableColumnMappingBoolKey"))
        {
            var page = pageWrapper.Page;
            var table = page.Locator("nimble-table");
            await Assertions.Expect(table).ToBeVisibleAsync();

            var icon = table.Locator("nimble-icon-check");
            await Assertions.Expect(icon).ToHaveCountAsync(1);
            await Assertions.Expect(icon).ToHaveAttributeAsync("severity", "success");
            var spinner = table.Locator("nimble-spinner");
            await Assertions.Expect(spinner).ToHaveCountAsync(1);
        }
    }
}