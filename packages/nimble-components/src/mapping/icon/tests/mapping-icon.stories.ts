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
                    'The `nimble-mapping-icon` element defines a mapping from a data value to an icon representation to use for that value. It is meant to be used as content of the `nimble-table-column-icon` element.'
            }
        }
    }
};

export default metadata;

export const iconMapping: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        key: {
            description: mappingKeyDescription('the mapped icon'),
            control: { type: 'none' }
        },
        icon: {
            control: { type: 'none' },
            description: `The tag name of the Nimble icon to render, e.g. \`nimble-icon-check\`. Alternatively, set \`icon\` to \`undefined\` to render
                no icon for the mapping while still providing a label to be used when grouping. Space will always be reserved for the icon so
                that the text in cells and group rows associated with icon mappings will always be aligned.`
        },
        severity: {
            control: { type: 'none' },
            description:
                'Must be one of the values in the `IconSeverity` enum. Controls the color of the icon.'
        },
        text: {
            control: { type: 'none' },
            description: `A textual description of the value. The text will be displayed next to the icon in a cell if \`text-hidden\` is not set,
            or as the tooltip and accessible  name of the icon if \`text-hidden\` is set. The text is also displayed next to the icon
            in a group header. This attribute is required.`
        },
        textHidden: {
            control: { type: 'none' },
            name: 'text-hidden',
            description:
                "When set, the text is hidden within the table's cells. When unset, the text is rendered next to the icon within the cell."
        }
    },
    args: {}
};
