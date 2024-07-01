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
    checkValidityDescription,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';

const simpleData = [
    {
        firstName: 'Ralph',
        firstNameSortIndex: 3,
        lastName: 'Wiggum',
        lastNameSortIndex: 3,
        fullName: 'Ralph Wiggum',
        favoriteColor: 'Rainbow',
        quote: "I'm in danger!"
    },
    {
        firstName: 'Milhouse',
        firstNameSortIndex: 1,
        lastName: 'Van Houten',
        lastNameSortIndex: 2,
        fullName: 'Milhouse Van Houten',
        favoriteColor: 'Crimson',
        quote: "Not only am I not learning, I'm forgetting stuff I used to know!"
    },
    {
        firstName: 'Ned',
        firstNameSortIndex: 2,
        lastName: 'Flanders',
        lastNameSortIndex: 0,
        fullName: 'Ned Flanders',
        favoriteColor: 'Taupe',
        quote: 'Hi diddly-ho neighbor!'
    },
    {
        firstName: 'Maggie',
        firstNameSortIndex: 0,
        lastName: 'Simpson',
        lastNameSortIndex: 1,
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

interface TextColumnTableArgs extends SharedTableArgs {
    fieldName: undefined;
    placeholder: string;
    sortByFieldName: 'firstNameSortIndex' | 'lastNameSortIndex';
    checkValidity: never;
    validity: never;
}

const validityDescription = `Readonly object of boolean values that represents the validity states that the column's configuration can be in.
The object's type is \`TableColumnValidity\`, and it contains the following boolean properties:
-   \`invalidCustomSortWithGrouping\`: \`true\` when \`sort-by-field-name\` is specified while the column used for grouping.
`;

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
            options: ['firstNameSortIndex', 'lastNameSortIndex'],
            control: {
                type: 'radio',
                labels: {
                    firstNameSortIndex: 'Sort "Full Name" column by first name',
                    lastNameSortIndex: 'Sort "Full Name" column by last name'
                }
            },
            table: { category: apiCategory.attributes }
        },
        checkValidity: {
            name: 'checkValidity()',
            description: checkValidityDescription({
                componentName: 'text column'
            }),
            table: { category: apiCategory.methods },
            control: false
        },
        validity: {
            description: validityDescription,
            table: { category: apiCategory.nonAttributeProperties },
            control: false
        }
    },
    args: {
        placeholder: 'Did not respond to request for comment',
        sortByFieldName: 'firstNameSortIndex'
    }
};
