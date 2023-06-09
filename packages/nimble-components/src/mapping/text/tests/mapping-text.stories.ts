import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { hiddenWrapper } from '../../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Mappings',
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
            description:
                'The value which, when matched to the data value for a cell, will result in the mapped display text being rendered in that cell. There must not be multiple mappings with the same key in a given column.',
            control: { type: 'none' }
        },
        label: {
            description: 'The display text.'
        },
        defaultMapping: {
            name: 'default-mapping',
            description:
                'If present, indicates this mapping should be used when no other mapping matches the cell value. There can be no more than one default mapping for a given column.'
        }
    },
    args: {}
};
