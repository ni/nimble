import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { DateTimePickerAppearance } from '../types';
import { dateTimePickerTag } from '..';

interface DateTimePickerArgs {
    label: string;
    appearance: string;
    errorVisible: boolean;
    errorText: string;
    dateTimeLocalInputRef: HTMLInputElement;
    dateInputRef: HTMLInputElement;
    timeInputRef: HTMLInputElement;
}

const metadata: Meta<DateTimePickerArgs> = {
    title: 'Components/DateTime Picker',
    decorators: [],
    parameters: {
        actions: {}
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${dateTimePickerTag}
            placeholder="${x => x.label}"
            appearance="${x => x.appearance}"
            value="${_x => ''}"
            ?readonly="${_x => false}"
            ?disabled="${_x => false}"
            error-text="${x => x.errorText}"
            ?error-visible="${x => x.errorVisible}"
        >
            ${x => x.label}
        </${dateTimePickerTag}>
        <br/><br/><br/><br/>
        <h3>Test the native date/time inputs directly below</h3>
        <p>
        <input type="datetime-local" ${ref('dateTimeLocalInputRef')} />
        <button @click="${x => x.dateTimeLocalInputRef.showPicker()}">Show the datetime-local picker</button>
        </p>
        <p>
        <input type="date" ${ref('dateInputRef')} />
        <button @click="${x => x.dateInputRef.showPicker()}">Show the date picker</button>
        </p>
        <p>
        <input type="time" ${ref('timeInputRef')} />
        <button @click="${x => x.timeInputRef.showPicker()}">Show the time picker</button>
        </p>
    `),
    argTypes: {
        appearance: {
            options: Object.values(DateTimePickerAppearance),
            control: { type: 'radio' }
        },
        errorText: {
            description:
                'A message to be displayed when the text field is in the invalid state explaining why the value is invalid'
        }
    },
    args: {
        label: 'default label',
        appearance: 'underline',
        errorVisible: false,
        errorText: 'Value is invalid'
    }
};

export default metadata;

export const underlineTextField: StoryObj<DateTimePickerArgs> = {
    args: { label: 'Underline Date/Time Picker', appearance: 'underline' }
};

export const blockTextField: StoryObj<DateTimePickerArgs> = {
    args: { label: 'Block Date/Time Picker', appearance: 'block' }
};

export const outlineTextField: StoryObj<DateTimePickerArgs> = {
    args: { label: 'Outline Date/Time Picker', appearance: 'outline' }
};
