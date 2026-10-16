import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    sectionBackgroundColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { fvSplitLayoutTag } from '@ni/ok-components/dist/esm/fv/split-layout';
import {
    createMatrix,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const splitStates = [
    ['Expanded', 60, false],
    ['Secondary pane at its 300 px minimum', 75, false],
    ['Collapsed', 60, true]
] as const;
type SplitState = (typeof splitStates)[number];

const metadata: Meta = {
    title: 'Tests Ok/Fv Split Layout',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const splitLayout = ([name, position, collapsed]: SplitState): ViewTemplate => html`
    <div style="width: 640px; margin: 0 24px 24px 0; font: var(${bodyFont.cssCustomProperty}); color: var(${bodyFontColor.cssCustomProperty});">
        <div style="margin-bottom: 8px;">${() => name}</div>
        <${fvSplitLayoutTag}
            style="width: 100%; height: 200px;"
            position="${() => position}"
            min-secondary-pixels="300"
            :collapsed="${() => collapsed}"
        >
            <section slot="primary" style="display: grid; place-content: center; background: var(${applicationBackgroundColor.cssCustomProperty});">
                Records
            </section>
            <aside slot="secondary" style="display: grid; place-content: center; background: var(${sectionBackgroundColor.cssCustomProperty});">
                Editor
            </aside>
        </${fvSplitLayoutTag}>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(splitLayout, [splitStates])
);
