import type { Story, Meta } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';

const metadata: Meta = {
    title: 'Tests/Text Customization',
    parameters: {
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
    }
};

export default metadata;

const customStyle = 'font-style: italic';

// prettier-ignore
export const textCustomizationStory: Story = createRenderer(html`
<div style="display: contents">
    <nimble-breadcrumb-item style="${customStyle}">Breadcrumb item</nimble-breadcrumb-item>
        <nimble-button style="${customStyle}">Button</nimble-button>
        <nimble-checkbox style="${customStyle}">Checkbox</nimble-checkbox>
        <nimble-menu style="${customStyle}">
            Inner text
            <nimble-menu-item style="${customStyle}">Menu item</nimble-menu-item>
        </nimble-menu>
        <nimble-number-field style="${customStyle}" value="42">Number field</nimble-number-field>
        <nimble-select style="${customStyle}">
            Inner text
            <nimble-listbox-option> Nimble select item </nimble-listbox-option>
        </nimble-select>
        <nimble-tabs>
            Inner text
            <nimble-tabs-toolbar style="${customStyle}">Tabs toolbar</nimble-tabs-toolbar>
            <nimble-tab style="${customStyle}">Tab</nimble-tab>
        </nimble-tabs>
        <nimble-text-area style="${customStyle}" value="Lorem ipsum">Text area</nimble-text-area>
        <nimble-text-field style="${customStyle}" value="Lorem ipsum">Text field</nimble-text-field>
        <nimble-toggle-button style="${customStyle}">Toggle button</nimble-toggle-button>
        <nimble-tree-view style="${customStyle}">
            Inner text
            <nimble-tree-item style="${customStyle}">Tree item</nimble-tree-item>
        </nimble-tree-view>
</div>`);
