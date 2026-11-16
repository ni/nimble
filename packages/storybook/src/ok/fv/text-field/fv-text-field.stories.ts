import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { html } from '@ni/fast-element';
import {
    fvTextFieldTag,
    type MaskitoOptions
} from '@ni/ok-components/dist/esm/fv/text-field';
import {
    apiCategory,
    createUserSelectedThemeStory,
    okWarning,
    placeholderDescription,
    slottedLabelDescription
} from '../../../utilities/storybook';

interface TextFieldArgs {
    label: string;
    placeholder: string;
    value: string;
    maskOptions: MaskitoOptions;
    input?: (event: Event) => void;
    change?: (event: Event) => void;
}

const alphanumericCharacter = /[A-Za-z0-9]/;
const uppercasePostprocessor: NonNullable<MaskitoOptions['postprocessors']>[number] = (
    { value, selection }
) => ({
    value: value.toUpperCase(),
    selection
});
const uppercaseGroupedMask: MaskitoOptions = {
    mask: [
        alphanumericCharacter,
        alphanumericCharacter,
        alphanumericCharacter,
        alphanumericCharacter,
        '-',
        alphanumericCharacter,
        alphanumericCharacter,
        alphanumericCharacter,
        alphanumericCharacter,
        '-',
        alphanumericCharacter,
        alphanumericCharacter,
        alphanumericCharacter,
        alphanumericCharacter,
        '-',
        alphanumericCharacter,
        alphanumericCharacter,
        alphanumericCharacter,
        alphanumericCharacter
    ],
    postprocessors: [uppercasePostprocessor]
};

const metadata: Meta<TextFieldArgs> = {
    title: 'Ok/Fv Text Field',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['input', 'change']
        }
    },
    render: createUserSelectedThemeStory(html<TextFieldArgs>`
        ${okWarning({
            componentName: 'Fv Text Field',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <${fvTextFieldTag}
            style="width: 320px;"
            placeholder="${x => x.placeholder}"
            :value="${x => x.value}"
            :maskOptions="${x => x.maskOptions}"
        >
            ${x => x.label}
        </${fvTextFieldTag}>
    `),
    argTypes: {
        label: {
            name: 'default',
            description: slottedLabelDescription({ componentName: 'Fv Text Field' }),
            table: { category: apiCategory.slots }
        },
        placeholder: {
            description: placeholderDescription({ componentName: 'Fv Text Field' }),
            table: { category: apiCategory.attributes }
        },
        value: {
            description: 'The current masked value.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        maskOptions: {
            description:
                'Maskito options applied to user and programmatic input. This API is available as a JavaScript property, not an HTML attribute.',
            table: { category: apiCategory.nonAttributeProperties },
            control: false
        },
        input: {
            table: { category: apiCategory.events },
            control: false
        },
        change: {
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        label: 'Identifier',
        placeholder: 'XXXX-XXXX-XXXX-XXXX',
        value: '',
        maskOptions: uppercaseGroupedMask
    }
};

export default metadata;

export const defaultStory: StoryObj<TextFieldArgs> = {
    name: 'Fv Text Field'
};