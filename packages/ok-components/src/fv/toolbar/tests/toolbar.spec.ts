import { html } from '@ni/fast-element';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvToolbar, fvToolbarTag } from '..';

async function setup(): Promise<Fixture<FvToolbar>> {
    return await fixture<FvToolbar>(html`
        <${fvToolbarTag}>
            <button slot="primary" type="button">Create asset</button>
            <button slot="end" type="button">Refresh</button>
            <button slot="end" type="button">Configure</button>
        </${fvToolbarTag}>
    `);
}

describe('FvToolbar', () => {
    let element: FvToolbar;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvToolbarTag)).toBeInstanceOf(FvToolbar);
    });

    it('renders named slots for primary and end content', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const primarySlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="primary"]');
        const endSlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="end"]');

        expect(primarySlot).not.toBeNull();
        expect(endSlot).not.toBeNull();
    });

    it('projects the primary content into the left slot', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const primarySlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="primary"]');
        const assignedElements = primarySlot?.assignedElements({ flatten: true }) ?? [];

        expect(assignedElements.length).toBe(1);
        expect(assignedElements[0]?.textContent?.trim()).toBe('Create asset');
    });

    it('projects multiple end elements into the right slot', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const endSlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="end"]');
        const assignedElements = endSlot?.assignedElements({ flatten: true }) ?? [];

        expect(assignedElements.map(assignedElement => assignedElement.textContent?.trim())).toEqual([
            'Refresh',
            'Configure'
        ]);
    });
});