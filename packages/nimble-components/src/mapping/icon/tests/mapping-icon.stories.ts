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
            description:
                'The tag name of the Nimble icon to render, e.g. `nimble-icon-check`.'
        },
        severity: {
            description:
                'Must be one of the values in the `IconSeverity` enum. Controls the color of the icon.'
        },
        text: {
            description:
                'A textual description of the value which will be used as the tooltip and accessible name of the icon. The text is also displayed next to the icon in a group header.'
        }
    },
    args: {}
};
