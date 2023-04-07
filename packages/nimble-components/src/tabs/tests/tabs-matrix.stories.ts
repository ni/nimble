import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { DisabledState, disabledStates } from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { buttonTag } from '../../button';
import { tabTag } from '../../tab';
import { tabPanelTag } from '../../tab-panel';
import { tabsToolbarTag } from '../../tabs-toolbar';
import { tabsTag } from '..';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';

const metadata: Meta = {
    title: 'Tests/Tabs',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const tabsToolbarState = [false, true] as const;
type TabsToolbarState = (typeof tabsToolbarState)[number];

// prettier-ignore
const component = (
    toolbar: TabsToolbarState,
    [disabledName, disabled]: DisabledState
): ViewTemplate => html`
    <${tabsTag} style="padding: 15px;">
        ${when(() => toolbar, html`
            <${tabsToolbarTag}>
                <${buttonTag} appearance="ghost">Toolbar Button</${buttonTag}>
            </${tabsToolbarTag}>
        `)}
        <${tabTag}>Tab One</${tabTag}>
        <${tabTag} ?disabled="${() => disabled}">
            Tab Two ${() => disabledName}
        </${tabTag}>
        <${tabTag} hidden>Tab Three</${tabTag}>
        <${tabPanelTag}>Tab content one</${tabPanelTag}>
        <${tabPanelTag}>Tab content two</${tabPanelTag}>
        <${tabPanelTag}>Tab content three</${tabPanelTag}>
    </${tabsTag}>
`;

export const tabsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [tabsToolbarState, disabledStates])
);

export const hiddenTabs: StoryFn = createStory(
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
                <${tabsToolbarTag}>Tabs toolbar</${tabsToolbarTag}>
                <${tabTag}>Tab</${tabTag}>
            </${tabsTag}>
        `
    )
);

export const panelOverflow: StoryFn = createStory(
    html`
        <nimble-tabs style="height: 120px; width: 400px;">
            <nimble-tab>Tab One</nimble-tab>
            <nimble-tab-panel style="width: 450px;"
                >${loremIpsum}</nimble-tab-panel
            >
        </nimble-tabs>
    `
);
