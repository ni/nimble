import { html, repeat } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { fvChartTag } from '@ni/ok-components/dist/esm/fv/chart';
import { barY, defineChart, lineY, type ChartBuildContext, type StaticChartDefinition } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';
import { colorLegend, colorLegendItems } from '@tanstack/charts/legend';
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
import { plotExamples } from './plot-types';

const rows = [
    { day: 'Mon', value: 42, target: 48 },
    { day: 'Tue', value: 58, target: 52 },
    { day: 'Wed', value: 51, target: 56 },
    { day: 'Thu', value: 73, target: 60 },
    { day: 'Fri', value: 65, target: 64 }
];

export const lineOptions = {
    ariaLabel: 'Daily measurements and targets',
    ariaDescription: 'Measurements increase from 42 on Monday to 65 on Friday. Targets increase from 48 to 64.',
    height: 280,
    definition: defineChart({
        marks: [
            lineY(rows, { x: 'day', y: 'value', color: () => 'Measured', points: true }),
            lineY(rows, { x: 'day', y: 'target', color: () => 'Target', strokeDasharray: '6 3' })
        ],
        scales: {
            x: { scale: scaleBand },
            y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Value' } }
        },
        color: { legend: colorLegend({ placement: 'bottom', items: colorLegendItems({ indicator: { shape: 'line' } }) }) },
        focus: 'group-x',
        tooltip
    })
};

export const barOptions = {
    ariaLabel: 'Daily measurements',
    height: 280,
    definition: defineChart({
        marks: [barY(rows, { x: 'day', y: 'value', color: 'day' })],
        scales: {
            x: { scale: () => scaleBand().padding(0.2) },
            y: { scale: scaleLinear, nice: true, grid: true }
        },
        tooltip: { use: tooltip, items: [{ channel: 'x', label: 'Day' }, { channel: 'y', label: 'Measured' }] }
    })
};

export const responsiveOptions = {
    ...lineOptions,
    definition: {
        focus: lineOptions.definition.focus,
        tooltip: lineOptions.definition.tooltip,
        chart: ({ width }: ChartBuildContext): StaticChartDefinition<typeof rows[number], string, number, 'dom'> => ({
            ...lineOptions.definition,
            color: width < 400 ? undefined : lineOptions.definition.color,
            scales: {
                ...lineOptions.definition.scales,
                y: {
                    ...lineOptions.definition.scales.y,
                    axis: { label: width < 400 ? undefined : 'Value' }
                }
            }
        })
    }
};

export const chartExample = html`
    <${fvChartTag} :options="${() => lineOptions}"></${fvChartTag}>
`;

const metadata: Meta = {
    title: 'Ok/Fv Chart',
    excludeStories: ['chartExample', 'lineOptions', 'barOptions', 'responsiveOptions'],
    render: createUserSelectedThemeStory(html`
        ${okWarning({
            componentName: 'fv chart',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <div style="width: 640px; max-width: 100%; min-width: 240px; resize: horizontal; overflow: auto;">
            ${chartExample}
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
        <${fvChartTag} style="max-width: 640px;" :options="${() => barOptions}"></${fvChartTag}>
    `)
};

export const responsive: StoryObj = {
    parameters: { chromatic: { disableSnapshot: true } },
    render: createUserSelectedThemeStory(html`
        <p>Drag the lower corner to resize the container.</p>
        <div style="width: 640px; max-width: 100%; min-width: 240px; resize: horizontal; overflow: auto; box-sizing: border-box; border: var(${borderWidth.cssCustomProperty}) solid var(${dividerBackgroundColor.cssCustomProperty}); padding: var(${mediumPadding.cssCustomProperty});">
            <${fvChartTag} :options="${() => responsiveOptions}"></${fvChartTag}>
        </div>
    `)
};

export const allPlotTypes: StoryObj = {
    name: 'All plot types',
    render: createUserSelectedThemeStory(html`
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
        <div class="plot-gallery">
            ${repeat(() => plotExamples, html<typeof plotExamples[number]>`
                <figure>
                    <figcaption>
                        <span>${x => x.title}</span>
                        <code>${x => x.api}</code>
                    </figcaption>
                    <${fvChartTag} :options="${x => x.options}"></${fvChartTag}>
                </figure>
            `)}
        </div>
    `)
};
