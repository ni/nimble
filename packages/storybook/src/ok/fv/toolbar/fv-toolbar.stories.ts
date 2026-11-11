import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { fvToolbarTag } from '@ni/ok-components/dist/esm/fv/toolbar';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconPencilTag } from '@ni/nimble-components/dist/esm/icons/pencil';
import { iconCopyTag } from '@ni/nimble-components/dist/esm/icons/copy';
import { iconDownloadTag } from '@ni/nimble-components/dist/esm/icons/download';
import { createUserSelectedThemeStory, okWarning } from '../../../utilities/storybook';

export const toolbarExample = html`
    <${fvToolbarTag} aria-label="Asset actions" overflow-label="More actions">
        <${buttonTag}
            slot="start"
            appearance="ghost"
            type="button"
            data-responsive="label icon overflow"
            data-priority="10"
        >
            <${iconPencilTag} slot="start"></${iconPencilTag}>
            Edit selected assets
        </${buttonTag}>
        <${buttonTag}
            slot="start"
            appearance="ghost"
            type="button"
            data-responsive="label icon overflow"
        >
            <${iconCopyTag} slot="start"></${iconCopyTag}>
            Duplicate selected assets
        </${buttonTag}>
        <${buttonTag}
            slot="end"
            appearance="ghost"
            type="button"
            data-responsive="label icon overflow"
        >
            <${iconDownloadTag} slot="start"></${iconDownloadTag}>
            Export selected assets
        </${buttonTag}>
    </${fvToolbarTag}>
`;

const metadata: Meta = {
    title: 'Ok/Fv Toolbar',
    excludeStories: ['toolbarExample'],
    render: createUserSelectedThemeStory(html`
        ${okWarning({
            componentName: 'fv toolbar',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <p>Drag the lower corner to resize the container.</p>
        <div style="width: 760px; max-width: 100%; min-width: 100px; resize: horizontal; overflow: auto; padding-bottom: 200px;">
            ${toolbarExample}
        </div>
    `)
};

export default metadata;

export const responsive: StoryObj = {};
