import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#toolbar) - A toolbar is a container
for grouping a set of controls, such as buttons, menubuttons, or checkboxes.

When a set of controls is visually presented as a group, the toolbar role can be used to communicate the
presence and purpose of the grouping to screen reader users. Grouping controls into toolbars can also be
an effective way of reducing the number of tab stops in the keyboard interface.

To override the toolbar's background color, style the \`positioning-region\` part:
\`
nimble-toolbar::part(positioning-region) {
    background: red;
}
\``;

const metadata: Meta = {
    title: 'Toolbar',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-toolbar>
            <nimble-button appearance="ghost" slot="start">
                <nimble-icon-eye slot="start"></nimble-icon-eye>
                View
            </nimble-button>
            <nimble-button disabled appearance="ghost" slot="start">
                <nimble-icon-trash slot="start"></nimble-icon-trash>
                Delete
            </nimble-button>
            <nimble-button appearance="ghost" slot="start">
                <nimble-icon-pencil slot="start"></nimble-icon-pencil>
                Edit
            </nimble-button>

            <nimble-button appearance="ghost" content-hidden slot="end">
                <nimble-icon-cog slot="start"></nimble-icon-cog>
                Settings
            </nimble-button>
            <nimble-button appearance="ghost" content-hidden slot="end">
                <nimble-icon-filter slot="start"></nimble-icon-filter>
                Filter
            </nimble-button>
        </nimble-toolbar>
    `)
};

export default metadata;

export const toolbar: StoryObj = {};
