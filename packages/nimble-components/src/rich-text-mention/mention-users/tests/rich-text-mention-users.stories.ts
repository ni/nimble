import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { hiddenWrapper } from '../../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Internal/Rich Text',
    parameters: {
        docs: {
            description: {
                component:
                    'The `nimble-rich-text-mention-users` element will use the `nimble-mapping-mention-user` element as its user list content and utilize the pattern attribute to parse user href links, generating configuration for the mention list. This element will also include various validation checks to ensure the content format and pattern are correctly verified.'
            }
        }
    }
};

export default metadata;

export const richTextMentionUsers: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        pattern: {
            description:
                'Using this regex, the user ID will be extracted from the user href during the parsing and serializing of comments in the editor.',
            control: { type: 'none' }
        }
    },
    args: {}
};
