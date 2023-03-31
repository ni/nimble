import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { BreadcrumbAppearance } from '../types';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { breadcrumbTag } from '..';
import { breadcrumbItemTag } from '../../breadcrumb-item';

const metadata: Meta = {
    title: 'Tests/Breadcrumb',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const appearanceStates: [string, string | undefined][] = Object.entries(
    BreadcrumbAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = (typeof appearanceStates)[number];

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
