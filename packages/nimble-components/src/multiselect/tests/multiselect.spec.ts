import { html } from '@ni/fast-element';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { Multiselect, multiselectTag } from '..';
import { MultiselectPageObject } from '../testing/multiselect.pageobject';
import { ListOption, listOptionTag } from '../../list-option';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

async function setup(): Promise<Fixture<Multiselect>> {
    const viewTemplate = html`
        <${multiselectTag}>
            <${listOptionTag} value="one">One</${listOptionTag}>
            <${listOptionTag} value="two">Two</${listOptionTag}>
            <${listOptionTag} value="three">Three</${listOptionTag}>
        </${multiselectTag}>
    `;
    return await fixture<Multiselect>(viewTemplate);
}

async function setupWithSelections(): Promise<Fixture<Multiselect>> {
    const viewTemplate = html`
        <${multiselectTag}>
            <${listOptionTag} value="one" selected>One</${listOptionTag}>
            <${listOptionTag} value="two" selected>Two</${listOptionTag}>
            <${listOptionTag} value="three">Three</${listOptionTag}>
        </${multiselectTag}>
    `;
    return await fixture<Multiselect>(viewTemplate);
}

describe('Multiselect', () => {
    let element: Multiselect;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: MultiselectPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new MultiselectPageObject(element);
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should initialize with multiple=true', () => {
        expect(element.multiple).toBeTrue();
    });

    it('should have empty selectedOptions initially', () => {
        expect(element.selectedOptions).toEqual([]);
    });

    it('should have empty value initially', () => {
        expect(element.value).toBe('');
    });

    it('should have empty displayValue initially', () => {
        expect(element.displayValue).toBe('');
    });

    describe('selection', () => {
        it('should allow selecting single option', async () => {
            const option = element.options[0] as ListOption;
            option.selected = true;
            await waitForUpdatesAsync();

            expect(element.selectedOptions).toEqual([option]);
            expect(element.value).toBe('one');
            expect(element.displayValue).toBe('One');
        });

        it('should allow selecting multiple options', async () => {
            const option1 = element.options[0] as ListOption;
            const option2 = element.options[1] as ListOption;
            option1.selected = true;
            option2.selected = true;
            await waitForUpdatesAsync();

            expect(element.selectedOptions).toEqual([option1, option2]);
            expect(element.value).toBe('one,two');
            expect(element.displayValue).toBe('One, Two');
        });

        it('should update value when selections change', async () => {
            const option1 = element.options[0] as ListOption;
            const option2 = element.options[1] as ListOption;

            option1.selected = true;
            await waitForUpdatesAsync();
            expect(element.value).toBe('one');

            option2.selected = true;
            await waitForUpdatesAsync();
            expect(element.value).toBe('one,two');

            option1.selected = false;
            await waitForUpdatesAsync();
            expect(element.value).toBe('two');
        });
    });

    describe('value property', () => {
        it('should set selections from comma-separated value string', async () => {
            element.value = 'one,three';
            await waitForUpdatesAsync();

            const option1 = element.options[0] as ListOption;
            const option3 = element.options[2] as ListOption;

            expect(option1.selected).toBeTrue();
            expect(option3.selected).toBeTrue();
            expect(element.selectedOptions).toEqual([option1, option3]);
        });

        it('should clear selections when value is set to empty string', async () => {
            // First select some options
            const option1 = element.options[0] as ListOption;
            option1.selected = true;
            await waitForUpdatesAsync();

            // Then clear via value
            element.value = '';
            await waitForUpdatesAsync();

            expect(element.selectedOptions).toEqual([]);
            expect(option1.selected).toBeFalse();
        });
    });

    describe('keyboard navigation', () => {
        beforeEach(async () => {
            element.open = true;
            element.focus();
            await waitForUpdatesAsync();
        });

        it('should toggle selection with Enter key', async () => {
            const option = element.options[0] as ListOption;

            // Navigate to first option
            pageObject.pressArrowDownKey();
            await waitForUpdatesAsync();

            // Press Enter to select
            pageObject.pressEnterKey();
            await waitForUpdatesAsync();

            expect(option.selected).toBeTrue();
            expect(element.selectedOptions).toEqual([option]);
        });

        it('should toggle selection with Space key', async () => {
            const option = element.options[0] as ListOption;

            // Navigate to first option
            pageObject.pressArrowDownKey();
            await waitForUpdatesAsync();

            // Press Space to select
            await pageObject.pressSpaceKey();
            await waitForUpdatesAsync();

            expect(option.selected).toBeTrue();
            expect(element.selectedOptions).toEqual([option]);
        });

        it('should allow toggling selection off', async () => {
            const option = element.options[0] as ListOption;

            // First select
            pageObject.pressArrowDownKey();
            await waitForUpdatesAsync();
            pageObject.pressEnterKey();
            await waitForUpdatesAsync();
            expect(option.selected).toBeTrue();

            // Then deselect
            pageObject.pressEnterKey();
            await waitForUpdatesAsync();
            expect(option.selected).toBeFalse();
            expect(element.selectedOptions).toEqual([]);
        });
    });

    describe('with pre-selected options', () => {
        beforeEach(async () => {
            await disconnect();
            ({ element, connect, disconnect } = await setupWithSelections());
            pageObject = new MultiselectPageObject(element);
            await connect();
        });

        it('should initialize with correct selectedOptions', () => {
            const option1 = element.options[0] as ListOption;
            const option2 = element.options[1] as ListOption;

            expect(element.selectedOptions).toEqual([option1, option2]);
            expect(element.value).toBe('one,two');
            expect(element.displayValue).toBe('One, Two');
        });
    });
});
