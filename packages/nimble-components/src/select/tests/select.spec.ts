import {
    DesignSystem,
    Select as FoundationSelect
} from '@microsoft/fast-foundation';
import { DOM, html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import type { Select } from '..';
import '..';
import '../../listbox-option';

async function setup(
    position?: string,
    open?: boolean
): Promise<Fixture<Select>> {
    const viewTemplate = html`
        <nimble-select
            ${position !== undefined ? `position="${position}"` : ''}
            ${open ? 'open' : ''}
        >
            <nimble-listbox-option value="one">One</nimble-listbox-option>
            <nimble-listbox-option value="two">Two</nimble-listbox-option>
            <nimble-listbox-option value="three">Three</nimble-listbox-option>
        </nimble-select>
    `;
    return fixture<Select>(viewTemplate);
}

describe('Select', () => {
    it('should respect value set before connect is completed', async () => {
        const { element, connect, disconnect } = await setup();

        const connectTask = connect();
        element.value = 'two';
        await connectTask;

        expect(element.value).toBe('two');

        await disconnect();
    });

    // fast-foundation versions >= 2.29.0 will error
    // See https://github.com/microsoft/fast/issues/5586
    it('should respect "open" and "position" attributes when both set', async () => {
        const position = 'above';
        const { element, connect, disconnect } = await setup(position, true);

        await connect();
        await DOM.nextUpdate();

        expect(element.getAttribute('open')).not.toBeNull();
        expect(element.getAttribute('position')).toBe(position);

        await disconnect();
    });

    it('should have its tag returned by tagFor(FoundationSelect)', () => {
        expect(DesignSystem.tagFor(FoundationSelect)).toBe('nimble-select');
    });
});
