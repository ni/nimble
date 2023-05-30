import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    usageWarning
} from '../../../../../utilities/tests/storybook';

const metadata: Meta<MappingIconArgs> = {
    title: 'Table Column Types'
};

export default metadata;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MappingIconArgs {}

export const iconMapping: StoryObj<MappingIconArgs> = {
    parameters: {
        docs: {
            description: {
                story: 'The `nimble-mapping-icon` element defines a mapping from a data value to an icon representation to use for that value. It is meant to be used as content of the `nimble-table-column-icon` column type element.'
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<MappingIconArgs>`
        ${usageWarning('table')}
    `),
    argTypes: {
        key: {
            description:
                'The value which, when matched to the data value for a cell, will result in the mapped icon being rendered in that cell. There must not be multiple mappings with the same key in a given column.',
            control: { type: 'none' }
        },
        icon: {
            control: { type: 'none' },
            description:
                'The tag name of the Nimble icon to render, e.g. `nimble-icon-check`.'
        },
        severity: {
            description:
                'One of `error`, `warning`, `success`, `information`, or unspecified. Controls the color of the icon.'
        },
        label: {
            description:
                'A textual description of the value which will be used as the tooltip and accessible name of the icon. The label is also displayed next to the icon in a group header.'
        },
        defaultMapping: {
            name: 'default-mapping',
            description:
                'If present, indicates this mapping should be used when no other mapping matches the cell value. There can be no more than one default mapping for a given column.'
        }
    },
    args: {}
};
