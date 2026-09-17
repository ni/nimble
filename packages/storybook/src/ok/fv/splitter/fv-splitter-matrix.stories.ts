import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { fvSplitterTag } from '@ni/ok-components/dist/esm/fv/splitter';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    sectionBackgroundColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    createMatrixInteractionsFromStates,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/Fv Splitter',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const splitter = (label: string, resizing = false): ViewTemplate => html`
    <div style="display: inline-flex; flex-direction: column; gap: 8px; margin: 0 24px 24px 0; font: var(${bodyFont.cssCustomProperty}); color: var(${bodyFontColor.cssCustomProperty});">
        <span>${() => label}</span>
        <div style="display: grid; grid-template-columns: 180px 2px 120px; height: 160px;">
            <div style="background: var(${applicationBackgroundColor.cssCustomProperty});"></div>
            <${fvSplitterTag}
                aria-label="Resize details pane"
                :resizing="${() => resizing}"
            ></${fvSplitterTag}>
            <div style="background: var(${sectionBackgroundColor.cssCustomProperty});"></div>
        </div>
    </div>
`;

export const statesThemeMatrix: StoryFn = createMatrixThemeStory(html`
    ${splitter('Idle')}
    ${splitter('Resizing', true)}
`);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(
        (label: string): ViewTemplate => splitter(label),
        {
            hover: [['Hover']],
            hoverActive: [],
            active: [],
            focus: [['Focus']]
        }
    )
);