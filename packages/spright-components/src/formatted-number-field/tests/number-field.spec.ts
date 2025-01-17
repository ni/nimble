import { html } from '@microsoft/fast-element';
import {
    LabelProviderCore,
    labelProviderCoreTag
} from '@ni/nimble-components/dist/esm/label-provider/core';
import {
    processUpdates,
    waitForUpdatesAsync
} from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { ThemeProvider, themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';
import { fixture, type Fixture } from '@ni/nimble-components/dist/esm/utilities/tests/fixture';
import { NumberField, numberFieldTag } from '..';

async function setup(): Promise<Fixture<NumberField>> {
    return await fixture<NumberField>(
        html`<${numberFieldTag}></${numberFieldTag}>`
    );
}

async function setupWithLabelProvider(): Promise<Fixture<ThemeProvider>> {
    return await fixture<ThemeProvider>(html`
        <${themeProviderTag}>
            <${labelProviderCoreTag}></${labelProviderCoreTag}>
            <${numberFieldTag}></${numberFieldTag}>
        </${themeProviderTag}>
    `);
}

describe('NumberField', () => {
    let element: NumberField;
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
        expect(document.createElement(numberFieldTag)).toBeInstanceOf(
            NumberField
        );
    });

    it('prevents inc/dec buttons from being focusable', () => {
        const buttons = Array.from(
            element.shadowRoot!.querySelectorAll('.step-up-down-button')
        );
        expect(
            buttons.every(x => (x as HTMLElement).tabIndex === -1)
        ).toBeTrue();
    });

    it('hides inc/dec buttons from a11y tree', () => {
        const buttons = Array.from(
            element.shadowRoot!.querySelectorAll('.step-up-down-button')
        );
        expect(
            buttons.every(x => (x as HTMLElement).ariaHidden === 'true')
        ).toBeTrue();
    });

    it('should set "aria-required" to true when "required-visible" is true', () => {
        element.requiredVisible = true;
        processUpdates();
        expect(element.control.getAttribute('aria-required')).toBe('true');
    });

    it('should set "aria-required" to false when "required-visible" is false', () => {
        element.requiredVisible = false;
        processUpdates();
        expect(element.control.getAttribute('aria-required')).toBe('false');
    });
});

describe('NumberField with LabelProviderCore', () => {
    let element: NumberField;
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
        element = themeProvider.querySelector(numberFieldTag)!;
        labelProvider = themeProvider.querySelector(labelProviderCoreTag)!;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('uses CoreLabelProvider numericIncrement/numericDecrement labels for the inc/dec buttons', async () => {
        labelProvider.numericIncrement = 'Customized Increment';
        labelProvider.numericDecrement = 'Customized Decrement';
        await waitForUpdatesAsync();

        const actualIncrementText = element
            .shadowRoot!.querySelector('slot[name="step-up-glyph"]')!
            .textContent!.trim();
        expect(actualIncrementText).toEqual('Customized Increment');
        const actualDecrementText = element
            .shadowRoot!.querySelector('slot[name="step-down-glyph"]')!
            .textContent!.trim();
        expect(actualDecrementText).toEqual('Customized Decrement');
    });
});
