import { html } from '@microsoft/fast-element';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { SelectPageObject } from '../select.pageobject';
import { selectTag, type Select } from '../..';
import { listOptionTag } from '../../../list-option';
import { FilterMode } from '../../types';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';

async function setup(): Promise<Fixture<Select>> {
    const viewTemplate = html`
        <${selectTag}>
            <${listOptionTag} value="one">One</${listOptionTag}>
            <${listOptionTag} value="two">Two</${listOptionTag}>
            <${listOptionTag} value="oneA">OneA</${listOptionTag}>
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

    it('clickOption(index) selects correct option when some options are removed from DOM through manual filtering', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new SelectPageObject(element);
        await connect();

        element.filterMode = FilterMode.manual;
        await waitForUpdatesAsync();
        pageObject.clickOptionWithDisplayText('Two');
        pageObject.clickSelect();
        pageObject.setFilter('one'); // fake trigger of manual filtering
        element.options[1]?.remove();
        pageObject.clickOption(1);

        expect(pageObject.getSelectedOption()?.value).toBe('oneA');

        await disconnect();
    });

    it('clickOption(index) selects correct option when some options are filtered with standard filtering', async () => {
        const { element, connect, disconnect } = await setup();
        const pageObject = new SelectPageObject(element);
        await connect();

        element.filterMode = FilterMode.standard;
        await waitForUpdatesAsync();
        pageObject.clickOptionWithDisplayText('Two');
        pageObject.clickSelect();
        pageObject.setFilter('one');
        pageObject.clickOption(1);

        expect(pageObject.getSelectedOption()?.value).toBe('oneA');

        await disconnect();
    });
});
