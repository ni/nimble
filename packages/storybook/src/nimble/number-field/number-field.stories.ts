import { html } from '@ni/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { labelProviderCoreTag } from '@ni/nimble-components/dist/esm/label-provider/core';
import {
    numericDecrementLabel,
    numericIncrementLabel
} from '@ni/nimble-components/dist/esm/label-provider/core/label-tokens';
import { numberFieldTag } from '@ni/nimble-components/dist/esm/number-field';
import { NumberFieldAppearance } from '@ni/nimble-components/dist/esm/number-field/types';
import {
    addLabelUseMetadata,
    type LabelUserArgs
} from '../label-provider/base/label-user-stories-utils';
import {
    apiCategory,
    appearanceDescription,
    createUserSelectedThemeStory,
    disabledDescription,
    readonlyDescription,
    errorTextDescription,
    errorVisibleDescription,
    slottedLabelDescription,
    requiredVisibleDescription,
    placeholderDescription,
    appearanceReadOnlyDescription,
    fullBleedDescription
} from '../../utilities/storybook';

interface NumberFieldArgs extends LabelUserArgs {
    label: string;
    value: string;
    valueAsNumber: number;
    placeholder: string;
    step: number;
    hideStep: boolean;
    min: number;
    max: number;
    appearance: NumberFieldAppearance;
    readonly: boolean;
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    change: undefined;
    input: undefined;
    requiredVisible: boolean;
    appearanceReadOnly: boolean;
    fullBleed: boolean;
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
            placeholder="${x => x.placeholder}"
            value="${x => x.value}"
            step="${x => x.step}"
            ?hide-step="${x => x.hideStep}"
            min="${x => x.min}"
            max="${x => x.max}"
            appearance="${x => x.appearance}"
            ?readonly="${x => x.readonly}"
            ?disabled="${x => x.disabled}"
            ?appearance-readonly="${x => x.appearanceReadOnly}"
            ?error-visible="${x => x.errorVisible}"
            error-text="${x => x.errorText}"
            ?required-visible="${x => x.requiredVisible}"
            ?full-bleed="${x => x.fullBleed}"
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
                'The string representation of the number displayed in the number field. This value is not locale-dependent and always uses a dot as the decimal separator. Note that the `value` property is not synced to the `value` attribute, which only controls the initial value.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        valueAsNumber: {
            description:
                "The number displayed in the number field. This property is not exposed in Angular or Blazor, as those frameworks already access the component's value as a numeric type.",
            table: { category: apiCategory.nonAttributeProperties },
            control: false,
            type: 'number'
        },
        placeholder: {
            description: placeholderDescription({
                componentName: 'number field'
            }),
            table: { category: apiCategory.attributes }
        },
        appearance: {
            options: Object.values(NumberFieldAppearance),
            control: { type: 'radio' },
            description: appearanceDescription({
                componentName: 'number field'
            }),
            table: { category: apiCategory.attributes }
        },
        fullBleed: {
            name: 'full-bleed',
            description: fullBleedDescription({
                componentName: 'number field'
            }),
            table: { category: apiCategory.attributes }
        },
        readonly: {
            description: readonlyDescription({ componentName: 'number field' }),
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'number field' }),
            table: { category: apiCategory.attributes }
        },
        appearanceReadOnly: {
            name: 'appearance-readonly',
            description: appearanceReadOnlyDescription({
                componentName: 'number field'
            }),
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
        requiredVisible: {
            name: 'required-visible',
            description: requiredVisibleDescription,
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
        value: '42',
        placeholder: 'Enter number...',
        step: 1,
        hideStep: false,
        min: -10,
        max: 50,
        appearance: NumberFieldAppearance.underline,
        fullBleed: false,
        readonly: false,
        disabled: false,
        appearanceReadOnly: false,
        errorVisible: false,
        errorText: 'Value is invalid',
        requiredVisible: false
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

export const framelessNumberField: StoryObj<NumberFieldArgs> = {
    args: {
        label: 'Frameless Number Field',
        appearance: NumberFieldAppearance.frameless
    }
};
