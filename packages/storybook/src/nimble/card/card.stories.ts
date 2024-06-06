import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { numberFieldTag } from '../../../../nimble-components/src/number-field';
import { selectTag } from '../../../../nimble-components/src/select';
import { cardTag } from '../../../../nimble-components/src/card';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    incubatingWarning
} from '../../utilities/storybook';

interface CardArgs {
    title: string;
    content: undefined;
}

const metadata: Meta<CardArgs> = {
    title: 'Incubating/Card',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
    ${disableStorybookZoomTransform}
    ${incubatingWarning({
        componentName: 'card',
        statusLink: 'https://github.com/ni/nimble/issues/296'
    })}
        <${cardTag}>
            <span slot="title">${x => x.title}</span>
            <${numberFieldTag}>Numeric field 1</${numberFieldTag}>
            <${numberFieldTag}>Numeric field 2</${numberFieldTag}>
            <${selectTag}>
                <${listOptionTag} value="1">Option 1</${listOptionTag}>
                <${listOptionTag} value="2">Option 2</${listOptionTag}>
                <${listOptionTag} value="3">Option 3</${listOptionTag}>
            </${selectTag}>
        </${cardTag}>
    `),
    argTypes: {
        title: {
            description:
                'Text displayed as a title inside the card. This text should be short enough to fit within two lines when displayed. Cards should **always include a title**. The title is used to provide an accessible name to assistive technologies.',
            table: { category: apiCategory.slots }
        },
        content: {
            name: 'default',
            description: 'Content to be displayed inside the card.',
            table: { category: apiCategory.slots },
            control: false
        }
    },
    args: {
        title: 'Title text'
    }
};

export default metadata;

export const card: StoryObj<CardArgs> = {};
