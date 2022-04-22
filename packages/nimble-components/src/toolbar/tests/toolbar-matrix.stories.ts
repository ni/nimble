import type { Meta, Story } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Toolbar',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = html`
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

        <nimble-button appearance="ghost">
            <nimble-arrow-rotate-right-icon slot="start"></nimble-arrow-rotate-right-icon>
            Refresh
        </nimble-button>
        <nimble-button appearance="ghost">
            <nimble-thumbtack-icon slot="start"></nimble-thumbtack-icon>
            Pin
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
`;

export const toolbarThemeMatrix: Story = createMatrixThemeStory(component);

export const hiddenToolbar: Story = createStory(
    hiddenWrapper(html`<nimble-toolbar hidden>Hidden Toolbar</nimble-toolbar>`)
);
