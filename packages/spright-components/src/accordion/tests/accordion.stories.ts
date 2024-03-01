import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { numberFieldTag } from '@ni/nimble-components/dist/esm//number-field';
import { selectTag } from '@ni/nimble-components/dist/esm//select';
import {
    createUserSelectedThemeStory,
    disableStorybookZoomTransform
} from '../../utilities/tests/storybook';
import { accordionTag } from '..';

interface AccordionArgs {
    title: string;
}

const overviewText = 'The `spright-accordion` is a collapsible container which groups and contains arbitrary content or controls.';

const metadata: Meta<AccordionArgs> = {
    title: 'Components/Accordion',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
    ${disableStorybookZoomTransform}
        <${accordionTag}>
            <span slot="title">${x => x.title}</span>
            <${numberFieldTag}>Numeric field 1</${numberFieldTag}>
            <${numberFieldTag}>Numeric field 2</${numberFieldTag}>
            <${selectTag}>
                <${listOptionTag} value="1">Option 1</${listOptionTag}>
                <${listOptionTag} value="2">Option 2</${listOptionTag}>
                <${listOptionTag} value="3">Option 3</${listOptionTag}>
            </${selectTag}>
        </${accordionTag}>
    `),
    argTypes: {
        title: {
            description:
                'Text displayed as a title inside the accordion. Accordions should **always include a title**. The title is used to provide an accessible name to assistive technologies.<br><br>Provide the title in an element targeted to the `title` slot.'
        }
    },
    args: {
        title: 'Title text'
    }
};

export default metadata;

export const accordion: StoryObj<AccordionArgs> = {};
