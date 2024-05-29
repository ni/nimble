import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { numberFieldTag } from '../../../../nimble-components/src/number-field';
import { selectTag } from '../../../../nimble-components/src/select';
import { cardLitTag } from '../../../../nimble-components/src/card-lit';
import {
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    incubatingWarning
} from '../../utilities/storybook';

interface CardLitArgs {
    title: string;
}

const metadata: Meta<CardLitArgs> = {
    title: 'Incubating/Card Lit',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
    ${disableStorybookZoomTransform}
    ${incubatingWarning({
        componentName: 'card lit',
        statusLink: 'https://github.com/ni/nimble/issues/296'
    })}
        <${cardLitTag}>
            <span slot="title">${x => x.title}</span>
            <${numberFieldTag}>Numeric field 1</${numberFieldTag}>
            <${numberFieldTag}>Numeric field 2</${numberFieldTag}>
            <${selectTag}>
                <${listOptionTag} value="1">Option 1</${listOptionTag}>
                <${listOptionTag} value="2">Option 2</${listOptionTag}>
                <${listOptionTag} value="3">Option 3</${listOptionTag}>
            </${selectTag}>
        </${cardLitTag}>
    `),
    argTypes: {
        title: {
            description:
                'Text displayed as a title inside the card. This text should be short enough to fit within two lines when displayed. Cards should **always include a title**. The title is used to provide an accessible name to assistive technologies.<br><br>Provide the title in an element targeted to the `title` slot.'
        }
    },
    args: {
        title: 'Title text'
    }
};

export default metadata;

export const card: StoryObj<CardLitArgs> = {};
