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
                    'The `nimble-mapping-icon` element defines a mapping from a data value to an icon representation to use for that value. It is meant to be used as content of the `nimble-table-column-mapping` element.'
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
            control: false
        },
        icon: {
            control: false,
            description: 'The tag name of the Nimble icon to render, e.g. `nimble-icon-check`.'
        },
        severity: {
            control: false,
            description:
                'Must be one of the values in the `IconSeverity` enum. Controls the color of the icon.'
        },
        text: {
            control: false,
            description: `A textual description of the value. The text will be displayed next to the icon in a cell if \`text-hidden\` is not set,
            or as the tooltip and accessible  name of the icon if \`text-hidden\` is set. The text is also displayed next to the icon
            in a group header. This attribute is required.`
        },
        textHidden: {
            control: false,
            name: 'text-hidden',
            description:
                "When set, the text is hidden within the table's cells. When unset, the text is rendered next to the icon within the cell."
        }
    },
    args: {}
};
