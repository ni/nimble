﻿using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class DialogTests : NimbleInteractiveAcceptanceTestsBase
{
    public DialogTests(PlaywrightFixture playwrightFixture, NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task Dialog_CanOpenAndCloseAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/DialogOpenAndClose"))
        {
            var page = pageWrapper.Page;
            var openButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Open" });
            await openButton.ClickAsync();

            var dialog = page.Locator("nimble-dialog");
            var innerDialog = dialog.GetByRole(AriaRole.Dialog);
            await Assertions.Expect(innerDialog).ToBeVisibleAsync();
            await Assertions.Expect(dialog).ToContainTextAsync("Example Dialog");

            var closeButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Close" });
            await closeButton.ClickAsync();

            await Assertions.Expect(innerDialog).Not.ToBeVisibleAsync();

            var textField = page.Locator("nimble-text-field");
            await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "Custom Close Reason");
        }
    }
}
