import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { hiddenWrapper } from '../../../utilities/tests/hidden';

const patternDescription = `A regex that is used to extract the user ID from user hrefs during the parsing and serializing of markdown in the editor. This regex also serves purpose of validation against the input mention markdown string.

To extract the user ID to display when the mapping element for particular markdown input, the pattern should be grouped to render as user ID if the user name is not identified but matches the pattern. For example, the pattern should be \`user:(.*)\` to extract the user ID which is next to \`user:\`. If the pattern does not have grouping regex, also if the mapping element is not found, the given input will render as plain text in the rich text components.
`;

const metadata: Meta = {
    title: 'Internal/Rich Text Mention Users',
    parameters: {
        docs: {
            description: {
                component:
                    'Add a `nimble-rich-text-mention-users` element as a child of the rich text component to enable using a toolbar button and `@` keystroke to mention a user. Add `nimble-mapping-mention-user` elements as its children to specify the users available to be mentioned.'
            }
        }
    }
};

export default metadata;

export const richTextMentionUsers: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        pattern: {
            description: patternDescription,
            control: { type: 'none' }
        }
    }
};
