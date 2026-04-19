import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { fvAccordionItemTag } from '@ni/ok-components/dist/esm/fv-accordion-item';
import { FvAccordionItemAppearance } from '@ni/ok-components/dist/esm/fv-accordion-item/types';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const expandedStates = [
    ['Expanded', true],
    ['Collapsed', false]
] as const;
type ExpandedState = (typeof expandedStates)[number];

const appearanceStates = [
    ['Ghost', FvAccordionItemAppearance.ghost],
    ['Outline', FvAccordionItemAppearance.outline],
    ['Block', FvAccordionItemAppearance.block]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const metadata: Meta = {
    title: 'Tests Ok/Fv Accordion Item',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [expandedName, expanded]: ExpandedState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${fvAccordionItemTag}
        header="${() => `${appearanceName} ${expandedName}`}"
        ?expanded="${() => expanded}"
        appearance="${() => appearance}"
        style="margin-right: 8px; margin-bottom: 8px; width: 300px;">
        <${textFieldTag} placeholder="Enter name" appearance="underline"></${textFieldTag}>
        <${textFieldTag} placeholder="Enter category" appearance="underline"></${textFieldTag}>
    </${fvAccordionItemTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [expandedStates, appearanceStates])
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${fvAccordionItemTag} hidden header="Hidden">Content</${fvAccordionItemTag}>`
    )
);
