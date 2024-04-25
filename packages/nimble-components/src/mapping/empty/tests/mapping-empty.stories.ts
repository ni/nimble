import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { hiddenWrapper } from '../../../utilities/tests/hidden';
import { mappingKeyDescription } from '../../base/tests/story-helpers';

const metadata: Meta = {
    title: 'Internal/Mappings',
    parameters: {
        docs: {
            description: {
                component:
                    `The \`nimble-mapping-empty\` element defines a mapping from a data value to text. It is meant to be used as content of the \`nimble-table-column-icon\` element
                    when the table cell should not include the mapped value. This mapping allows clients to avoid cluttering their table with information that isn't particularly
                    helpful to a user (e.g. that the state of a system is 'idle') while still having a good grouping experience that ensures group rows are not empty.`
            }
        }
    }
};

export default metadata;

export const emptyMapping: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        key: {
            description: mappingKeyDescription('nothing'),
            control: { type: 'none' }
        },
        text: {
            control: { type: 'none' },
            description: 'A textual description of the value. The table cells will render as empty, and the text will be displayed in a group header. This attribute is required.'
        }
    },
    args: {}
};
