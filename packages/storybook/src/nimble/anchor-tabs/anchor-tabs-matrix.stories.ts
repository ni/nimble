import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, ViewTemplate, when } from '@ni/fast-element';
import { anchorTabTag } from '@ni/nimble-components/dist/esm/anchor-tab';
import { tabsToolbarTag } from '@ni/nimble-components/dist/esm/tabs-toolbar';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { anchorTabsTag } from '@ni/nimble-components/dist/esm/anchor-tabs';
import {
    controlLabelFont,
    controlLabelFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { createStory } from '../../utilities/storybook';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { type DisabledState, disabledStates } from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';

const tabsToolbarStates = [
    {
        showToolbar: false,
        showLeftButton: false,
        showRightButtons: false,
        label: 'No Toolbar'
    },
    {
        showToolbar: true,
        showLeftButton: false,
        showRightButtons: false,
        label: 'Toolbar with no buttons'
    },
    {
        showToolbar: true,
        showLeftButton: true,
        showRightButtons: false,
        label: 'Toolbar with left button'
    },
    {
        showToolbar: true,
        showLeftButton: false,
        showRightButtons: true,
        label: 'Toolbar with right buttons'
    },
    {
        showToolbar: true,
        showLeftButton: true,
        showRightButtons: true,
        label: 'Toolbar with left and right buttons'
    }
] as const;
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
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">
        ${toolbar.label} ${disabledName ? `(${disabledName})` : ''} ${widthValue ? `(${widthValue})` : ''}
    </label>
    <${anchorTabsTag} activeid="tab1" style="padding: 15px;${widthValue ? ` width: ${widthValue};` : ''}">
        ${when(() => toolbar.showToolbar, html`
            <${tabsToolbarTag}>
                ${when(() => toolbar.showLeftButton, html`
                    <${buttonTag} appearance="ghost">Left Button</${buttonTag}>
                `)}
                ${when(() => toolbar.showRightButtons, html`
                    <${buttonTag} appearance="ghost" slot="end">Right Button</${buttonTag}>
                    <${buttonTag} appearance="ghost" slot="end">Right Button 2</${buttonTag}>
                `)}
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

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [tabsToolbarStates, disabledStates, widthStates])
);

export const hidden: StoryFn = createStory(
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
                <${tabsToolbarTag}><${buttonTag} appearance="ghost">Tabs toolbar</${buttonTag}></${tabsToolbarTag}>
                <${anchorTabTag}>Tab</${anchorTabTag}>
            </${anchorTabsTag}>
        `
    )
);
