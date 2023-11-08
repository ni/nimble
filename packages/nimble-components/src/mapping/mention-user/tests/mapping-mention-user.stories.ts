import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { hiddenWrapper } from '../../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Internal/Mappings',
    parameters: {
        docs: {
            description: {
                component:
                    'The `nimble-mapping-mention-user` element defines a mapping from a rich text user mention keys to the user name to display. It is meant to be used as content of the `nimble-rich-text-mention-users` element.'
            }
        }
    }
};

export default metadata;

export const userMentionMapping: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        key: {
            description: 'A URL for each user that maps with their username and results in the display of associated user in a list of mentions',
            control: { type: 'none' }
        },
        displayName: {
            name: 'display-name',
            description: 'A string which renders the textual representation of user name in the mention list'
        }
    },
    args: {}
};