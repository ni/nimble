import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { listOptionTag } from '../../list-option';
import { numberFieldTag } from '../../number-field';
import { selectTag } from '../../select';
import { cardTag } from '..';

interface CardArgs {
    title: string;
}

const overviewText = `The \`nimble-card\` is a container that is designed to contain arbitrary content that is specified by a client
application. The \`nimble-card\` is intended for grouping related content.`;

const metadata: Meta<CardArgs> = {
    title: 'Incubating/Card',
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
                'Text displayed as a title inside the card. Cards should **always include a title**. The title is used to provide an accessible name to assistive technologies.<br><br>Provide the title in an element targeted to the `title` slot.'
        }
    },
    args: {
        title: 'Title text'
    }
};

export default metadata;

export const card: StoryObj<CardArgs> = {};
