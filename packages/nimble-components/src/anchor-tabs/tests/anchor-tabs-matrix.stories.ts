import type { Meta, Story } from '@storybook/html';
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
import { anchorTabsTag } from '..';
import { anchorTabTag } from '../../anchor-tab';
import { tabsToolbarTag } from '../../tabs-toolbar';
import { buttonTag } from '../../button';

const metadata: Meta = {
    title: 'Tests/Anchor Tabs',
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
    <${anchorTabsTag} activeid="tab1" style="padding: 15px;">
        ${when(() => toolbar, html`
            <${tabsToolbarTag}>
                <${buttonTag} appearance="ghost">Toolbar Button</${buttonTag}>
            </${tabsToolbarTag}>
        `)}
        <${anchorTabTag} id="tab1">Tab One</${anchorTabTag}>
        <${anchorTabTag} ?disabled="${() => disabled}">
            Tab Two ${() => disabledName}
        </${anchorTabTag}>
        <${anchorTabTag} hidden>Tab Three</${anchorTabTag}>
    </${anchorTabsTag}>
`;

export const anchorTabsThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [tabsToolbarState, disabledStates])
);

export const hiddenTabs: Story = createStory(
    hiddenWrapper(
        html`<${anchorTabsTag} hidden>
            <${anchorTabTag}>Tab One</${anchorTabTag}>
        </${anchorTabsTag}>`
    )
);

export const textCustomized: Story = createMatrixThemeStory(
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
