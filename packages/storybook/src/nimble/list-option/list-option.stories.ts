import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { apiCategory, createUserSelectedThemeStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const metadata: Meta = {
    title: 'Internal/ListOption',
    parameters: {
        docs: {
            description: {
                component:
                    'The `nimble-list-option` component is used to define the options that are available to the `nimble-select` component.'
            }
        }
    }
};

export default metadata;

export const listOption: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        label: {
            name: 'default',
            description: 'The displayed text of the option.',
            table: { category: apiCategory.slots },
            control: false
        },
        value: {
            name: 'value',
            description: 'The value associated with the option. When selected, this value will be used as the value of the select.',
            table: { category: apiCategory.attributes },
            control: false
        },
        selected: {
            name: 'selected',
            description: 'When true, the value of the select will match the value of this option. Note only one option can be selected at a time.',
            table: { category: apiCategory.attributes },
            control: false
        },
        disabled: {
            name: 'disabled',
            description: 'When true, the option is not selectable.',
            table: { category: apiCategory.attributes },
            control: false
        },
        hidden: {
            name: 'hidden',
            description: 'When true, the option is not displayed in the dropdown.',
            table: { category: apiCategory.attributes },
            control: false
        },
    }
};
