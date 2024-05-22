import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { breadcrumbItemTag } from '../../../../nimble-components/src/breadcrumb-item';
import { breadcrumbTag } from '../../../../nimble-components/src/breadcrumb';
import { BreadcrumbAppearance } from '../../../../nimble-components/src/breadcrumb/types';
import { createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';

const appearanceStates = [
    ['Default', BreadcrumbAppearance.default],
    ['Prominent', BreadcrumbAppearance.prominent]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const metadata: Meta = {
    title: 'Tests/Breadcrumb',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = ([
    appearanceName,
    appearance
]: AppearanceState): ViewTemplate => html`
    <${breadcrumbTag}
        appearance="${() => appearance}"
        style="margin-right: 24px"
    >
        <${breadcrumbItemTag} href="${parent.location.href}">
            ${() => `Breadcrumb (${appearanceName}) - Link`}
        </${breadcrumbItemTag}>
        <${breadcrumbItemTag}>Current (No Link)</${breadcrumbItemTag}>
    </${breadcrumbTag}>
`;
export const breadcrumbThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [appearanceStates])
);

export const hiddenBreadcrumb: StoryFn = createStory(
    hiddenWrapper(
        html`<${breadcrumbTag} hidden>
            <${breadcrumbItemTag} href="#">Item 1</${breadcrumbItemTag}>
            <${breadcrumbItemTag}>Current (No Link)</${breadcrumbItemTag}>
        </${breadcrumbTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${breadcrumbItemTag}>Breadcrumb item</${breadcrumbItemTag}>`
    )
);
