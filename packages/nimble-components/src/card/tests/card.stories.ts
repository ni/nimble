import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { standardPadding } from '../../theme-provider/design-tokens';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { buttonTag } from '../../button';
import { cardTag } from '..';

const overviewText = `The \`nimble-card\` is a container that is designed to contain arbitrary content that is specified by a client
application. The \`nimble-card\` is intended for grouping related content.`;

const metadata: Meta = {
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
        <style>
            .card-content {
                margin-bottom: var(${standardPadding.cssCustomProperty});
            }
        </style>
        <${cardTag}>
            <div class="card-content">${loremIpsum}</div>
            <${buttonTag}>Button</${buttonTag}>
        </${cardTag}>
    `)
};

export default metadata;

export const card: StoryObj = {};
