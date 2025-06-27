import { html } from '@ni/fast-element';
import { parameterizeSpec, parameterizeSuite } from '@ni/jasmine-parameterized';
import { NumberField, numberFieldTag } from '..';
import { NumberFieldPageObject } from '../testing/number-field.pageobject';
import {
    LabelProviderCore,
    labelProviderCoreTag
} from '../../label-provider/core';
import {
    processUpdates,
    waitForUpdatesAsync
} from '../../testing/async-helpers';
import { ThemeProvider, themeProviderTag } from '../../theme-provider';
import { fixture, type Fixture } from '../../utilities/tests/fixture';

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
    let page: NumberFieldPageObject;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        page = new NumberFieldPageObject(element);
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

    it('disallows input of characters that cannot be used in a number', () => {
        page.setText('0123+-.abcdeABCDE,!@#$%^&*()_[]{}|;:\'"<>?/456789');
        expect(page.getDisplayValue()).toEqual('0123+-.e456789');
    });

    const badInputCases = [
        { name: '01...2', expectedValue: '1' },
        { name: '0...2', expectedValue: '0' },
        { name: '...2', expectedValue: '' },
        { name: '.2', expectedValue: '0.2' },
        { name: '++1', expectedValue: '' },
        { name: '+1', expectedValue: '1' },
        { name: '--1', expectedValue: '' },
        { name: '-1', expectedValue: '-1' },
        { name: '1.12ee4', expectedValue: '1.12' },
        { name: '1.12e4', expectedValue: '11200' },
        { name: '112e4', expectedValue: '1120000' }
    ] as const;
    parameterizeSpec(badInputCases, (spec, name, value) => {
        spec(
            `sets value to float-parsable leading portion of input string "${name}"`,
            () => {
                page.setText(name);
                expect(element.value).toEqual(value.expectedValue);
            }
        );
    });
});

describe('NumberField localization', () => {
    let element: NumberField;
    let page: NumberFieldPageObject;
    let themeProvider: ThemeProvider;
    let disconnect: () => Promise<void>;

    async function setupWithLocaleAndConnect(
        locale: string,
        defaultValue?: string
    ): Promise<void> {
        let connect: () => Promise<void>;
        ({
            element: themeProvider,
            connect,
            disconnect
        } = await fixture<ThemeProvider>(html`
            <${themeProviderTag} lang="${locale}">
                <${numberFieldTag} ${defaultValue !== null ? `value="${defaultValue}"` : ''}></${numberFieldTag}>
            </${themeProviderTag}>
        `));
        await connect();
        element = themeProvider.querySelector(numberFieldTag)!;
        page = new NumberFieldPageObject(element);
    }

    afterEach(async () => {
        await disconnect();
    });

    const localeCases = [
        { name: 'en-US', expectedSeparator: '.' },
        { name: 'zh', expectedSeparator: '.' },
        { name: 'ja', expectedSeparator: '.' },
        { name: 'fr-CA', expectedSeparator: ',' },
        { name: 'de', expectedSeparator: ',' }
    ] as const;
    parameterizeSuite(localeCases, (suite, name, value) => {
        suite(`for "${name}"`, () => {
            it('displays correct separator', async () => {
                const testValue = '1000.1';
                const expectedValue = testValue.replace(
                    '.',
                    value.expectedSeparator
                );
                await setupWithLocaleAndConnect(name, testValue);
                expect(page.getDisplayValue()).toEqual(expectedValue);
            });

            it('disallows input of wrong separator', async () => {
                await setupWithLocaleAndConnect(name);
                const disallowedSeparator = value.expectedSeparator === '.' ? ',' : '.';
                page.inputText(`10${disallowedSeparator}1`);
                expect(page.getDisplayValue()).toEqual('101');
            });
        });
    });

    it('updates displayed separator when "lang" on theme provider changes', async () => {
        const valueWithDot = '1000.1';
        const valueWithComma = '1000,1';
        await setupWithLocaleAndConnect('en', valueWithDot);
        expect(page.getDisplayValue()).toEqual(valueWithDot);

        themeProvider.lang = 'de';
        await waitForUpdatesAsync();

        expect(page.getDisplayValue()).toEqual(valueWithComma);
    });

    it('updates disallowed input when "lang" on theme provider changes', async () => {
        await setupWithLocaleAndConnect('en');
        page.setText(',1');
        expect(page.getDisplayValue()).toEqual('1');

        themeProvider.lang = 'de';
        await waitForUpdatesAsync();

        page.setText('.2');
        expect(page.getDisplayValue()).toEqual('2');
    });

    it('uses dot in value string, even when locale uses a comma', async () => {
        await setupWithLocaleAndConnect('fr');
        page.setText('1,1');

        expect(element.value).toEqual('1.1');
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
