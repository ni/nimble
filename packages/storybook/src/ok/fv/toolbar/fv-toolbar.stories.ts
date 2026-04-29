import { html } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconArrowRotateRightTag } from '@ni/nimble-components/dist/esm/icons/arrow-rotate-right';
import { iconCogTag } from '@ni/nimble-components/dist/esm/icons/cog';
import { fvToolbarTag } from '@ni/ok-components/dist/esm/fv/toolbar';
import { searchInputTag } from '@ni/ok-components/dist/esm/search-input';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';

const metadata: Meta = {
    title: 'Ok/Fv Toolbar',
    render: createUserSelectedThemeStory(html`
        <div style="width: 100%;">
            <${fvToolbarTag}>
                <${buttonTag} slot="primary">Create asset</${buttonTag}>
                <${searchInputTag} slot="end" label="Search assets"></${searchInputTag}>
                <${buttonTag}
                    slot="end"
                    appearance="ghost"
                    content-hidden
                    title="Refresh"
                    aria-label="Refresh"
                >
                    Refresh
                    <${iconArrowRotateRightTag} slot="start"></${iconArrowRotateRightTag}>
                </${buttonTag}>
                <${buttonTag}
                    slot="end"
                    appearance="ghost"
                    content-hidden
                    title="Configure"
                    aria-label="Configure"
                >
                    Configure
                    <${iconCogTag} slot="start"></${iconCogTag}>
                </${buttonTag}>
            </${fvToolbarTag}>
        </div>
    `)
};

export default metadata;

export const fvToolbar: StoryObj = {};