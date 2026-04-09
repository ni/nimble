import { ViewTemplate, html } from '@ni/fast-element';
import type { Meta, StoryFn } from '@storybook/html-vite';
import { stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import { stepTag } from '@ni/nimble-components/dist/esm/step';
import { anchorStepTag } from '@ni/nimble-components/dist/esm/anchor-step';
import { bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { sizeStates, type SizeStates } from './types';

const metadata: Meta = {
    title: 'Tests/Stepper',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [sizeName, orientation, sizeStyle]: SizeStates,
): ViewTemplate => html`
<div style="display: inline-flex; flex-direction: column; gap: 16px;">
    <div style="padding-right: 16px;">${sizeName}</div>
    <${stepperTag} orientation=${() => orientation} style="${sizeStyle}">
        <${stepTag}><span slot="title">Step 1 and a decent amount of text</span><span slot="subtitle">first</span></${stepTag}>
        <${stepTag}><span slot="title">Step 2 and a decent amount of text</span><span slot="subtitle">first</span></${stepTag}>
        <${stepTag}><span slot="title">Step 3 and a decent amount of text</span><span slot="subtitle">first</span></${stepTag}>
    </${stepperTag}>
    <${stepperTag} orientation=${() => orientation} style="${sizeStyle}">
        <${anchorStepTag} href="#" target="_self"><span slot="title">Anchor Step 1 and a decent amount of text</span><span slot="subtitle">first</span></${anchorStepTag}>
        <${anchorStepTag} href="#" target="_self"><span slot="title">Anchor Step 2 and a decent amount of text</span><span slot="subtitle">first</span></${anchorStepTag}>
        <${anchorStepTag} href="#" target="_self"><span slot="title">Anchor Step 3 and a decent amount of text</span><span slot="subtitle">first</span></${anchorStepTag}>
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
        sizeStates
    ])}
    </div>
`);

export const hidden: StoryFn = createStory(
    hiddenWrapper(html`<${stepperTag} hidden>Hidden Stepper</${stepperTag}>`)
);
