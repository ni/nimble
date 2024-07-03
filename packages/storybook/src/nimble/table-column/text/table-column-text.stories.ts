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
    createUserSelectedThemeStory,
    validityDescription
} from '../../../utilities/storybook';

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow',
        address: '732 Evergreen Terrace',
        addressSortOrder: 0,
        quote: "I'm in danger!"
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        favoriteColor: 'Crimson',
        address: '316 Pikeland Avenue',
        addressSortOrder: 3,
        quote: "Not only am I not learning, I'm forgetting stuff I used to know!"
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        favoriteColor: 'Taupe',
        address: '744 Evergreen Terrace',
        addressSortOrder: 2,
        quote: 'Hi diddly-ho neighbor!'
    },
    {
        firstName: 'Maggie',
        lastName: 'Simpson',
        favoriteColor: 'Red',
        address: '742 Evergreen Terrace',
        addressSortOrder: 1
    },
    {
        firstName: 'Agnes',
        lastName: 'Skinner',
        favoriteColor: 'Purple',
        address: '330 Pikeland Avenue',
        addressSortOrder: 4
    },
    {
        firstName: 'Moe',
        lastName: 'Szyslak',
        favoriteColor: 'Black',
        address: '57 Walnut Street',
        addressSortOrder: 5
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
    sortByFieldName: never;
    checkValidity: never;
    validity: never;
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
                field-name="address"
                sort-by-field-name="addressSortOrder"
            >
                Address
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
                'Set this attribute to identify a numeric field to sort the column by. If not set, the column will sort by the `field-name` field. It is invalid to group by a column with `sort-by-field-name` configured.',
            options: ['firstNameSortIndex', 'lastNameSortIndex'],
            control: false,
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
            description: validityDescription({
                colloquialName: 'column',
                validityObjectType: 'TableColumnValidity',
                validityFlags: [
                    {
                        flagName: 'invalidCustomSortWithGrouping',
                        description:
                            'true when `sort-by-field-name` is specified while the column used for grouping.'
                    }
                ]
            }),
            table: { category: apiCategory.nonAttributeProperties },
            control: false
        }
    },
    args: {
        placeholder: 'Did not respond to request for comment'
    }
};
