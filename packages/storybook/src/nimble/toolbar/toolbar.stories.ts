import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { buttonTag } from '../../../../nimble-components/src/button';
import { iconCogTag } from '../../../../nimble-components/src/icons/cog';
import { iconEyeTag } from '../../../../nimble-components/src/icons/eye';
import { iconFilterTag } from '../../../../nimble-components/src/icons/filter';
import { iconPencilTag } from '../../../../nimble-components/src/icons/pencil';
import { iconTrashTag } from '../../../../nimble-components/src/icons/trash';
import { toolbarTag } from '../../../../nimble-components/src/toolbar';
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
