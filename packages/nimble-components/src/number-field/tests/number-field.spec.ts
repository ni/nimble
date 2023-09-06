import { html } from '@microsoft/fast-element';
import { NumberField, numberFieldTag } from '..';
import {
    LabelProviderCore,
    labelProviderCoreTag
} from '../../label-provider/core';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { ThemeProvider, themeProviderTag } from '../../theme-provider';
import { fixture, type Fixture } from '../../utilities/tests/fixture';

async function setupWithLabelProvider(): Promise<Fixture<ThemeProvider>> {
    return fixture<ThemeProvider>(html`
        <${themeProviderTag}>
            <${labelProviderCoreTag}></${labelProviderCoreTag}>
            <${numberFieldTag}></${numberFieldTag}>
        </${themeProviderTag}>
    `);
}

describe('NumberField', () => {
    it('should export its tag', () => {
        expect(numberFieldTag).toBe('nimble-number-field');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-number-field')).toBeInstanceOf(
            NumberField
        );
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
