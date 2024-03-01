import { ViewTemplate, html } from '@microsoft/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { numberFieldTag } from '@ni/nimble-components/dist/esm/number-field';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { accordionTag } from '..';

const metadata: Meta = {
    title: 'Tests/Accordion',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (): ViewTemplate => html`
    <${accordionTag}>
        <span slot="title">Title</span>
        <${numberFieldTag}>Numeric field 1</${numberFieldTag}>
        <${numberFieldTag}>Numeric field 2</${numberFieldTag}>
        <${selectTag}>
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
            <${listOptionTag} value="2">Option 2</${listOptionTag}>
            <${listOptionTag} value="3">Option 3</${listOptionTag}>
        </${selectTag}>
    </${accordionTag}>
`;

export const accordionThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

export const hiddenAccordion: StoryFn = createStory(
    hiddenWrapper(
        html`<${accordionTag} hidden>Hidden Accordion</${accordionTag}>`
    )
);
