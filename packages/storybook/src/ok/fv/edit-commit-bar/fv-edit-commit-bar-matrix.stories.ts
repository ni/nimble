import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, type ViewTemplate } from '@ni/fast-element';
import { applicationBackgroundColor, bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { fvEditCommitBarTag } from '@ni/ok-components/dist/esm/fv/edit-commit-bar';
import {
    createMatrix,
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const commitStates = [
    ['No pending changes', 0, 0, 0, false, undefined],
    ['One pending change', 1, 1, 0, false, undefined],
    ['Changes include hidden rows', 2, 5, 3, false, undefined],
    ['Saving', 2, 5, 0, true, undefined],
    ['Saved', 0, 0, 0, false, { severity: 'information', text: 'Saved changes to 5 rows.' }],
    ['Save failed', 2, 5, 0, false, { severity: 'error', text: 'Save failed. Pending edits are retained.' }]
] as const;
type CommitState = (typeof commitStates)[number];

const metadata: Meta = {
    title: 'Tests Ok/Fv Edit Commit Bar',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const commitBar = ([heading, changeCount, affectedRowCount, hiddenAffectedRowCount, disabled, message]: CommitState): ViewTemplate => html`
    <div style="width: 480px; margin: 0 8px 8px 0; background: var(${applicationBackgroundColor.cssCustomProperty}); font: var(${bodyFont.cssCustomProperty}); color: var(${bodyFontColor.cssCustomProperty});">
        <${fvEditCommitBarTag}
            heading="${() => heading}"
            :changeCount="${() => changeCount}"
            :affectedRowCount="${() => affectedRowCount}"
            :hiddenAffectedRowCount="${() => hiddenAffectedRowCount}"
            ?save-disabled="${() => disabled || changeCount === 0}"
            ?revert-disabled="${() => disabled || changeCount === 0}"
            :message="${() => message}"
        ></${fvEditCommitBarTag}>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(commitBar, [commitStates])
);
