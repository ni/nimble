import type { Meta, StoryFn } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { createStory } from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/tests/matrix';
import { DisabledState, disabledStates } from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { anchorTabsTag } from '..';
import { anchorTabTag } from '../../anchor-tab';
import { tabsToolbarTag } from '../../tabs-toolbar';
import { buttonTag } from '../../button';

const tabsToolbarStates = [false, true] as const;
type TabsToolbarState = (typeof tabsToolbarStates)[number];

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
    [disabledName, disabled]: DisabledState
): ViewTemplate => html`
    <${anchorTabsTag} activeid="tab1" style="padding: 15px;">
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
    </${anchorTabsTag}>
`;

export const anchorTabsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [tabsToolbarStates, disabledStates])
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
