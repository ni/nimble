import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { standardPadding } from '../../theme-provider/design-tokens';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { listOptionTag } from '../../list-option';
import { numberFieldTag } from '../../number-field';
import { selectTag } from '../../select';
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
        <${cardTag}>
            <${numberFieldTag}>Numeric field 1</${numberFieldTag}>
            <${numberFieldTag}>Numeric field 2</${numberFieldTag}>
            <${selectTag}>
                <${listOptionTag} value="1">Option 1</${listOptionTag}>
                <${listOptionTag} value="2">Option 2</${listOptionTag}>
                <${listOptionTag} value="3">Option 3</${listOptionTag}>
            </${selectTag}>
        </${cardTag}>
    `)
};

export default metadata;

export const card: StoryObj = {};
