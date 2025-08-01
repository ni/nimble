import { html, ref } from '@ni/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { tableColumnDurationTextTag } from '@ni/nimble-components/dist/esm/table-column/duration-text';
import {
    type SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../base/table-column-stories-utils';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';

const simpleData = [
    {
        firstName: 'Homer',
        lastName: 'Simpson',
        swearWordCadence: 5400000
    },
    {
        firstName: 'Marge',
        lastName: 'Simpson',
        swearWordCadence: 2.59e9
    },
    {
        firstName: 'Bart',
        lastName: 'Simpson',
        swearWordCadence: 1800500
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        swearWordCadence: Number.NaN
    },
    {
        firstName: 'Montgomery',
        lastName: 'Burns',
        swearWordCadence: undefined
    }
] as const;

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Duration Text',
    decorators: [withActions<HtmlRenderer>],
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
    },
    args: {
        ...sharedTableArgs(simpleData)
    }
};

export default metadata;

interface TextColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    placeholder: string;
}

export const durationTextColumn: StoryObj<TextColumnTableArgs> = {
    parameters: {},
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TextColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag}
                field-name="${x => x.fieldName}"
            >
            Name
            </${tableColumnTextTag}>
            <${tableColumnDurationTextTag}
                field-name="swearWordCadence"
                placeholder="${x => x.placeholder}"
            >
            Time since last swear word
            </${tableColumnDurationTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record should be displayed in each column. The field values must be of type `number` and represent a total number of milliseconds.',
            control: false,
            table: { category: apiCategory.attributes }
        },
        placeholder: {
            description:
                'The placeholder text to display when the field value is `undefined` or `null` for a record.',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        fieldName: 'firstName',
        placeholder: 'Unknown time'
    }
};
