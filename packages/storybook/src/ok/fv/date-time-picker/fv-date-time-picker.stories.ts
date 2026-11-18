import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { html } from '@ni/fast-element';
import { themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';
import { fvDateTimePickerTag } from '@ni/ok-components/dist/esm/fv/date-time-picker';
import { FvDateTimePickerAppearance, FvDateTimePickerType } from '@ni/ok-components/dist/esm/fv/date-time-picker/types';
import {
    apiCategory,
    appearanceDescription,
    appearanceReadOnlyDescription,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    disabledDescription,
    errorTextDescription,
    errorVisibleDescription,
    fullBleedDescription,
    okWarning,
    placeholderDescription,
    readonlyDescription,
    requiredVisibleDescription,
    slottedLabelDescription
} from '../../../utilities/storybook';

interface DateTimePickerArgs {
    appearance: FvDateTimePickerAppearance;
    type: FvDateTimePickerType;
    locale: string;
    value: string;
    min: string;
    max: string;
    step: string;
    label: string;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    open: boolean;
    placeholder: string;
    autocomplete: string;
    fullBleed: boolean;
    appearanceReadOnly: boolean;
    requiredVisible: boolean;
    errorVisible: boolean;
    errorText: string;
    input: undefined;
    change: undefined;
}

const metadata: Meta<DateTimePickerArgs> = {
    title: 'Ok/Fv Date Time Picker',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: { handles: ['input', 'change'] }
    },
    render: createUserSelectedThemeStory(html<DateTimePickerArgs>`
        ${disableStorybookZoomTransform}
        ${okWarning({
            componentName: 'Fv Date Time Picker',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <${themeProviderTag} lang="${x => x.locale}" style="display: block; padding: 16px;">
            <${fvDateTimePickerTag}
                style="width: 320px;"
                appearance="${x => x.appearance}"
                type="${x => x.type}"
                value="${x => x.value}"
                min="${x => x.min}"
                max="${x => x.max}"
                step="${x => x.step}"
                ?disabled="${x => x.disabled}"
                ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}"
                ?required-visible="${x => x.requiredVisible}"
                ?full-bleed="${x => x.fullBleed}"
                ?appearance-readonly="${x => x.appearanceReadOnly}"
                placeholder="${x => x.placeholder}"
                autocomplete="${x => x.autocomplete}"
                error-text="${x => x.errorText}"
                ?error-visible="${x => x.errorVisible}"
                ?open="${x => x.open}"
            >${x => x.label}</${fvDateTimePickerTag}>
        </${themeProviderTag}>
    `),
    argTypes: {
        locale: {
            name: 'lang',
            description: 'The `lang` attribute set on the surrounding `nimble-theme-provider`, not on the date time picker itself. Controls date order, month names, week start, and 12/24-hour time; UI labels remain English.',
            options: ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP', 'zh-CN', 'ar-EG'],
            control: { type: 'select' },
            table: { category: apiCategory.attributes }
        },
        appearance: {
            description: appearanceDescription({ componentName: 'date time picker' }),
            options: Object.values(FvDateTimePickerAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        type: {
            description: 'Selects whether the picker edits a date (`date`) or a local date and time (`datetime-local`).',
            options: Object.values(FvDateTimePickerType),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        value: {
            description: 'YYYY-MM-DD for date mode; YYYY-MM-DDTHH:mm with optional seconds/fractions for datetime-local. No time zone.',
            table: { category: apiCategory.attributes }
        },
        min: {
            description: 'Earliest allowed value, in the same format as `value`.',
            table: { category: apiCategory.attributes }
        },
        max: {
            description: 'Latest allowed value, in the same format as `value`.',
            table: { category: apiCategory.attributes }
        },
        step: {
            description: 'Days for date; seconds for datetime-local. Defaults to 1 day or 60 seconds. Use "any" for no step restriction.',
            table: { category: apiCategory.attributes }
        },
        placeholder: {
            description: placeholderDescription({ componentName: 'date time picker' }),
            table: { category: apiCategory.attributes }
        },
        autocomplete: {
            description: 'The autofill hint forwarded to the internal input. This corresponds to [the `autocomplete` attribute of the native `input` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete).',
            table: { category: apiCategory.attributes }
        },
        fullBleed: {
            name: 'full-bleed',
            description: fullBleedDescription({ componentName: 'date time picker' }),
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'date time picker' }),
            table: { category: apiCategory.attributes }
        },
        readOnly: {
            name: 'readonly',
            description: readonlyDescription({ componentName: 'date time picker' }),
            table: { category: apiCategory.attributes }
        },
        appearanceReadOnly: {
            name: 'appearance-readonly',
            description: appearanceReadOnlyDescription({ componentName: 'date time picker' }),
            table: { category: apiCategory.attributes }
        },
        required: {
            description: 'When set to `true`, an empty value is invalid. Use `required-visible` to also display a required indicator.',
            table: { category: apiCategory.attributes }
        },
        requiredVisible: {
            name: 'required-visible',
            description: requiredVisibleDescription,
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
        open: {
            description: 'When set to `true`, the calendar picker is open. It is set back to `false` when the picker closes, and can only be opened when the control is neither disabled nor readonly.',
            table: { category: apiCategory.attributes }
        },
        label: {
            name: 'default',
            description: slottedLabelDescription({ componentName: 'date time picker' }),
            table: { category: apiCategory.slots }
        },
        input: {
            description: 'Event emitted when the value changes through user interaction, such as typing, pasting, or selecting from the picker.',
            table: { category: apiCategory.events },
            control: false
        },
        change: {
            description: 'Event emitted when the user commits a value by finishing a field edit or selecting from the picker.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        appearance: FvDateTimePickerAppearance.underline,
        type: FvDateTimePickerType.datetimeLocal,
        locale: 'en-US',
        label: 'Date and time',
        value: '2024-11-13T14:25',
        min: '',
        max: '',
        step: '',
        disabled: false,
        readOnly: false,
        required: false,
        requiredVisible: false,
        placeholder: '',
        autocomplete: '',
        fullBleed: false,
        appearanceReadOnly: false,
        errorVisible: false,
        errorText: 'Value is invalid',
        open: false
    }
};

export default metadata;

export const defaultStory: StoryObj<DateTimePickerArgs> = {
    name: 'Fv Date Time Picker'
};
