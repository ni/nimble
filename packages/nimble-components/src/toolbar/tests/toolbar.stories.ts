import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { toolbarTag } from '..';
import { buttonTag } from '../../button';
import { iconCogTag } from '../../icons/cog';
import { iconEyeTag } from '../../icons/eye';
import { iconFilterTag } from '../../icons/filter';
import { iconPencilTag } from '../../icons/pencil';
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
    title: 'Toolbar',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        }
    },
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

export default metadata;

export const toolbar: StoryObj = {};
