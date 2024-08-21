import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import {
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
} from '../../utilities/storybook';
import { datePickerTag } from '../../../../spright-components/src/date-picker/date-picker';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DatePickerArgs {
    disabled: boolean;
    min: boolean;
    max: boolean;
}

const metadata: Meta<DatePickerArgs> = {
    title: 'Spright/DatePicker',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        ${disableStorybookZoomTransform}
        <div style="height: 300px;">
            <${datePickerTag}
                ?disabled=${x => x.disabled}
                min=${x => (x.min ? '2024-08-04' : undefined)}
                max=${x => (x.max ? '2024-08-25' : undefined)}
            ></${datePickerTag}>
        </div>
    `),
    argTypes: {
    },
    args: {
        disabled: false,
        min: false,
        max: false
    }
};

export default metadata;

export const datePicker: StoryObj<DatePickerArgs> = {};
