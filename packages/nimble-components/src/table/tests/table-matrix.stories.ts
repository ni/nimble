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
import type { Table } from '..';

const metadata: Meta = {
    title: 'Tests/Table',
    decorators: [withXD],
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
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow',
        quote: "I'm in danger!"
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        favoriteColor: 'Crimson',
        quote: "Not only am I not learning, I'm forgetting stuff I used to know!"
    },
    {
        firstName: null,
        lastName: null,
        favoriteColor: null,
        quote: null
    }
] as const;

// prettier-ignore
const component = (): ViewTemplate => html`
    <nimble-table>
        <nimble-table-column-text field-name="firstName" placeholder="no value"><nimble-icon-user></nimble-icon-user></nimble-table-column-text>
        <nimble-table-column-text field-name="lastName" placeholder="no value">Last Name</nimble-table-column-text>
        <nimble-table-column-text field-name="favoriteColor" placeholder="no value">Favorite Color</nimble-table-column-text>
        <nimble-table-column-text field-name="quote" placeholder="no value" hidden>Hidden Quote</nimble-table-column-text>
    </nimble-table>
`;

export const tableThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component)
);

tableThemeMatrix.play = (): void => {
    document.querySelectorAll<Table>('nimble-table').forEach(table => {
        table.setData(data);
    });
};

export const hiddenTable: Story = createStory(
    hiddenWrapper(html`<nimble-table hidden></nimble-table>`)
);
