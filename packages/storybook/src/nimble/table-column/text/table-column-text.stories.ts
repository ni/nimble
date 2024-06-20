import { html, ref } from '@microsoft/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { tableTag } from '../../../../../nimble-components/src/table';
import { tableColumnTextTag } from '../../../../../nimble-components/src/table-column/text';
import {
    SharedTableArgs,
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
        firstName: 'Ralph',
        lastName: 'Wiggum',
        fullName: 'Ralph Wiggum',
        favoriteColor: 'Rainbow',
        quote: "I'm in danger!"
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        fullName: 'Milhouse Van Houten',
        favoriteColor: 'Crimson',
        quote: "Not only am I not learning, I'm forgetting stuff I used to know!"
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        fullName: 'Ned Flanders',
        favoriteColor: 'Taupe',
        quote: 'Hi diddly-ho neighbor!'
    },
    {
        firstName: 'Maggie',
        lastName: 'Simpson',
        fullName: 'Maggie Simpson',
        favoriteColor: 'Red'
    }
] as const;

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Text',
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

type TextColumnFieldNameOption = 'firstName' | 'lastName';

interface TextColumnTableArgs extends SharedTableArgs {
    fieldName: TextColumnFieldNameOption;
    placeholder: string;
    sortByFieldName: string;
}

export const textColumn: StoryObj<TextColumnTableArgs> = {
    parameters: {},
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TextColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag}
                field-name="firstName"
            >
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="lastName"
            >
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="fullName"
                sort-by-field-name="${x => x.sortByFieldName}"
            >
                Full Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="quote"
                placeholder="${x => x.placeholder}"
            >
                Quote
            </${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record should be displayed in each column. The field values must be of type `string`.',
            control: false,
            table: { category: apiCategory.attributes }
        },
        placeholder: {
            description:
                'The placeholder text to display when the field value is `undefined` or `null` for a record.',
            table: { category: apiCategory.attributes }
        },
        sortByFieldName: {
            name: 'sort-by-field-name',
            description:
                'Set this attribute to identify a field to sort the column by. If not set, the column will sort by the `field-name` field. It is invalid to group by a column with `sort-by-field-name` configured.',
            options: ['firstName', 'lastName'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
    },
    args: {
        fieldName: 'firstName',
        placeholder: 'Did not respond to request for comment',
        sortByFieldName: 'firstName'
    }
};
