import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { mappingKeyDescription } from '../base/story-helpers';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';
import { hiddenWrapper } from '../../../utilities/hidden';

const metadata: Meta = {
    title: 'Internal/Mappings',
    parameters: {
        docs: {
            description: {
                component:
                    `The \`nimble-mapping-empty\` element defines a mapping from a data value to text. It is meant to be used as content of the \`nimble-table-column-mapping\` element
                    when the table cell should not include the mapped value and the column is groupable.`
            }
        }
    }
};

export default metadata;

export const emptyMapping: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        key: {
            control: false,
            description: mappingKeyDescription('nothing')
        },
        text: {
            control: false,
            description: 'A textual description of the value. The table cells will render as empty, and the text will be displayed in a group header. This attribute is required.'
        }
    },
    args: {}
};
