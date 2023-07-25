import { html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Banner, bannerTag } from '..';
import { BannerSeverity } from '../types';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { createEventListener } from '../../utilities/tests/component';
import { themeProviderTag, type ThemeProvider } from '../../theme-provider';
import {
    LabelProviderCore,
    labelProviderCoreTag
} from '../../label-provider/core';
import { buttonTag } from '../../button';

async function setup(): Promise<Fixture<Banner>> {
    return fixture<Banner>(html`
        <nimble-banner>
            <span slot="title">Title</span>
            Message text
        </nimble-banner>
    `);
}

async function setupWithLabelProvider(): Promise<Fixture<ThemeProvider>> {
    return fixture<ThemeProvider>(html`
        <${themeProviderTag}>
            <${labelProviderCoreTag}></${labelProviderCoreTag}>
            <nimble-banner>
                <span slot="title">Title</span>
                Message text
            </nimble-banner>
        </${themeProviderTag}>
    `);
}

describe('Banner', () => {
    let element: Banner;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-banner')).toBeInstanceOf(Banner);
    });

    it("should initialize 'open' to false", () => {
        expect(element.open).toBeFalse();
    });

    it("should be hidden when 'open' is false", async () => {
        element.open = false;
        await waitForUpdatesAsync();
        expect(getComputedStyle(element).display).toBe('none');
    });

    it("should be visible when 'open' is true", async () => {
        element.open = true;
        await waitForUpdatesAsync();
        expect(getComputedStyle(element).display).not.toBe('none');
    });

    it("should fire 'toggle' when 'open' is changed", async () => {
        element.open = false;
        const toggleListener = createEventListener(element, 'toggle');
        element.open = true;
        await toggleListener.promise;
        expect(toggleListener.spy).toHaveBeenCalledOnceWith(
            new CustomEvent('toggle', {
                detail: { oldState: false, newState: true }
            })
        );
    });

    it("should remove 'open' when dismiss button is clicked", () => {
        element.open = true;
        element.shadowRoot?.querySelector('nimble-button')?.click();
        expect(element.open).toBeFalse();
    });

    it("should initialize 'severity' to default", () => {
        expect(element.severity).toBe(BannerSeverity.default);
    });

    it("should hide dismiss button when 'preventDismiss' set", async () => {
        element.preventDismiss = true;
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('nimble-button')).toBeNull();
    });

    it("should default label of dismiss button to 'Close'", () => {
        expect(
            element.shadowRoot
                ?.querySelector('nimble-button')
                ?.innerText.includes('Close')
        ).toBeTrue();
    });

    it("should set the 'role' to 'status'", () => {
        expect(
            element.shadowRoot
                ?.querySelector('.container')
                ?.getAttribute('role')
        ).toBe('status');
    });
});

describe('Banner with LabelProviderCore', () => {
    let element: Banner;
    let labelProvider: LabelProviderCore;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        let themeProvider: ThemeProvider;
        ({
            element: themeProvider,
            connect,
            disconnect
        } = await setupWithLabelProvider());
        await connect();
        element = themeProvider.querySelector(bannerTag)!;
        labelProvider = themeProvider.querySelector(labelProviderCoreTag)!;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('uses CoreLabelProvider popupDismissLabel for the close button label', async () => {
        labelProvider.popupDismiss = 'Customized Close';
        await waitForUpdatesAsync();

        const actualCloseButtonText = element
            .shadowRoot!.querySelector('.dismiss')!
            .querySelector(buttonTag)!
            .textContent!.trim();
        expect(actualCloseButtonText).toBe('Customized Close');
    });
});
