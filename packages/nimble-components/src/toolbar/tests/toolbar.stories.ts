import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { toolbarTag } from '..';
import { buttonTag } from '../../button';
import { menuTag } from '../../menu';
import { menuButtonTag } from '../../menu-button';
import { menuItemTag } from '../../menu-item';
import { iconCogTag } from '../../icons/cog';
import { iconEyeTag } from '../../icons/eye';
import { iconFilterTag } from '../../icons/filter';
import { iconPencilTag } from '../../icons/pencil';
import { iconThreeDotsLineTag } from '../../icons/three-dots-line';
import { iconTrashTag } from '../../icons/trash';

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#toolbar) - A toolbar is a container
for grouping a set of controls, such as buttons, menubuttons, or checkboxes.

When a set of controls is visually presented as a group, the toolbar role can be used to communicate the
presence and purpose of the grouping to screen reader users. Grouping controls into toolbars can also be
an effective way of reducing the number of tab stops in the keyboard interface.

To override the toolbar's background color, style the \`positioning-region\` part:
\`
${toolbarTag}::part(positioning-region) {
    background: red;
}
\``;

const metadata: Meta = {
    title: 'Components/Toolbar',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        }
    }
};

export default metadata;

export const toolbar: StoryObj = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${toolbarTag}>
            <${buttonTag} appearance="ghost" slot="start">
                <${iconEyeTag} slot="start"></${iconEyeTag}>
                View
            </${buttonTag}>
            <${buttonTag} disabled appearance="ghost" slot="start">
                <${iconTrashTag} slot="start"></${iconTrashTag}>
                Delete
            </${buttonTag}>
            <${buttonTag} appearance="ghost" slot="start">
                <${iconPencilTag} slot="start"></${iconPencilTag}>
                Edit
            </${buttonTag}>

            <${buttonTag} appearance="ghost" content-hidden slot="end">
                <${iconCogTag} slot="start"></${iconCogTag}>
                Settings
            </${buttonTag}>
            <${buttonTag} appearance="ghost" content-hidden slot="end">
                <${iconFilterTag} slot="start"></${iconFilterTag}>
                Filter
            </${buttonTag}>
        </${toolbarTag}>
    `)
};

export const mobileToolbar: StoryObj = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <div style="width: 350px; height: 200px;">
            <${toolbarTag}>
                <${buttonTag} appearance="ghost" slot="start">
                    <${iconEyeTag} slot="start"></${iconEyeTag}>
                    View
                </${buttonTag}>
                <${menuButtonTag} appearance="ghost" slot="end" content-hidden title="More">
                    More
                    <${iconThreeDotsLineTag} slot="start"></${iconThreeDotsLineTag}>
                    <${menuTag} slot="menu">
                        <${menuItemTag}>Delete</${menuItemTag}>
                        <${menuItemTag}>Edit</${menuItemTag}>
                        <${menuItemTag}>Settings</${menuItemTag}>
                        <${menuItemTag}>Filter</${menuItemTag}>
                    </${menuTag}>
                </${menuButtonTag}>
            </${toolbarTag}>
        </div>
    `)
};
