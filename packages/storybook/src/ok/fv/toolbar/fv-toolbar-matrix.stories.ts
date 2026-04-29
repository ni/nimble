import type { Meta, StoryFn } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { fvToolbarTag } from '@ni/ok-components/dist/esm/fv/toolbar';
import {
    createMatrixThemeStory,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests Ok/Fv Toolbar',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

export const themeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="display: inline-flex; width: 1120px; padding: 16px;">
        <${fvToolbarTag}>
            <${buttonTag} slot="primary">Create asset</${buttonTag}>
            <${buttonTag} slot="end" appearance="ghost">Refresh</${buttonTag}>
            <${buttonTag} slot="end" appearance="ghost">Configure</${buttonTag}>
        </${fvToolbarTag}>
    </div>
`);

export const endOnlyThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="display: inline-flex; width: 1120px; padding: 16px;">
        <${fvToolbarTag}>
            <${buttonTag} slot="end" appearance="ghost">Refresh</${buttonTag}>
            <${buttonTag} slot="end" appearance="ghost">Bulk action</${buttonTag}>
        </${fvToolbarTag}>
    </div>
`);