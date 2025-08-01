import { html } from '@ni/fast-element';
import { Orientation } from '@ni/fast-web-utilities';
import { withActions } from 'storybook/actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { radioTag } from '@ni/nimble-components/dist/esm/radio';
import { radioGroupTag } from '@ni/nimble-components/dist/esm/radio-group';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    errorTextDescription,
    errorVisibleDescription,
    requiredVisibleDescription,
    slottedLabelDescription
} from '../../utilities/storybook';

interface RadioGroupArgs {
    label: string;
    orientation: Orientation;
    disabled: boolean;
    name: string;
    value: string;
    buttons: undefined;
    change: undefined;
    errorVisible: boolean;
    errorText: string;
    requiredVisible: boolean;
}

interface RadioArgs {
    label: string;
    value: string;
    disabled: boolean;
    name: string;
}

const metadata: Meta<RadioGroupArgs> = {
    title: 'Components/Radio Group'
};

export default metadata;

const nameDescription = 'Radio buttons whose values are mutually exclusive should set the same `name` attribute. Setting the name on the group sets it on all child radio buttons. When using radio buttons in an Angular form, you must explicitly set either `name` or `formControlName` on each radio button. In that scenario, setting `name` on the group is ineffective.';

export const radioGroup: StoryObj<RadioGroupArgs> = {
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change']
        }
    },
    render: createUserSelectedThemeStory(html`
        <${radioGroupTag}
            orientation="${x => x.orientation}"
            ?disabled="${x => x.disabled}"
            name="${x => x.name}"
            value="${x => (x.value === 'none' ? undefined : x.value)}"
            ?error-visible="${x => x.errorVisible}"
            error-text="${x => x.errorText}"
            ?required-visible="${x => x.requiredVisible}"
            style="min-width: 200px;"
        >
            <label slot="label">${x => x.label}</label>
            <${radioTag} value="apple">Apple</${radioTag}>
            <${radioTag} value="mango">Mango</${radioTag}>
            <${radioTag} value="orange">Orange</${radioTag}>
        </${radioGroupTag}>
    `),
    args: {
        label: 'Fruit',
        orientation: Orientation.horizontal,
        disabled: false,
        name: 'fruit',
        value: 'none',
        errorVisible: false,
        errorText: 'Value is invalid',
        requiredVisible: false
    },
    argTypes: {
        value: {
            options: ['none', 'apple', 'mango', 'orange'],
            control: {
                type: 'radio'
            },
            description:
                'The currently selected radio button. Each button should specify its unique value using its `value` attribute.',
            table: { category: apiCategory.attributes }
        },
        label: {
            description:
                'A `label` element containing text that describes the group of options.',
            table: { category: apiCategory.slots }
        },
        orientation: {
            options: Object.values(Orientation),
            control: {
                type: 'radio'
            },
            description: 'The orientation of the radio buttons.',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'radio group' }),
            table: { category: apiCategory.attributes }
        },
        name: {
            description: nameDescription,
            table: { category: apiCategory.attributes }
        },
        buttons: {
            name: 'default',
            description: `The \`${radioTag}\` elements to display in the group.`,
            control: false,
            table: { category: apiCategory.slots }
        },
        change: {
            description:
                'Event emitted when the user selects a new value in the radio group.',
            table: { category: apiCategory.events },
            control: false
        },
        errorText: {
            name: 'error-text',
            description: errorTextDescription,
            table: { category: apiCategory.attributes }
        },
        errorVisible: {
            name: 'error-visible',
            description: errorVisibleDescription,
            table: { category: apiCategory.attributes }
        },
        requiredVisible: {
            name: 'required-visible',
            description: requiredVisibleDescription,
            table: { category: apiCategory.attributes }
        }
    }
};

export const radio: StoryObj<RadioArgs> = {
    render: createUserSelectedThemeStory(html`
        <${radioTag} value="${x => x.value}" ?disabled="${x => x.disabled}">${x => x.label}</${radioTag}>
    `),
    args: {
        disabled: false,
        name: 'fruit',
        label: 'Apple',
        value: 'none'
    },
    argTypes: {
        value: {
            control: false,
            description:
                'The value of the radio button. Used by the radio group `value` attribute to determine the selected radio button.',
            table: { category: apiCategory.attributes }
        },
        label: {
            description: slottedLabelDescription({
                componentName: 'radio button'
            }),
            table: { category: apiCategory.slots }
        },
        disabled: {
            description: disabledDescription({ componentName: 'radio button' }),
            table: { category: apiCategory.attributes }
        },
        name: {
            description: nameDescription,
            table: { category: apiCategory.attributes }
        }
    }
};
