import type { StoryFn, Meta } from '@storybook/html';
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

    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/'
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
const component = (): ViewTemplate => html`
    <nimble-table :data=${_ => data}></nimble-table>
`;

export const tableThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

export const hiddenTable: StoryFn = createStory(
    hiddenWrapper(html`<nimble-table hidden></nimble-table>`)
);
