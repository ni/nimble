import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconCogTag } from '@ni/nimble-components/dist/esm/icons/cog';
import { iconEyeTag } from '@ni/nimble-components/dist/esm/icons/eye';
import { iconFilterTag } from '@ni/nimble-components/dist/esm/icons/filter';
import { iconPencilTag } from '@ni/nimble-components/dist/esm/icons/pencil';
import { iconTrashTag } from '@ni/nimble-components/dist/esm/icons/trash';
import { toolbarTag } from '@ni/nimble-components/dist/esm/toolbar';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

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
