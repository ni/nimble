import { html } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { datePickerTag } from '..';

interface DatePickerArgs {
    label: string;
}

const metadata: Meta<DatePickerArgs> = {
    title: 'Components/DatePicker',
    decorators: [withActions<HtmlRenderer>],
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${datePickerTag}
        </${datePickerTag}>
    `)
};

export default metadata;

export const datePicker: StoryObj<DatePickerArgs> = {};