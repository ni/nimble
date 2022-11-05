import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ref } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import type { Table } from '..';
import type { Button } from '../../button';

interface TableArgs {
    disabled: boolean;
    selected: boolean;
    numRows: number;
    table1: Table;
    button: Button;
    startData: (table: Table, numRows: number) => void;
}

const metadata: Meta<TableArgs> = {
    title: 'Table',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d4ebeb5d-023c-4ff2-a71c-f6385fffca20/specs/'
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-table ${ref('table1')}>
            <nimble-number-field-column columnId="a" columnTitle="X"></nimble-number-field-column>
            <nimble-number-field-column columnId="b" columnTitle="X"></nimble-number-field-column>
            <nimble-number-field-column columnId="c" columnTitle="X"></nimble-number-field-column>
            <nimble-number-field-column columnId="d" columnTitle="X"></nimble-number-field-column>
            <nimble-number-field-column columnId="e" columnTitle="X"></nimble-number-field-column>
            <nimble-number-field-column columnId="x" columnTitle="X"></nimble-number-field-column>
            <nimble-number-field-column columnId="y" columnTitle="Y"></nimble-number-field-column>
            <nimble-number-field-column columnId="z" columnTitle="Z"></nimble-number-field-column>
        </nimble-table>
        <nimble-button ${ref('button')} @click="${x => x.startData(x.table1, x.numRows)}">Start Data</nimble-button>
    `),
    args: {
        disabled: false,
        selected: false,
        numRows: 10000,
        startData: (table: Table, numRows: number) => {
            window.setInterval(() => {
                const columns = ['a', 'b', 'c', 'd', 'e', 'x', 'y', 'z'];
                const data: { [key: string]: (string | boolean | Date | number)[] } = {};
                for (const column of columns) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const columnData = [...Array(numRows)].map(_ => Math.random() * 10);
                    data[column] = columnData;
                }

                table.data = data;
            }, 200);
        }
    }
};

export default metadata;

export const table: StoryObj<TableArgs> = {};
