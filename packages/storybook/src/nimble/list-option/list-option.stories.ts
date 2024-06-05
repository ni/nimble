import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { selectTag } from '@ni/nimble-components/src/select';
import { listOptionTag } from '@ni/nimble-components/src/list-option';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const metadata: Meta = {
    title: 'Internal/List Option',
    parameters: {
        docs: {
            description: {
                component: `The ${listOptionTag} component is used to define the options that are available in its parent component.`
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
            description: `The value associated with the option. Some parent components like the ${selectTag} will use this value as their own when this option is selected.`,
            table: { category: apiCategory.attributes },
            control: false
        },
        selected: {
            name: 'selected',
            description:
                'Represents which option in a set is currently selected. Note only one option can be selected at a time. This is managed by the parent component, but can be given an initial value.',
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
            description:
                'When true, the option is not displayed in the dropdown.',
            table: { category: apiCategory.attributes },
            control: false
        }
    }
};
