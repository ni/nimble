import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate, when } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { tabTag } from '@ni/nimble-components/dist/esm/tab';
import { tabPanelTag } from '@ni/nimble-components/dist/esm/tab-panel';
import { tabsToolbarTag } from '@ni/nimble-components/dist/esm/tabs-toolbar';
import { tabsTag } from '@ni/nimble-components/dist/esm/tabs';
import {
    controlLabelFont,
    controlLabelFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
import { type DisabledState, disabledStates } from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';
import { loremIpsum } from '../../utilities/lorem-ipsum';

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

const metadata: Meta = {
    title: 'Tests/Tabs',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const widthStates = ['', '250px'] as const;
type WidthState = (typeof widthStates)[number];

// prettier-ignore
const component = (
    toolbar: TabsToolbarState,
    [disabledName, disabled]: DisabledState,
    widthValue: WidthState

): ViewTemplate => html`
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">
        ${toolbar.label} ${disabledName ? `(${disabledName})` : ''} ${widthValue ? `(${widthValue})` : ''}
    </label>
    <${tabsTag} style="padding: 15px;${widthValue ? ` width: ${widthValue};` : ''}">
        ${when(() => toolbar.showToolbar, html`
            <${tabsToolbarTag}>
                ${when(() => toolbar.showLeftButton, html`
                    <${buttonTag} appearance="ghost">Left Button</${buttonTag}>
                `)}
                ${when(() => toolbar.showRightButtons, html`
                    <${buttonTag} appearance="ghost" slot="end">Right Button 1</${buttonTag}>
                    <${buttonTag} appearance="ghost" slot="end">Right Button 2</${buttonTag}>
                `)}
            </${tabsToolbarTag}>
        `)}
        <${tabTag}>Tab One</${tabTag}>
        <${tabTag} ?disabled="${() => disabled}">
            Tab Two ${() => disabledName}
        </${tabTag}>
        <${tabTag} hidden>Tab Three</${tabTag}>
        <${tabTag}>Tab Four</${tabTag}>
        <${tabPanelTag}>Tab content one</${tabPanelTag}>
        <${tabPanelTag}>Tab content two</${tabPanelTag}>
        <${tabPanelTag}>Tab content three</${tabPanelTag}>
        <${tabPanelTag}>Tab content four</${tabPanelTag}>
    </${tabsTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [tabsToolbarStates, disabledStates, widthStates])
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${tabsTag} hidden>
            <${tabTag}>Tab One</${tabTag}>
            <${tabPanelTag}>Tab content one</${tabPanelTag}>
        </${tabsTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`
            <${tabsTag}>
                Inner text
                <${tabsToolbarTag}><${buttonTag} appearance="ghost">Tabs toolbar</${buttonTag}></${tabsToolbarTag}>
                <${tabTag}>Tab</${tabTag}>
            </${tabsTag}>
        `
    )
);

export const panelOverflow: StoryFn = createStory(html`
    <${tabsTag} style="height: 120px; width: 400px;">
        <${tabTag}>Tab One</${tabTag}>
        <${tabPanelTag} style="width: 450px;">${loremIpsum}</${tabPanelTag}>
    </${tabsTag}>
`);

export const panelSizeToContent: StoryFn = createStory(html`
    <${tabsTag} style="width: 400px; height: 400px">
        <${tabTag}>Tab One</${tabTag}>
        <${tabPanelTag} style="width: 400px; height: 100%;">
            <div style="width: 250px; height: 100%; background: red;"></div>
        </${tabPanelTag}>
    </${tabsTag}>
`);
