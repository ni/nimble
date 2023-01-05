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

const data = [
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
        myStr: null,
        myNum: null,
        myBool: null
    }
] as const;

// prettier-ignore
const component = (
): ViewTemplate => html`
    <nimble-table :data=${_ => data}>
        <nimble-table-column-text field-name="myStr" placeholder="no value">Text data</nimble-table-column-text>
        <nimble-table-column-text field-name="myNum" placeholder="no value">Number data</nimble-table-column-text>
        <nimble-table-column-text field-name="myBool" placeholder="no value">Boolean data</nimble-table-column-text>
    </nimble-table>
`;

export const tableThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component)
);

export const hiddenTable: Story = createStory(
    hiddenWrapper(html`<nimble-table hidden></nimble-table>`)
);
