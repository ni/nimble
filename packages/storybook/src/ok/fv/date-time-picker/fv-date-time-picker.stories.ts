import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { html } from '@ni/fast-element';
import { fvDateTimePickerTag } from '@ni/ok-components/dist/esm/fv/date-time-picker';
import { FvDateTimePickerAppearance, FvDateTimePickerType } from '@ni/ok-components/dist/esm/fv/date-time-picker/types';
import { apiCategory, createUserSelectedThemeStory, okWarning } from '../../../utilities/storybook';

interface DateTimePickerArgs {
    appearance: FvDateTimePickerAppearance;
    type: FvDateTimePickerType;
    value: string;
    min: string;
    max: string;
    step: string;
    label: string;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    open: boolean;
}

const metadata: Meta<DateTimePickerArgs> = {
    title: 'Ok/Fv Date Time Picker',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: { handles: ['input', 'change'] }
    },
    render: createUserSelectedThemeStory(html<DateTimePickerArgs>`
        ${okWarning({
            componentName: 'Fv Date Time Picker',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <div style="padding: 16px; min-height: 460px;">
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
                ?required-visible="${x => x.required}"
                ?open="${x => x.open}"
            >${x => x.label}</${fvDateTimePickerTag}>
        </div>
    `),
    argTypes: {
        appearance: {
            options: Object.values(FvDateTimePickerAppearance),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        value: {
            description: 'YYYY-MM-DD for date mode; YYYY-MM-DDTHH:mm with optional seconds/fractions for datetime-local. No time zone.',
            table: { category: apiCategory.attributes }
        },
        type: {
            options: Object.values(FvDateTimePickerType),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        min: { description: 'Earliest value, in the same format as value.', table: { category: apiCategory.attributes } },
        max: { description: 'Latest value, in the same format as value.', table: { category: apiCategory.attributes } },
        step: { description: 'Days for date; seconds for datetime-local. Defaults to 1 day or 60 seconds. Use "any" for no step restriction.', table: { category: apiCategory.attributes } },
        label: { description: 'The default slot labels the field.' },
        disabled: { table: { category: apiCategory.attributes } },
        readOnly: { table: { category: apiCategory.attributes } },
        required: { table: { category: apiCategory.attributes } },
        open: { table: { category: apiCategory.attributes } }
    },
    args: {
        appearance: FvDateTimePickerAppearance.underline,
        type: FvDateTimePickerType.datetimeLocal,
        label: 'Date and time',
        value: '2024-11-13T14:25',
        min: '',
        max: '',
        step: '',
        disabled: false,
        readOnly: false,
        required: false,
        open: false
    }
};

export default metadata;

export const defaultStory: StoryObj<DateTimePickerArgs> = {
    name: 'Fv Date Time Picker'
};

export const empty: StoryObj<DateTimePickerArgs> = {
    args: { value: '' }
};

export const dateOnly: StoryObj<DateTimePickerArgs> = {
    args: { type: FvDateTimePickerType.date, value: '2024-11-13', label: 'Date' }
};

export const constrained: StoryObj<DateTimePickerArgs> = {
    args: { min: '2024-11-10T09:00', max: '2024-11-20T17:00', step: '900', value: '2024-11-13T14:30' }
};
