import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createThemeAwareStory } from '../../utilities/tests/storybook';
import '..';

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
    render: createThemeAwareStory(html`
        <nimble-toolbar>
            <nimble-button appearance="ghost" slot="start">
                <nimble-eye-icon slot="start"></nimble-eye-icon>
                View
            </nimble-button>
            <nimble-button disabled appearance="ghost" slot="start">
                <nimble-trash-icon slot="start"></nimble-trash-icon>
                Delete
            </nimble-button>
            <nimble-button appearance="ghost" slot="start">
                <nimble-pencil-icon slot="start"></nimble-pencil-icon>
                Edit
            </nimble-button>

            <nimble-button appearance="ghost" content-hidden slot="end">
                <nimble-cog-icon slot="start"></nimble-cog-icon>
                Settings
            </nimble-button>
            <nimble-button appearance="ghost" content-hidden slot="end">
                <nimble-filter-icon slot="start"></nimble-filter-icon>
                Filter
            </nimble-button>
        </nimble-toolbar>
    `)
};

export default metadata;

export const toolbar: StoryObj = {};
