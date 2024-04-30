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
                    'The `nimble-mapping-spinner` element defines a mapping from a data value to the Nimble spinner. It is meant to be used as content of the `nimble-table-column-icon` element.'
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
            control: { type: 'none' }
        },
        text: {
            control: { type: 'none' },
            description: `A textual description of the value. The text will be displayed next to the spinner in a cell if \`text-hidden\` is not set,
                or as the tooltip and accessible  name of the spinner if \`text-hidden\` is set. The text is also displayed next to the spinner
                in a group header. This attribute is required.`
        },
        textHidden: {
            control: { type: 'none' },
            name: 'text-hidden',
            description:
                "When set, the text is hidden within the table's cells. When unset, the text is rendered next to the spinner within the cell."
        }
    },
    args: {}
};
