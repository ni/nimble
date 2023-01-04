import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/Table',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b9cee5e2-49a4-425a-9ed4-38b23ba2e313/specs/'
        }
    }
};

export default metadata;

const shortData = [
    {
        myStr: 'my first row',
        myNum: 5,
        myBool: true
    },
    {
        myStr: 'my second row',
        myNum: 15,
        myBool: false
    }
] as const;

const largeData = [
    {
        myStr: 'my first row',
        myNum: 5,
        myBool: true
    },
    {
        myStr: 'my second row',
        myNum: 15,
        myBool: false
    },
    {
        myStr: 'my third row',
        myNum: 0,
        myBool: false
    },
    {
        myStr: 'my fourth row',
        myNum: -9,
        myBool: false
    },
    {
        myStr: 'my fifth row',
        myNum: 1,
        myBool: true
    },
    {
        myStr: 'my sixth row',
        myNum: 11,
        myBool: false
    }
] as const;

const dataStates = [
    ['Short data', shortData],
    ['Large data', largeData]
];
type DataStates = typeof dataStates[number];

// prettier-ignore
const component = (
    [_dataName, data]: DataStates
): ViewTemplate => html`
    <nimble-table
        style="max-height: 200px; padding-bottom: 24px;"
        :data=${_ => data}
    ></nimble-table>
`;

export const tableThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        dataStates
    ])
);

export const hiddenTable: Story = createStory(
    hiddenWrapper(html`<nimble-table hidden></nimble-table>`)
);
