import { html } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconArrowRotateRightTag } from '@ni/nimble-components/dist/esm/icons/arrow-rotate-right';
import { iconCogTag } from '@ni/nimble-components/dist/esm/icons/cog';
import { fvToolbarTag } from '@ni/ok-components/dist/esm/fv/toolbar';
import { fvSearchInputTag } from '@ni/ok-components/dist/esm/fv/search-input';
import type { Meta, StoryObj } from '@storybook/html-vite';
import {
    createUserSelectedThemeStory,
    okWarning
} from '../../../utilities/storybook';

const metadata: Meta = {
    title: 'Ok/Fv Toolbar',
    render: createUserSelectedThemeStory(html`
        ${okWarning({
            componentName: 'fv toolbar',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <div style="width: 100%;">
            <${fvToolbarTag}>
                <${buttonTag} slot="primary">Create item</${buttonTag}>
                <${fvSearchInputTag} slot="end" label="Search"></${fvSearchInputTag}>
                <${buttonTag}
                    slot="end"
                    appearance="ghost"
                    content-hidden
                    title="Refresh results"
                    aria-label="Refresh results"
                >
                    Refresh results
                    <${iconArrowRotateRightTag} slot="start"></${iconArrowRotateRightTag}>
                </${buttonTag}>
                <${buttonTag}
                    slot="end"
                    appearance="ghost"
                    content-hidden
                    title="Configure view"
                    aria-label="Configure view"
                >
                    Configure view
                    <${iconCogTag} slot="start"></${iconCogTag}>
                </${buttonTag}>
            </${fvToolbarTag}>
        </div>
    `)
};

export default metadata;

export const fvToolbar: StoryObj = {};