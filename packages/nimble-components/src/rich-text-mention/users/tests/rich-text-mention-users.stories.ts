import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { hiddenWrapper } from '../../../utilities/tests/hidden';

const patternDescription = `A regex used for detecting, validating, and extracting information from mentions in the rich text markdown string.

* To extract the key, the pattern must include a group that matches the key portion of the mention link. For example, the pattern should be \`user:(.*)\` to extract the user key adjacent to \`user:\`. If the pattern doesn't have a grouping regex (e.g., \`user:.*\`) and the mapping element for a key doesn't contain a display name, the mention will render as plain text or, in some cases, as a link (if the href is HTTPS/HTTP) in rich text components. If no mapping element for the particular key is not found but has a grouping regex, the mention will render the key instead.
`;

const metadata: Meta = {
    title: 'Internal/Rich Text Mention Users',
    parameters: {
        docs: {
            description: {
                component:
                    'Add a `nimble-rich-text-mention-users` element as a child of the rich text components to enable support for `@mention`. Add `nimble-mapping-mention-user` elements as its children to specify the users available to be mentioned.'
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
