import { html } from '@ni/fast-element';
import type { Meta, StoryFn, StoryObj } from '@storybook/html-vite';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';
import { createMatrixThemeStory, sharedMatrixParameters } from '../../../utilities/matrix';
import { createStory } from '../../../utilities/storybook';
import { backgroundStates, type BackgroundState } from '../../../utilities/states';
import { toolbarExample } from './fv-toolbar.stories';

const metadata: Meta = {
    title: 'Tests Ok/Fv Toolbar',
    parameters: { ...sharedMatrixParameters() }
};

export default metadata;

export const responsiveThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="width: 800px; padding-bottom: 24px;">${toolbarExample}</div>
    <div style="width: 420px; padding-bottom: 24px;">${toolbarExample}</div>
    <div style="width: 220px; padding-bottom: 24px;">${toolbarExample}</div>
    <div style="width: 100px; padding-bottom: 24px;">${toolbarExample}</div>
`);

export const rtlThemeMatrix: StoryFn = createMatrixThemeStory(html`
    <div dir="rtl" style="width: 800px; padding-bottom: 24px;">${toolbarExample}</div>
    <div dir="rtl" style="width: 220px; padding-bottom: 24px;">${toolbarExample}</div>
    <div dir="rtl" style="width: 100px; padding-bottom: 24px;">${toolbarExample}</div>
`);

const createOverflowStory = ({ theme, value }: BackgroundState): StoryObj => ({
    name: `${theme} Theme$ Open Overflow`,
    render: createStory(html`
        <${themeProviderTag} theme="${() => theme}">
            <div style="background-color: ${() => value}; padding: 20px; min-height: 200px;">
                <div style="width: 100px;">${toolbarExample}</div>
            </div>
        </${themeProviderTag}>
    `),
    play: async ({ canvasElement }): Promise<void> => {
        await document.fonts.ready;
        const toolbar = canvasElement.querySelector('ok-fv-toolbar')!;
        toolbar.querySelectorAll('nimble-button')[1]!.disabled = true;
        await waitForUpdatesAsync();
        await waitForUpdatesAsync();
        await waitForUpdatesAsync();
        toolbar.overflowButton.open = true;
    }
});

export const lightOverflow = createOverflowStory(backgroundStates[0]);
export const colorOverflow = createOverflowStory(backgroundStates[1]);
export const darkOverflow = createOverflowStory(backgroundStates[2]);
