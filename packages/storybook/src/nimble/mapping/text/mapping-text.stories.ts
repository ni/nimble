import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { mappingKeyDescription } from '../base/story-helpers';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';
import { hiddenWrapper } from '../../../utilities/hidden';

const metadata: Meta = {
    title: 'Internal/Mappings',
    parameters: {
        docs: {
            description: {
                component:
                    'The `nimble-mapping-text` element defines a mapping from a data value to display text. It is meant to be used as content of the `nimble-table-column-mapping` column type element.'
            }
        }
    }
};

export default metadata;

export const textMapping: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        key: {
            description: mappingKeyDescription('the mapped display text'),
            control: false
        },
        text: {
            description: 'The display text.'
        }
    },
    args: {}
};
