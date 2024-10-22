import { html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../../utilities/tests/fixture';
import { SelectPageObject } from '../select.pageobject';
import { selectTag, type Select } from '../..';
import { listOptionTag } from '../../../list-option';

async function setup(): Promise<Fixture<Select>> {
    const viewTemplate = html`
        <${selectTag}>
            <${listOptionTag} value="one">One</${listOptionTag}>
            <${listOptionTag} value="two">Two</${listOptionTag}>
        </${selectTag}>
    `;
    return await fixture<Select>(viewTemplate);
}

async function setupWithLabel(): Promise<Fixture<Select>> {
    const viewTemplate = html`
        <${selectTag}>
            Custom Label Text
            <${listOptionTag} value="one">One</${listOptionTag}>
            <${listOptionTag} value="two">Two</${listOptionTag}>
        </${selectTag}>
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
