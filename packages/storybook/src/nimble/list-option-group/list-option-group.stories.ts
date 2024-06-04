import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { listOptionGroupTag } from '@ni/nimble-components/src/list-option-group';
import { selectTag } from '@ni/nimble-components/src/select';
import { listOptionTag } from '@ni/nimble-components/src/list-option';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const groupedDescription = `
To group options in a select, you can use the \`${listOptionGroupTag}\` element. This element should be placed within the \`${selectTag}\` and contain the \`${listOptionTag}\` elements that you want to group. Note that a \`${listOptionGroupTag}\` placed within another \`${listOptionGroupTag}\` is not supported.
`;

const metadata: Meta = {
    title: 'Internal/List Option Group',
    parameters: {
        docs: {
            description: {
                component: groupedDescription
            }
        }
    }
};

export default metadata;
export const listOptionGroup: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        content: {
            name: 'default',
            description:
                'Add options to the default slot of a group to have them appear under it in the select. Additionally, you can provide the label for the group as content of the group element. This content can be plain text or a span element.',
            table: { category: apiCategory.slots },
            control: false
        },
        label: {
            name: 'label',
            description:
                'The label of the group. This label will be displayed in the dropdown above the options. If the label attribute is set, any label content in the default slot will be ignored.',
            table: { category: apiCategory.attributes },
            control: false
        },
        hidden: {
            description:
                'When true, the group and its options are not displayed in the dropdown.',
            table: { category: apiCategory.attributes }
        }
    }
};
