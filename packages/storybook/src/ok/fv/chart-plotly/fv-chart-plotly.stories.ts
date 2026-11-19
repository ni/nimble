import { html, repeat } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import type { Data, Layout } from 'plotly.js-dist-min';
import { fvChartPlotlyTag } from '@ni/ok-components/dist/esm/fv/chart-plotly';
import {
    bodyFont,
    bodyFontColor,
    borderWidth,
    dividerBackgroundColor,
    largePadding,
    mediumPadding,
    standardPadding,
    subtitleFont,
    subtitleFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { createUserSelectedThemeStory, okWarning } from '../../../utilities/storybook';
import { plotlyExamples } from './plot-types';

const galleryStyles = html`
        <style>
            .plot-gallery {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
                gap: var(${largePadding.cssCustomProperty});
                max-width: 1440px;
                font: var(${bodyFont.cssCustomProperty});
                color: var(${bodyFontColor.cssCustomProperty});
            }
            .plot-gallery figure {
                margin: 0;
                min-width: 0;
                padding: var(${standardPadding.cssCustomProperty});
                border: var(${borderWidth.cssCustomProperty}) solid var(${dividerBackgroundColor.cssCustomProperty});
            }
            .plot-gallery figcaption {
                display: grid;
                gap: var(${mediumPadding.cssCustomProperty});
                margin-bottom: var(${standardPadding.cssCustomProperty});
            }
            .plot-gallery code {
                font: var(${subtitleFont.cssCustomProperty});
                color: var(${subtitleFontColor.cssCustomProperty});
            }
        </style>
`;

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const lineData: Data[] = [
    { type: 'scatter', mode: 'lines+markers', name: 'Measured', x: days, y: [42, 58, 51, 73, 65] },
    {
        type: 'scatter', mode: 'lines', name: 'Target', x: days, y: [48, 52, 56, 60, 64], line: { dash: 'dash' }
    }
];
export const lineLayout: Partial<Layout> = {
    height: 280,
    yaxis: { title: { text: 'Value' } },
    legend: { orientation: 'h', y: -0.2 }
};

export const barData: Data[] = [
    { type: 'bar', name: 'Measured', x: days, y: [42, 58, 51, 73, 65] }
];
export const barLayout: Partial<Layout> = { height: 280 };

const metadata: Meta = {
    title: 'Ok/Fv Chart Plotly',
    excludeStories: ['lineData', 'lineLayout', 'barData', 'barLayout'],
    render: createUserSelectedThemeStory(html`
        ${okWarning({
            componentName: 'fv chart plotly',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <p>Drag the lower corner to resize the container.</p>
        <div style="width: 640px; max-width: 100%; min-width: 240px; resize: horizontal; overflow: auto; box-sizing: border-box; border: var(${borderWidth.cssCustomProperty}) solid var(${dividerBackgroundColor.cssCustomProperty}); padding: var(${mediumPadding.cssCustomProperty});">
            <${fvChartPlotlyTag} :data="${() => lineData}" :layout="${() => lineLayout}"></${fvChartPlotlyTag}>
        </div>
    `)
};

export default metadata;

export const line: StoryObj = {
    parameters: { chromatic: { disableSnapshot: true } }
};

export const bar: StoryObj = {
    parameters: { chromatic: { disableSnapshot: true } },
    render: createUserSelectedThemeStory(html`
        <${fvChartPlotlyTag} style="max-width: 640px;" :data="${() => barData}" :layout="${() => barLayout}"></${fvChartPlotlyTag}>
    `)
};

export const allPlotTypes: StoryObj = {
    name: 'All plot types',
    // WebGL traces do not render deterministically in Chromatic; the matrix stories cover theming.
    parameters: { chromatic: { disableSnapshot: true } },
    render: createUserSelectedThemeStory(html`
        ${galleryStyles}
        <div class="plot-gallery">
            ${repeat(() => plotlyExamples, html<typeof plotlyExamples[number]>`
                <figure>
                    <figcaption>
                        <span>${x => x.title}</span>
                        <code>${x => x.type}</code>
                    </figcaption>
                    <${fvChartPlotlyTag}
                        :data="${x => x.data}"
                        :layout="${x => ({ height: 300, ...x.layout })}"
                    ></${fvChartPlotlyTag}>
                </figure>
            `)}
        </div>
    `)
};
