import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvFilterBar, fvFilterBarTag } from '..';
import type { FvFilterBarDefinition, FvFilterBarQueryDocument } from '../types';

async function setup(): Promise<Fixture<FvFilterBar>> {
    return await fixture<FvFilterBar>(html`<${fvFilterBarTag}></${fvFilterBarTag}>`);
}

describe('FvFilterBar', () => {
    let element: FvFilterBar;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('renders labels and nested query-builder conditions', async () => {
        ({ element, connect, disconnect } = await setup());
        element.definition = {
            fields: [
                { id: 'status', label: 'Status', valueSchema: { oneOf: [{ const: 'failed', title: 'Failed' }] } },
                { id: 'duration', label: 'Duration' }
            ],
            operators: [
                { id: 'is', label: 'Is' },
                { id: 'greater-than', label: 'Greater than' }
            ]
        };
        element.query = {
            version: 1,
            root: {
                kind: 'group',
                combinator: 'or',
                children: [
                    { kind: 'group', combinator: 'and', children: [] },
                    { kind: 'predicate', fieldId: 'status', operatorId: 'is', value: 'failed' },
                    {
                        kind: 'group',
                        combinator: 'and',
                        children: [{ kind: 'predicate', fieldId: 'duration', operatorId: 'greater-than', value: 500 }]
                    }
                ]
            }
        };
        await connect();

        expect(element.expression).toBe('Status Is Failed OR (Duration Greater than 500)');
        expect(element.shadowRoot?.querySelector('.filter-bar-expression')?.textContent?.replace(/\s+/g, ' ').trim())
            .toBe('Status Is Failed OR (Duration Greater than 500)');
        expect(Array.from(element.shadowRoot?.querySelectorAll('.query-expression b') ?? [])
            .map(node => node.textContent)).toEqual(['Status', ' Failed', 'Duration', ' 500']);
        expect(element.shadowRoot?.querySelector('.logical-operator')?.textContent).toBe(' OR ');
    });

    it('updates condition chips when the host replaces or clears the query', async () => {
        ({ element, connect, disconnect } = await setup());
        element.showClearButton = false;
        element.query = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'Name', operatorId: 'Is blank' }
        };
        await connect();
        expect(element.shadowRoot?.querySelector('.query-expression')?.textContent).toBe('Name Is blank');
        expect(element.shadowRoot?.querySelector('.filter-bar-clear')).toBeNull();

        element.showClearButton = true;
        element.query = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'Passed', operatorId: 'Is', value: false }
        };
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('.query-expression')?.textContent).toBe('Passed Is false');
        expect(element.shadowRoot?.querySelector('.filter-bar-clear')).not.toBeNull();

        element.query = { version: 1, root: null };
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('.filter-bar-expression')).toBeNull();
        expect(element.shadowRoot?.querySelector('.filter-bar-clear')).toBeNull();
    });

    it('updates the hover title when a definition arrives after an initially empty query', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        const editButton = element.shadowRoot?.querySelector<HTMLButtonElement>('.filter-bar-edit');
        expect(editButton?.title).toBe('');

        element.query = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'status', operatorId: 'is', value: 'failed' }
        };
        await waitForUpdatesAsync();
        expect(editButton?.title).toBe('status is failed');

        element.definition = {
            fields: [{
                id: 'status',
                label: 'Status',
                valueSchema: { oneOf: [{ const: 'failed', title: 'Failed' }] }
            }],
            operators: [{ id: 'is', label: 'Is' }]
        };
        await waitForUpdatesAsync();
        expect(editButton?.title).toBe('Status Is Failed');
        expect(element.shadowRoot?.querySelector('.query-expression')?.textContent).toBe('Status Is Failed');
    });

    it('dispatches edit and clear events with the query-builder document', async () => {
        ({ element, connect, disconnect } = await setup());
        const query: FvFilterBarQueryDocument = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'status', operatorId: 'is', value: 'failed' }
        };
        element.definition = {
            fields: [{ id: 'status', label: 'Status' }],
            operators: [{ id: 'is', label: 'Is' }]
        } satisfies FvFilterBarDefinition;
        element.query = query;
        await connect();

        const details: FvFilterBarQueryDocument[] = [];
        element.addEventListener('edit-filter', event => {
            details.push((event as CustomEvent<{ query: FvFilterBarQueryDocument }>).detail.query);
        });
        element.addEventListener('clear-filter', event => {
            details.push((event as CustomEvent<{ query: FvFilterBarQueryDocument }>).detail.query);
        });

        element.shadowRoot?.querySelector<HTMLElement>('.query-expression')?.click();
        element.shadowRoot?.querySelector<HTMLButtonElement>('.filter-bar-clear')?.click();

        expect(details).toEqual([query, query]);
    });
});
