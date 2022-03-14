import type { Meta, Story } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createMatrix, themeWrapper } from '../../utilities/tests/matrix';
import { createRenderer } from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { sectionBackgroundColor } from '../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Toolbar',
    parameters: {
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
    }
};

export default metadata;

// prettier-ignore
const component = (
): ViewTemplate => html`
    <style>
        nimble-toolbar {
            background: var(${sectionBackgroundColor.cssCustomProperty});
        }
    </style>
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

export const toolbarThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component))
);

// prettier-ignore
export const hiddenToolbar: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-toolbar hidden>Hidden Toolbar</nimble-toolbar>`
    )
);