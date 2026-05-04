import type { Meta, StoryFn } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { fvContextHelpTag } from '@ni/ok-components/dist/esm/fv/context-help';
import {
    bodyFont,
    bodyFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/Fv Context Help',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

export const themeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="display: inline-flex; flex-direction: column; gap: 16px; padding: 20px; font: var(${bodyFont.cssCustomProperty}); color: var(${bodyFontColor.cssCustomProperty});">
        <div style="display: inline-flex; gap: 8px; align-items: center;">
            <span>Default</span>
            <${fvContextHelpTag} text="Helpful context for the adjacent label."></${fvContextHelpTag}>
        </div>
        <div style="display: inline-flex; gap: 8px; align-items: center;">
            <span>With icon</span>
            <${fvContextHelpTag} text="Helpful context for the adjacent label." icon-visible severity="information"></${fvContextHelpTag}>
        </div>
    </div>
`);