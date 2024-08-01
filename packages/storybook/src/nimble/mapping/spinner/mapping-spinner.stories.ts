import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { mappingKeyDescription } from '../base/story-helpers';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';
import { hiddenWrapper } from '../../../utilities/hidden';

const metadata: Meta = {
    title: 'Internal/Mappings',
    parameters: {
        docs: {
            description: {
                component:
                    'The `nimble-mapping-spinner` element defines a mapping from a data value to the Nimble spinner. It is meant to be used as content of the `nimble-table-column-mapping` element.'
            }
        }
    }
};

export default metadata;

export const spinnerMapping: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        key: {
            description: mappingKeyDescription('a spinner'),
            control: false,
            table: { category: apiCategory.attributes }
        },
        text: {
            control: false,
            description: `A textual description of the value. The text will be displayed next to the spinner in a cell if \`text-hidden\` is not set,
                or as the tooltip and accessible  name of the spinner if \`text-hidden\` is set. The text is also displayed next to the spinner
                in a group header. This attribute is required.`,
            table: { category: apiCategory.attributes }
        },
        textHidden: {
            control: false,
            name: 'text-hidden',
            description:
                "When set, the text is hidden within the table's cells. When unset, the text is rendered next to the spinner within the cell.",
            table: { category: apiCategory.attributes }
        }
    },
    args: {}
};
