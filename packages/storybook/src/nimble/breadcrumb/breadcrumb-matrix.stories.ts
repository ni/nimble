import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { breadcrumbItemTag } from '@ni/nimble-components/dist/esm/breadcrumb-item';
import { breadcrumbTag } from '@ni/nimble-components/dist/esm/breadcrumb';
import { BreadcrumbAppearance } from '@ni/nimble-components/dist/esm/breadcrumb/types';
import { createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/matrix';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';
import { type DisabledState, disabledStates } from '../../utilities/states';

const appearanceStates = [
    ['Default', BreadcrumbAppearance.default],
    ['Prominent', BreadcrumbAppearance.prominent]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const widthStates = [
    ['', ''],
    ['narrow ', 'width: 250px;']
] as const;
type WidthState = (typeof widthStates)[number];

const metadata: Meta = {
    title: 'Tests/Breadcrumb',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [widthName, width]: WidthState,
    [appearanceName, appearance]: AppearanceState,
    [disabledName, disabled]: DisabledState
): ViewTemplate => html`
    <div>
        <${breadcrumbTag}
            appearance="${() => appearance}"
            style="margin-right: 24px;${width}"
        >
            <${breadcrumbItemTag} ${disabled ? '' : 'href="parent.location.href"'}>
                ${() => `${widthName}${disabledName} Breadcrumb (${appearanceName}) - Link`}
            </${breadcrumbItemTag}>
            <${breadcrumbItemTag}>Current (No Link)</${breadcrumbItemTag}>
        </${breadcrumbTag}>
    </div>
`;
export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [widthStates, appearanceStates, disabledStates])
);

const interactionStates = cartesianProduct([
    widthStates,
    appearanceStates,
    disabledStates
] as const);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStates,
        hoverActive: interactionStates,
        active: [],
        focus: interactionStates
    })
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${breadcrumbTag} hidden>
            <${breadcrumbItemTag} href="#">Item 1</${breadcrumbItemTag}>
            <${breadcrumbItemTag}>Current (No Link)</${breadcrumbItemTag}>
        </${breadcrumbTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${breadcrumbItemTag} href="#">Breadcrumb item</${breadcrumbItemTag}>`
    )
);
