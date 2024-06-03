import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { apiCategory, createUserSelectedThemeStory } from '../../../utilities/storybook';
import { hiddenWrapper } from '../../../utilities/hidden';

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
            description: 'A URL that uniquely identifies the user, e.g. `user:1234`.',
            control: false,
            table: { category: apiCategory.attributes },
        },
        displayName: {
            name: 'display-name',
            description:
                'The display name to render for the user, e.g. `Oscar Meyer 🌭`.',
            control: false,
            table: { category: apiCategory.attributes },
        }
    },
    args: {}
};
