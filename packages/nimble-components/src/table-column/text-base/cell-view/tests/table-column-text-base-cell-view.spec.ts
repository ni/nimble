import { customElement } from '@microsoft/fast-element';
import { TableColumnTextCellViewBase } from '..';
import {
    uniqueElementName,
    type Fixture,
    fixture
} from '../../../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { template as textBaseCellViewTemplate } from '../template';
import { styles as textBaseCellViewStyles } from '../styles';

describe('TableColumnTextCellViewBase', () => {
    let element: TableColumnTextCellViewBase;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    const testTextBaseCellViewTag = uniqueElementName();
    /**
     * Simple concrete class extending TableColumnTextCellViewBase to use for testing
     */
    @customElement({
        name: testTextBaseCellViewTag,
        template: textBaseCellViewTemplate,
        styles: textBaseCellViewStyles
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class TestTextBaseCellView extends TableColumnTextCellViewBase {}

    async function setup(): Promise<Fixture<TableColumnTextCellViewBase>> {
        return fixture(testTextBaseCellViewTag);
    }

    beforeEach(async () => {
        let parent: HTMLElement;
        ({ element, connect, disconnect, parent } = await setup());
        // Style the parent with flex layout and a non-zero width so that marginLeft
        // on 'element' will have an effect.
        parent.style.display = 'flex';
        parent.style.width = '100px';
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('defaults "rightAlign" to false', () => {
        expect(element.rightAlign).toBeFalse();
    });

    it('styles cell correctly with "rightAlign" set to true', async () => {
        element.rightAlign = true;
        await waitForUpdatesAsync();
        expect(getComputedStyle(element).marginLeft).not.toEqual('0px');
    });

    it('styles cell correctly with "rightAlign" set to false', async () => {
        element.rightAlign = false;
        await waitForUpdatesAsync();
        expect(getComputedStyle(element).marginLeft).toEqual('0px');
    });
});
