import type { Story, Meta } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { standardPadding } from '../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Text Customization'
};

export default metadata;

// prettier-ignore
export const textCustomizationStory: Story = createUserSelectedThemeStory(html`
<div style="
    display: inline-flex;
    flex-direction: column;
    gap: var(${standardPadding.cssCustomProperty});
">
    <style>
        * {
            font-style: italic;
        }
    </style>
    <nimble-breadcrumb-item>Breadcrumb item</nimble-breadcrumb-item>
        <nimble-button>Button</nimble-button>
        <nimble-checkbox>Checkbox</nimble-checkbox>
        <nimble-menu>
            Inner text
            <nimble-menu-item>Menu item</nimble-menu-item>
        </nimble-menu>
        <nimble-number-field value="42">Number field</nimble-number-field>
        <nimble-select>
            Inner text
            <nimble-list-option> Nimble select item </nimble-list-option>
        </nimble-select>
        <nimble-combobox>
            <nimble-list-option selected>Nimble combobox item</nimble-list-option>
        </nimble-combobox>
        <nimble-tabs>
            Inner text
            <nimble-tabs-toolbar>Tabs toolbar</nimble-tabs-toolbar>
            <nimble-tab>Tab</nimble-tab>
        </nimble-tabs>
        <nimble-text-area value="Lorem ipsum">Text area</nimble-text-area>
        <nimble-text-field value="Lorem ipsum">Text field</nimble-text-field>
        <nimble-toggle-button>Toggle button</nimble-toggle-button>
        <nimble-tree-view>
            Inner text
            <nimble-tree-item>Tree item</nimble-tree-item>
        </nimble-tree-view>
</div>`);
