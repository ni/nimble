import { html } from '@ni/fast-element';
import type { Meta, StoryFn, StoryObj } from '@storybook/html-vite';
import { fvChartTag } from '@ni/ok-components/dist/esm/fv/chart';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { createMatrixThemeStory, sharedMatrixParameters } from '../../../utilities/matrix';
import { barOptions, lineOptions, responsiveOptions } from './fv-chart.stories';

const metadata: Meta = {
    title: 'Tests Ok/Fv Chart',
    parameters: { ...sharedMatrixParameters() }
};

export default metadata;

export const themeMatrix: StoryFn = createMatrixThemeStory(html`
    <${fvChartTag} style="width: 600px;" :options="${() => lineOptions}"></${fvChartTag}>
    <${fvChartTag} style="width: 320px;" :options="${() => lineOptions}"></${fvChartTag}>
    <${fvChartTag} style="width: 320px;" :options="${() => barOptions}"></${fvChartTag}>
    <${fvChartTag} style="width: 600px;" :options="${() => responsiveOptions}"></${fvChartTag}>
    <${fvChartTag} style="width: 320px;" :options="${() => responsiveOptions}"></${fvChartTag}>
    <${fvChartTag} style="width: 320px;" :options="${() => ({
        ...lineOptions,
        ariaLabel: 'No measurements',
        ariaDescription: 'No measurements available.',
        definition: { ...lineOptions.definition, marks: [] }
    })}"></${fvChartTag}>
`);

export const tooltipThemeMatrix: StoryObj = {
    render: createMatrixThemeStory(html`
        <${fvChartTag} style="width: 600px;" :options="${() => lineOptions}"></${fvChartTag}>
        <${fvChartTag} style="width: 320px;" :options="${() => barOptions}"></${fvChartTag}>
    `),
    play: async ({ canvasElement }): Promise<void> => {
        await document.fonts.ready;
        await waitForUpdatesAsync();
        canvasElement.querySelectorAll(fvChartTag).forEach(chart => {
            const svg = chart.shadowRoot!.querySelector('svg')!;
            svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        });
    }
};
