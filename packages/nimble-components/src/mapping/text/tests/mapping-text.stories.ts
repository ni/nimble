import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { hiddenWrapper } from '../../../utilities/tests/hidden';
import { keyDescription } from '../../base/tests/story-helpers';

const metadata: Meta = {
    title: 'Internal/Mappings',
    parameters: {
        docs: {
            description: {
                component:
                    'The `nimble-mapping-text` element defines a mapping from a data value to display text. It is meant to be used as content of the `nimble-table-column-enum-text` column type element.'
            }
        }
    }
};

export default metadata;

export const textMapping: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        key: {
            description: keyDescription('the mapped display text'),
            control: { type: 'none' }
        },
        text: {
            description: 'The display text.'
        }
    },
    args: {}
};
