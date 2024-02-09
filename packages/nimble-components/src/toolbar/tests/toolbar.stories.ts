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

const metadata: Meta = {
    title: 'Components/Toolbar',
    parameters: {},
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
