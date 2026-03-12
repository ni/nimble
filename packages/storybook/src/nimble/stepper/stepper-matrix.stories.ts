import { ViewTemplate, html } from '@ni/fast-element';
import type { Meta, StoryFn } from '@storybook/html-vite';
import { stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import { stepTag } from '@ni/nimble-components/dist/esm/step';
import { bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { orientationStates, type OrientationStates } from './types';

const metadata: Meta = {
    title: 'Tests/Stepper',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [orientationName, orientation]: OrientationStates
): ViewTemplate => html`
<div style="display: inline-flex; flex-direction: column;">
    <div style="padding-right: 16px;">${orientationName}</div>
    <${stepperTag} orientation=${() => orientation} style="width:200px;">
        <${stepTag}></${stepTag}>
        <${stepTag}></${stepTag}>
    </${stepperTag}>
</div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(html`
        <div style="
            display: grid;
            grid-template-columns: fit-all;
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
        ">
    ${createMatrix(component, [
        orientationStates
    ])}
    </div>
`);

export const hidden: StoryFn = createStory(
    hiddenWrapper(html`<${stepperTag} hidden>Hidden Stepper</${stepperTag}>`)
);
