import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { accordionItemTag } from '@ni/ok-components/dist/esm/accordion-item';
import { AccordionItemAppearance } from '@ni/ok-components/dist/esm/accordion-item/types';
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
    ['Ghost', AccordionItemAppearance.ghost],
    ['Outline', AccordionItemAppearance.outline],
    ['Block', AccordionItemAppearance.block]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const metadata: Meta = {
    title: 'Tests Ok/Accordion Item',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [expandedName, expanded]: ExpandedState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${accordionItemTag}
        header="${() => `${appearanceName} ${expandedName}`}"
        ?expanded="${() => expanded}"
        appearance="${() => appearance}"
        style="margin-right: 8px; margin-bottom: 8px; width: 300px;">
        <${textFieldTag} placeholder="Enter name" appearance="underline"></${textFieldTag}>
        <${textFieldTag} placeholder="Enter category" appearance="underline"></${textFieldTag}>
    </${accordionItemTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [expandedStates, appearanceStates])
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${accordionItemTag} hidden header="Hidden">Content</${accordionItemTag}>`
    )
);
