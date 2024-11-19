import { html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../../utilities/tests/fixture';
import { comboboxTag, type Combobox } from '../..';
import { ComboboxPageObject } from '../combobox.pageobject';
import { listOptionTag } from '../../../list-option';

async function setup(): Promise<Fixture<Combobox>> {
    const viewTemplate = html`
        <${comboboxTag}>
            <${listOptionTag} value="one">One</${listOptionTag}>
            <${listOptionTag} value="two">Two</${listOptionTag}>
        </${comboboxTag}>
    `;
    return await fixture<Combobox>(viewTemplate);
}

async function setupWithLabel(): Promise<Fixture<Combobox>> {
    const viewTemplate = html`
        <${comboboxTag}>
            Custom Label Text
            <${listOptionTag} value="one">One</${listOptionTag}>
            <${listOptionTag} value="two">Two</${listOptionTag}>
        </${comboboxTag}>
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
