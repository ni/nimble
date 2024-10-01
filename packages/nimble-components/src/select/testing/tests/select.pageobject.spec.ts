import { html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../../utilities/tests/fixture';
import { SelectPageObject } from '../select.pageobject';
import type { Select } from '../..';

async function setup(): Promise<Fixture<Select>> {
    const viewTemplate = html`
        <nimble-select>
            <nimble-list-option value="one">One</nimble-list-option>
            <nimble-list-option value="two">Two</nimble-list-option>
        </nimble-select>
    `;
    return await fixture<Select>(viewTemplate);
}

async function setupWithLabel(): Promise<Fixture<Select>> {
    const viewTemplate = html`
        <nimble-select>
            Custom Label Text
            <nimble-list-option value="one">One</nimble-list-option>
            <nimble-list-option value="two">Two</nimble-list-option>
        </nimble-select>
    `;
    return await fixture<Select>(viewTemplate);
}

describe('Select Page Object', () => {
    it('getLabelText() returns empty string when no label present', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new SelectPageObject(element);

        await connect();

        expect(pageObject.getLabelText()).toBe('');

        await disconnect();
    });

    it('getLabelText() returns label text when provided', async () => {
        const { element, connect, disconnect } = await setupWithLabel();
        const pageObject = new SelectPageObject(element);

        await connect();

        expect(pageObject.getLabelText()).toBe('Custom Label Text');

        await disconnect();
    });
});
