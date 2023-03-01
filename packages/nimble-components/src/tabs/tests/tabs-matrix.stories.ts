import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
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

const metadata: Meta = {
    title: 'Tests/Tabs',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b/specs'
        }
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

export const tabsThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [tabsToolbarState, disabledStates])
);

export const hiddenTabs: Story = createStory(
    hiddenWrapper(
        html`<${tabsTag} hidden>
            <${tabTag}>Tab One</${tabTag}>
            <${tabPanelTag}>Tab content one</${tabPanelTag}>
        </${tabsTag}>`
    )
);

export const textCustomized: Story = createMatrixThemeStory(
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
