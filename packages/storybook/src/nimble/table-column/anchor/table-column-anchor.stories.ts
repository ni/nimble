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
import { createUserSelectedThemeStory } from '../../../utilities/storybook';

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
] as const;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AnchorColumnTableArgs extends SharedTableArgs {
    showActionMenu: boolean;
    labelFieldName: string;
    hrefFieldName: string;
    appearance: keyof typeof AnchorAppearance;
    underlineHidden: boolean;
    placeholder: string;
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
                action-menu-slot="${x => (x.showActionMenu ? 'name-menu' : null)}" action-menu-label="${x => (x.showActionMenu ? 'Configure name' : null)}"
            >
            Link Column
            </${tableColumnAnchorTag}>
            <${tableColumnTextTag}
                field-name="lastName"
            >
            Last Name
            </${tableColumnTextTag}>
            <${menuTag} slot="name-menu">
                <${menuItemTag}>Edit name</${menuItemTag}>
                <${menuItemTag}>Delete person</${menuItemTag}>
                <${menuItemTag}>Archive person</${menuItemTag}>
                <${menuItemTag}>Duplicate person</${menuItemTag}>
            </${menuTag}>
        </${tableTag}>
    `),
    argTypes: {
        showActionMenu: {
            name: 'Show action menu',
            description:
                'Show action menu'
        },
        labelFieldName: {
            name: 'label-field-name',
            description:
                'Set this attribute to identify which field in the data record contains the visible text value for each cell in the column. The field values must be of type `string`. If a given row does not define a property with this name, that row will use the url as the label.',
            options: ['firstName', 'lastName'],
            control: { type: 'radio' }
        },
        hrefFieldName: {
            name: 'href-field-name',
            description:
                'Set this attribute to identify which field in the data record contains the link url for each cell in the column. If the field is not defined in a particular record, that cell will be displayed as plain text instead of a link. The field values must be of type `string`.',
            control: false
        },
        appearance: {
            options: Object.keys(AnchorAppearance),
            control: { type: 'radio' },
            description:
                'Set to `prominent` to make the anchor appear in a different color than normal text. This has no effect under the Color theme.'
        },
        underlineHidden: {
            name: 'underline-hidden',
            defaultValue: { summary: 'false' },
            description: 'Causes the underline to be hidden except on hover.'
        },
        placeholder: {
            description:
                'The placeholder text to display when the label and href are both `undefined` or `null` for a record.'
        }
    },
    args: {
        showActionMenu: true,
        labelFieldName: 'firstName',
        hrefFieldName: 'url',
        appearance: 'default',
        underlineHidden: false,
        placeholder: 'Mystery',
        ...sharedTableArgs(simpleData)
    }
};
