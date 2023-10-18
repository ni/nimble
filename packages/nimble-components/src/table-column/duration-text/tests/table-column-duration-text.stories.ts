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
];

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Duration Text',
    decorators: [withActions],
    tags: ['autodocs'],
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

const durationTextColumnDescription = 'The `nimble-table-column-duration-text` column is used to display a period of elapsed time as text in the `nimble-table`. The values must be of type `number` and each represent a positive total number of milliseconds. Values that represent more than 100 days or less than a millisecond will be formatted in scientific notation as seconds only. All sub-second values will be represented with up to 3 digits of precision. Values are formatted in a locale-specific way based on the value of the lang token, which can be set via the [nimble-theme-provider](https://60e89457a987cf003efc0a5b-ckpboqfrwq.chromatic.com/iframe.html?path=/docs/tokens-theme-provider--docs).';

export const durationTextColumn: StoryObj<TextColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: durationTextColumnDescription
            }
        }
    },
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
