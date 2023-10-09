import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../../utilities/tests/storybook';
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
        birthday: new Date(1984, 4, 12, 14, 34, 19, 377).valueOf() / 1000
    },
    {
        firstName: 'Marge',
        lastName: 'Simpson',
        birthday: new Date(1984, 2, 19, 7, 6, 48, 584).valueOf() / 1000
    },
    {
        firstName: 'Bart',
        lastName: 'Simpson',
        birthday: new Date(2013, 3, 1, 20, 4, 37, 975).valueOf() / 1000
    },
    {
        firstName: 'Maggie',
        lastName: 'Simpson',
        birthday: 50000.5
    }
];

const metadata: Meta<SharedTableArgs> = {
    title: 'Incubating/Table Column - Elapsed Time Text',
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
    checkValidity: () => void;
    validity: () => void;
}

const dateTextColumnDescription = 'The `nimble-table-column-date-text` column is used to display date-time fields as text in the `nimble-table`. The date-time values must be of type `number` and represent the number of milliseconds since January 1, 1970 UTC. This is the representation used by the [JavaScript `Date` type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). Dates are formatted in a locale-specific way based on the value of the `lang` token, which can be set via the [`nimble-theme-provider`](?path=/docs/tokens-theme-provider--docs).';

export const elapsedTimeTextColumn: StoryObj<TextColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: dateTextColumnDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TextColumnTableArgs>`
        ${incubatingWarning({
        componentName: 'table',
        statusLink: 'https://github.com/orgs/ni/projects/7/views/21'
    })}
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
                field-name="birthday"
            >
            Birthday
            </${tableColumnDurationTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record should be displayed in each column. The field values must be of type `number` and represent the number of milliseconds since January 1, 1970 UTC. This is the representation used by the `Date` type.',
            control: { type: 'none' }
        },
    },
    args: {
        fieldName: 'firstName',
        checkValidity: () => {},
        validity: () => {}
    }
};
