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
                    'The `nimble-mapping-user` element defines a mapping from a rich text user keys to the user name to display. It is meant to be used as content of the `nimble-rich-text-mention-users` element.'
            }
        }
    }
};

export default metadata;

export const userMapping: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        key: {
            description: 'A key (url) for each user that maps to a user',
            control: { type: 'none' }
        },
        displayName: {
            name: 'display-name',
            description:
                'A string which renders the textual representation of user name'
        }
    },
    args: {}
};
