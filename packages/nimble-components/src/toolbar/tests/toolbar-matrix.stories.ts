import type { StoryFn, Meta } from '@storybook/html';
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

        <nimble-button appearance="ghost">
            <nimble-icon-arrow-rotate-right slot="start"></nimble-icon-arrow-rotate-right>
            Refresh
        </nimble-button>
        <nimble-button appearance="ghost">
            <nimble-icon-thumbtack slot="start"></nimble-icon-thumbtack>
            Pin
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
`;

export const toolbarThemeMatrix: StoryFn = createMatrixThemeStory(component);

export const hiddenToolbar: StoryFn = createStory(
    hiddenWrapper(html`<nimble-toolbar hidden>Hidden Toolbar</nimble-toolbar>`)
);
