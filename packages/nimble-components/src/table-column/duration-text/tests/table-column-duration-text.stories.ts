import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnDurationTextTag } from '..';
import {
    SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../base/tests/table-column-stories-utils';
import { tableColumnTextTag } from '../../text';

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
        swearWordCadence: 3.78e12
    }
] as const;

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Duration Text',
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
    },
    args: {
        ...sharedTableArgs(simpleData)
    }
};

export default metadata;

interface TextColumnTableArgs extends SharedTableArgs {
    fieldName: string;
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
            control: { type: 'none' }
        }
    },
    args: {
        fieldName: 'firstName'
    }
};
