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
                    `The \`nimble-mapping-empty\` element can be provided as content of \`nimble-table-column-mapping\` to define data values that
                    should render as empty table cells while still having meaningful text on the value's group row. For each such data value, provide a
                    \`nimble-mapping-empty\` element that maps the value to the text to display on the group row for that value.`
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
            description: 'A textual description of the value. This value will be displayed in group rows, but table cells will be empty. This attribute is required.'
        }
    },
    args: {}
};
