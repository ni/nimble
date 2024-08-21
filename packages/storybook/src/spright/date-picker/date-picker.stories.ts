import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import {
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
} from '../../utilities/storybook';
import { datePickerTag } from '../../../../spright-components/src/date-picker/date-picker';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DatePickerArgs {
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
            ></${datePickerTag}>
        </div>
    `),
    argTypes: {
    },
    args: {
    }
};

export default metadata;

export const datePicker: StoryObj<DatePickerArgs> = {};
