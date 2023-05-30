import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    usageWarning
} from '../../../../../utilities/tests/storybook';

const metadata: Meta<MappingTextArgs> = {
    title: 'Table Column Types'
};

export default metadata;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MappingTextArgs {}

export const textMapping: StoryObj<MappingTextArgs> = {
    parameters: {
        docs: {
            description: {
                story: 'The `nimble-mapping-text` element defines a mapping from a data value to display text. It is meant to be used as content of the `nimble-table-column-mapping` column type element.'
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<MappingTextArgs>`
        ${usageWarning('table')}
    `),
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
