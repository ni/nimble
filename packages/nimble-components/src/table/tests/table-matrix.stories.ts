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
                'https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/specs/'
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
    }
] as const;

// prettier-ignore
const component = (
): ViewTemplate => html`
    <nimble-table :data=${_ => data}></nimble-table>
`;

export const tableThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component)
);

export const hiddenTable: Story = createStory(
    hiddenWrapper(html`<nimble-table hidden></nimble-table>`)
);
