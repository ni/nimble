import { ViewTemplate, html } from '@ni/fast-element';
import type { Meta, StoryFn } from '@storybook/html-vite';
import { stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import { anchorStepTag } from '@ni/nimble-components/dist/esm/anchor-step';
import { stepTag } from '@ni/nimble-components/dist/esm/step';
import { bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const metadata: Meta = {
    title: 'Tests/Stepper',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (): ViewTemplate => html`
    <span style="font: var(${bodyFont.cssCustomProperty}); color: var(${bodyFontColor.cssCustomProperty});">WIP</span>
    <${stepperTag}>
        <${anchorStepTag}>1</${anchorStepTag}>
        <${stepTag}>1</${stepTag}>
    </${stepperTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(html`<${stepperTag} hidden>Hidden Stepper</${stepperTag}>`)
);
