import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { NumberFieldAppearance } from '../types';
import { numberFieldTag } from '..';

interface NumberFieldArgs {
    label: string;
    value: number;
    step: number;
    min: number;
    max: number;
    appearance: NumberFieldAppearance;
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
}

const metadata: Meta<NumberFieldArgs> = {
    title: 'Number Field',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Similar to a single line text box but only used for numeric data. The controls allow the user to increment and decrement the value.'
            }
        },
        actions: {
            handles: ['change', 'input']
        }
    },
    render: createUserSelectedThemeStory(html`
        <${numberFieldTag}
            placeholder="${x => x.label}"
            value="${x => x.value}"
            step="${x => x.step}"
            min="${x => x.min}"
            max="${x => x.max}"
            appearance="${x => x.appearance}"
            ?disabled="${x => x.disabled}"
            ?error-visible="${x => x.errorVisible}"
            error-text="${x => x.errorText}"
        >
            ${x => x.label}
        </${numberFieldTag}>
    `),
    argTypes: {
        appearance: {
            options: Object.values(NumberFieldAppearance),
            control: { type: 'radio' }
        },
        errorText: {
            name: 'error-text'
        },
        errorVisible: {
            name: 'error-visible'
        }
    },
    args: {
        label: 'default label',
        value: 42,
        step: 1,
        min: -10,
        max: 50,
        appearance: NumberFieldAppearance.underline,
        disabled: false,
        errorVisible: false,
        errorText: 'Value is invalid'
    }
};

export default metadata;

export const underlineNumberField: StoryObj<NumberFieldArgs> = {
    args: {
        label: 'Underline Number Field',
        appearance: NumberFieldAppearance.underline
    }
};

export const outlineNumberField: StoryObj<NumberFieldArgs> = {
    args: {
        label: 'Outline Number Field',
        appearance: NumberFieldAppearance.outline
    }
};

export const blockNumberField: StoryObj<NumberFieldArgs> = {
    args: {
        label: 'Block Number Field',
        appearance: NumberFieldAppearance.block
    }
};
