import { html, ref } from '@microsoft/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { tableTag } from '../../../../../nimble-components/src/table';
import { tableColumnTextTag } from '../../../../../nimble-components/src/table-column/text';
import { AnchorAppearance } from '../../../../../nimble-components/src/anchor/types';
import { tableColumnAnchorTag } from '../../../../../nimble-components/src/table-column/anchor';
import {
    sharedTableActions,
    SharedTableArgs,
    sharedTableArgs,
    sharedTableArgTypes
} from '../base/table-column-stories-utils';
import {
    apiCategory,
    checkValidityDescription,
    createUserSelectedThemeStory,
    validityDescription
} from '../../../utilities/storybook';

const metadata: Meta<SharedTableArgs> = {
    title: 'Components/Table Column: Anchor',
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
    }
};

export default metadata;

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        url: 'https://www.google.com/search?q=ralph+wiggum',
        address: '732 Evergreen Terrace',
        addressSortOrder: 0,
        addressUrl: 'https://www.google.com/search?q=732+Evergreen+Terrace'
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        url: 'https://www.google.com/search?q=milhouse+van+houten',
        address: '316 Pikeland Avenue',
        addressSortOrder: 3,
        addressUrl: 'https://www.google.com/search?q=316+Pikeland+Avenue'
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        url: 'https://www.google.com/search?q=ned+flanders',
        address: '744 Evergreen Terrace',
        addressSortOrder: 2,
        addressUrl: 'https://www.google.com/search?q=744+Evergreen+Terrace'
    },
    {
        firstName: 'Maggie (no link)',
        lastName: 'Simpson',
        address: '742 Evergreen Terrace',
        addressSortOrder: 1,
        addressUrl: 'https://www.google.com/search?q=742+Evergreen+Terrace'
    },
    {
        lastName: 'Simpson',
        fullName: 'Unknown Simpson',
        url: 'https://www.google.com/search?q=simpsons',
        address: 'Unknown Address',
        addressSortOrder: -1
    },
    {
        lastName: 'Simpson',
        fullName: 'Unknown Simpson',
        address: 'Unknown Address',
        addressSortOrder: -1
    },
    {
        firstName: 'Agnes',
        lastName: 'Skinner',
        url: 'https://www.google.com/search?q=agnes+skinner',
        address: '330 Pikeland Avenue',
        addressSortOrder: 4,
        addressUrl: 'https://www.google.com/search?q=330+Pikeland+Avenue'
    },
    {
        firstName: 'Moe',
        lastName: 'Szyslak',
        url: 'https://www.google.com/search?q=moe+szyslak',
        address: '57 Walnut Street',
        addressSortOrder: 5,
        addressUrl: 'https://www.google.com/search?q=57+Walnut+Street'
    }
] as const;

interface AnchorColumnTableArgs extends SharedTableArgs {
    labelFieldName: string;
    hrefFieldName: string;
    appearance: keyof typeof AnchorAppearance;
    underlineHidden: boolean;
    placeholder: string;
    sortByFieldName: never;
    checkValidity: never;
    validity: never;
}

export const anchorColumn: StoryObj<AnchorColumnTableArgs> = {
    parameters: {},
    // prettier-ignore
    render: createUserSelectedThemeStory(html<AnchorColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnAnchorTag}
                label-field-name="${x => x.labelFieldName}"
                href-field-name="${x => x.hrefFieldName}"
                appearance="${x => x.appearance}"
                ?underline-hidden="${x => x.underlineHidden}"
                placeholder="${x => x.placeholder}"
            >
                Link Column
            </${tableColumnAnchorTag}>
            <${tableColumnTextTag}
                field-name="lastName"
            >
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnAnchorTag}
                label-field-name="address"
                href-field-name="addressUrl"
                appearance="${x => x.appearance}"
                ?underline-hidden="${x => x.underlineHidden}"
                sort-by-field-name="addressSortOrder"
                grouping-disabled
            >
                Address
            </${tableColumnAnchorTag}>
        </${tableTag}>
    `),
    argTypes: {
        labelFieldName: {
            name: 'label-field-name',
            description:
                'Set this attribute to identify which field in the data record contains the visible text value for each cell in the column. The field values must be of type `string`. If a given row does not define a property with this name, that row will use the url as the label.',
            options: ['firstName', 'lastName'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        hrefFieldName: {
            name: 'href-field-name',
            description:
                'Set this attribute to identify which field in the data record contains the link url for each cell in the column. If the field is not defined in a particular record, that cell will be displayed as plain text instead of a link. The field values must be of type `string`.',
            control: false,
            table: { category: apiCategory.attributes }
        },
        appearance: {
            options: Object.keys(AnchorAppearance),
            control: { type: 'radio' },
            description:
                'Set to `prominent` to make the anchor appear in a different color than normal text. This has no effect under the Color theme.',
            table: { category: apiCategory.attributes }
        },
        underlineHidden: {
            name: 'underline-hidden',
            defaultValue: { summary: 'false' },
            description: 'Causes the underline to be hidden except on hover.',
            table: { category: apiCategory.attributes }
        },
        placeholder: {
            description:
                'The placeholder text to display when the label and href are both `undefined` or `null` for a record.',
            table: { category: apiCategory.attributes }
        },
        sortByFieldName: {
            name: 'sort-by-field-name',
            description:
                'Set this attribute to identify a numeric field to sort the column by. If not set, the column will sort by the `label-field-name` field. It is invalid for grouping to be enabled on a column with `sort-by-field-name` configured.',
            control: false,
            table: { category: apiCategory.attributes }
        },
        checkValidity: {
            name: 'checkValidity()',
            description: checkValidityDescription({
                componentName: 'anchor column'
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
                            'true when sort-by-field-name is specified while the column used for grouping.'
                    }
                ]
            }),
            table: { category: apiCategory.nonAttributeProperties },
            control: false
        }
    },
    args: {
        labelFieldName: 'firstName',
        hrefFieldName: 'url',
        appearance: 'default',
        underlineHidden: false,
        placeholder: 'Mystery',
        ...sharedTableArgs(simpleData)
    }
};
