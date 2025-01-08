import type { Meta, StoryFn } from '@storybook/html';
import { html, ViewTemplate, when } from '@ni/fast-element';
import { anchorTabTag } from '../../../../nimble-components/src/anchor-tab';
import { tabsToolbarTag } from '../../../../nimble-components/src/tabs-toolbar';
import { buttonTag } from '../../../../nimble-components/src/button';
import { anchorTabsTag } from '../../../../nimble-components/src/anchor-tabs';
import { createStory } from '../../utilities/storybook';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { DisabledState, disabledStates } from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';

const tabsToolbarStates = [false, true] as const;
type TabsToolbarState = (typeof tabsToolbarStates)[number];

const widthStates = ['', '250px'] as const;
type WidthState = (typeof widthStates)[number];

const metadata: Meta = {
    title: 'Tests/Anchor Tabs',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    toolbar: TabsToolbarState,
    [disabledName, disabled]: DisabledState,
    widthValue: WidthState
): ViewTemplate => html`
    <${anchorTabsTag} activeid="tab1" style="padding: 15px;${widthValue ? ` width: ${widthValue};` : ''}">
        ${when(() => toolbar, html`
            <${tabsToolbarTag}>
                <${buttonTag} appearance="ghost">Toolbar Button</${buttonTag}>
                <${buttonTag} appearance="ghost" style="margin-left: auto;">Right-aligned Button</${buttonTag}>
            </${tabsToolbarTag}>
        `)}
        <${anchorTabTag} id="tab1">Tab One</${anchorTabTag}>
        <${anchorTabTag} ?disabled="${() => disabled}">
            Tab Two ${() => disabledName}
        </${anchorTabTag}>
        <${anchorTabTag} hidden>Tab Three</${anchorTabTag}>
        <${anchorTabTag}>Tab Four</${anchorTabTag}>
    </${anchorTabsTag}>
`;

export const anchorTabsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [tabsToolbarStates, disabledStates, widthStates])
);

export const hiddenTabs: StoryFn = createStory(
    hiddenWrapper(
        html`<${anchorTabsTag} hidden>
            <${anchorTabTag}>Tab One</${anchorTabTag}>
        </${anchorTabsTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`
            <${anchorTabsTag}>
                Inner text
                <${tabsToolbarTag}>Tabs toolbar</${tabsToolbarTag}>
                <${anchorTabTag}>Tab</${anchorTabTag}>
            </${anchorTabsTag}>
        `
    )
);
