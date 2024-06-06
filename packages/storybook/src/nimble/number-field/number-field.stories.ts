import { html } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { labelProviderCoreTag } from '../../../../nimble-components/src/label-provider/core';
import {
    numericDecrementLabel,
    numericIncrementLabel
} from '../../../../nimble-components/src/label-provider/core/label-tokens';
import { numberFieldTag } from '../../../../nimble-components/src/number-field';
import { NumberFieldAppearance } from '../../../../nimble-components/src/number-field/types';
import {
    addLabelUseMetadata,
    type LabelUserArgs
} from '../label-provider/base/label-user-stories-utils';
import {
    apiCategory,
    appearanceDescription,
    createUserSelectedThemeStory,
    disabledDescription,
    errorTextDescription,
    errorVisibleDescription,
    slottedLabelDescription
} from '../../utilities/storybook';

interface NumberFieldArgs extends LabelUserArgs {
    label: string;
    value: number;
    step: number;
    hideStep: boolean;
    min: number;
    max: number;
    appearance: NumberFieldAppearance;
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    change: undefined;
    input: undefined;
}

const metadata: Meta<NumberFieldArgs> = {
    title: 'Components/Number Field',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change', 'input']
        }
    },
    render: createUserSelectedThemeStory(html`
        <${numberFieldTag}
            placeholder="${x => x.label}"
            value="${x => x.value}"
            step="${x => x.step}"
            ?hide-step="${x => x.hideStep}"
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
        label: {
            name: 'default',
            description: `${slottedLabelDescription({ componentName: 'number field' })}`,
            table: { category: apiCategory.slots }
        },
        value: {
            description:
                'The number displayed in the number field. Note that the property value is not synced to an attribute.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        appearance: {
            options: Object.values(NumberFieldAppearance),
            control: { type: 'radio' },
            description: appearanceDescription({
                componentName: 'number field'
            }),
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'number field' }),
            table: { category: apiCategory.attributes }
        },
        step: {
            description:
                'The amount to increase or decrease the value when a step button is pressed.',
            table: { category: apiCategory.attributes }
        },
        hideStep: {
            name: 'hide-step',
            description:
                'Configures the visibility of the increment and decrement step buttons. Consider hiding the buttons if the input values will commonly have varied levels of precision (for example both integers and decimal numbers).',
            table: { category: apiCategory.attributes }
        },
        min: {
            description: 'The minimum value that can be set.',
            table: { category: apiCategory.attributes }
        },
        max: {
            description: 'The maximum value that can be set.',
            table: { category: apiCategory.attributes }
        },
        errorVisible: {
            name: 'error-visible',
            description: errorVisibleDescription,
            table: { category: apiCategory.attributes }
        },
        errorText: {
            name: 'error-text',
            description: errorTextDescription,
            table: { category: apiCategory.attributes }
        },
        change: {
            description:
                'Event emitted when the user commits a new value to the number field.',
            table: { category: apiCategory.events },
            control: false
        },
        input: {
            description:
                'Event emitted on each user keystroke within the number field.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        label: 'default label',
        value: 42,
        step: 1,
        hideStep: false,
        min: -10,
        max: 50,
        appearance: NumberFieldAppearance.underline,
        disabled: false,
        errorVisible: false,
        errorText: 'Value is invalid'
    }
};
addLabelUseMetadata(
    metadata,
    labelProviderCoreTag,
    numericDecrementLabel,
    numericIncrementLabel
);

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
