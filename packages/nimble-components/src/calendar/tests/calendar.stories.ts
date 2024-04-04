import { html } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { calendarTag } from '..';

interface CalendarArgs {
    label: string;
}

const metadata: Meta<CalendarArgs> = {
    title: 'Components/Calendar',
    decorators: [withActions<HtmlRenderer>],
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${calendarTag}
        </${calendarTag}>
    `)
};

export default metadata;

export const calendar: StoryObj<CalendarArgs> = {};