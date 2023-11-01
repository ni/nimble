import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnSelectTag } from '..';
import {
    sharedTableActions,
    SharedTableArgs,
    sharedTableArgs,
    sharedTableArgTypes
} from '../../base/tests/table-column-stories-utils';
import { tableColumnTextTag } from '../../text';

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Select',
    decorators: [withActions],
    parameters: {
        actions: {
            handles: sharedTableActions
        }
    },
    // prettier-ignore
    argTypes: {
        ...sharedTableArgTypes,
        selectionMode: {
            table: {
                disable: true
            }
        },
    }
};

export default metadata;

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        url: 'https://www.google.com/search?q=ralph+wiggum'
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        url: 'https://www.google.com/search?q=milhouse+van+houten'
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        url: 'https://www.google.com/search?q=ned+flanders'
    },
    {
        firstName: 'Maggie (no link)',
        lastName: 'Simpson'
    },
    {
        lastName: 'Simpson',
        url: 'https://www.google.com/search?q=simpsons'
    },
    {
        lastName: 'Simpson'
    }
];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SelectColumnTableArgs extends SharedTableArgs {}

const selectColumnDescription = 'The `nimble-table-column-select` column is used to display string fields as links or text in the `nimble-table`. If a row provides an href for a link, that cell will display a link, otherwise it will display plain text.';

export const selectColumn: StoryObj<SelectColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: selectColumnDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<SelectColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnSelectTag}
            >
            Link Column
            </${tableColumnSelectTag}>
            <${tableColumnTextTag}
                field-name="lastName"
            >
            Last Name
            </${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {},
    args: {
        ...sharedTableArgs(simpleData)
    }
};
