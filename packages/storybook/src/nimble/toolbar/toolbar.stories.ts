import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconCogTag } from '@ni/nimble-components/dist/esm/icons/cog';
import { iconEyeTag } from '@ni/nimble-components/dist/esm/icons/eye';
import { iconFilterTag } from '@ni/nimble-components/dist/esm/icons/filter';
import { iconPencilTag } from '@ni/nimble-components/dist/esm/icons/pencil';
import { iconTrashTag } from '@ni/nimble-components/dist/esm/icons/trash';
import { toolbarTag } from '@ni/nimble-components/dist/esm/toolbar';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../utilities/storybook';

interface ToolbarArgs {
    start: undefined;
    end: undefined;
}

const metadata: Meta<ToolbarArgs> = {
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
    `),
    argTypes: {
        start: {
            description:
                'Content which will be positioned at the start of the toolbar.',
            control: false,
            table: { category: apiCategory.slots }
        },
        end: {
            description:
                'Content which will be positioned at the end of the toolbar.',
            control: false,
            table: { category: apiCategory.slots }
        }
    }
};

export default metadata;

export const toolbar: StoryObj = {};
