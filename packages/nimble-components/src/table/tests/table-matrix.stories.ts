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
import { Table, tableTag } from '..';
import { iconUserTag } from '../../icons/user';
import { tableColumnTextTag } from '../../table-column/text';

const metadata: Meta = {
    title: 'Tests/Table',
    parameters: {
        ...sharedMatrixParameters()
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
    <${tableTag}>
        <${tableColumnTextTag} field-name="firstName" placeholder="no value" sort-direction="ascending" sort-index="0" group-index="0"><${iconUserTag}></${iconUserTag}></${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="lastName" placeholder="no value">Last Name</${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="favoriteColor" placeholder="no value" sort-direction="descending" sort-index="1" fractional-width=".5">Favorite Color</${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="quote" placeholder="no value" column-hidden>Hidden Quote</${tableColumnTextTag}>
    </${tableTag}>
`;

export const tableThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

tableThemeMatrix.play = (): void => {
    document.querySelectorAll<Table>('nimble-table').forEach(table => {
        table.setData(data);
    });
};

export const hiddenTable: StoryFn = createStory(
    hiddenWrapper(html`<${tableTag} hidden></${tableTag}>`)
);
