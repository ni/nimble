import { html } from '@microsoft/fast-element';
import { TableGroupRow } from '..';
import { createEventListener } from '../../../../utilities/tests/component';
import { fixture, Fixture } from '../../../../utilities/tests/fixture';

// prettier-ignore
async function setup(): Promise<Fixture<TableGroupRow>> {
    return fixture<TableGroupRow>(
        html`<nimble-table-group-row>
            </nimble-table-group-row>`
    );
}

describe('TableGroupRow', () => {
    let element: TableGroupRow;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        // prettier-ignore
        expect(document.createElement('nimble-table-group-row')).toBeInstanceOf(TableGroupRow);
    });

    it('clicking group row emits group-expand-toggle event', async () => {
        await connect();
        const groupExpandListener = createEventListener(
            element,
            'group-expand-toggle'
        );

        element.click();
        await groupExpandListener.promise;
        expect(groupExpandListener.spy).toHaveBeenCalledTimes(1);
    });
});
