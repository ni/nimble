import { html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../../utilities/tests/fixture';
import type { Combobox } from '../..';
import { ComboboxPageObject } from '../combobox.pageobject';

async function setup(): Promise<Fixture<Combobox>> {
    const viewTemplate = html`
        <nimble-combobox>
            <nimble-list-option value="one">One</nimble-list-option>
            <nimble-list-option value="two">Two</nimble-list-option>
        </nimble-combobox>
    `;
    return await fixture<Combobox>(viewTemplate);
}

async function setupWithLabel(): Promise<Fixture<Combobox>> {
    const viewTemplate = html`
        <nimble-combobox>
            Custom Label Text
            <nimble-list-option value="one">One</nimble-list-option>
            <nimble-list-option value="two">Two</nimble-list-option>
        </nimble-combobox>
    `;
    return await fixture<Combobox>(viewTemplate);
}

describe('Combobox Page Object', () => {
    it('getLabelText() returns empty string if no label provided', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new ComboboxPageObject(element);

        await connect();

        expect(pageObject.getLabelText()).toBe('');

        await disconnect();
    });

    it('getLabelText() returns label text when present', async () => {
        const { element, connect, disconnect } = await setupWithLabel();
        const pageObject = new ComboboxPageObject(element);

        await connect();

        expect(pageObject.getLabelText()).toBe('Custom Label Text');

        await disconnect();
    });
});
