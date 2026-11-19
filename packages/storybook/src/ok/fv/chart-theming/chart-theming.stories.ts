import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { defineChart, lineY } from '@tanstack/charts';
import { mountChart } from '@tanstack/charts/dom';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';
import { createNimblePlotlyTemplate } from '@ni/ok-components/dist/esm/fv/plotly-template';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';
import './tanstack-chart.css';

const captionToPlotGap = 16;

const rows = [
    { day: 'Mon', value: 42 },
    { day: 'Tue', value: 58 },
    { day: 'Wed', value: 51 },
    { day: 'Thu', value: 73 },
    { day: 'Fri', value: 65 }
];

const renderChart = createUserSelectedThemeStory(html`
    <figure style="font: var(--ni-nimble-body-font); color: var(--ni-nimble-body-font-color);">
        <figcaption style="font: var(--ni-nimble-subtitle-font); color: var(--ni-nimble-subtitle-font-color);">
            Daily measurements
        </figcaption>
        <div data-chart></div>
        <p>Measurements rose from 42 on Monday to 65 on Friday, peaking at 73 on Thursday.</p>
    </figure>
`);

const roots = new WeakMap<AbortSignal, Element>();
const metadata: Meta = {
    title: 'Ok/Patterns/Chart Theming',
    render: (args, context) => {
        const next = renderChart(args, context);
        const root = roots.get(context.abortSignal);
        // Keep the mounted chart when Storybook rerenders for the theme toolbar.
        if (root) {
            const theme = next.getAttribute('theme')!;
            if (root.getAttribute('theme') !== theme) {
                root.setAttribute('theme', theme);
            }
            return root;
        }
        roots.set(context.abortSignal, next);
        return next;
    }
};

export default metadata;

export const tanStack: StoryObj = {
    name: 'TanStack Charts',
    play: ({ canvasElement, abortSignal }) => {
        const chart = canvasElement.querySelector<HTMLElement>('[data-chart]')!;
        chart.classList.add('nimble-tanstack-chart');
        const host = mountChart(chart, {
            ariaLabel: 'Daily measurements',
            height: 280,
            definition: defineChart({
                margin: { top: captionToPlotGap },
                marks: [lineY(rows, { x: 'day', y: 'value', color: () => 'Measured', points: true })],
                scales: {
                    x: { scale: scaleBand },
                    y: { scale: scaleLinear, nice: true, grid: true }
                },
                focus: 'group-x',
                tooltip
            })
        });
        abortSignal.addEventListener('abort', () => host.destroy(), { once: true });
    }
};

export const plotly: StoryObj = {
    play: async ({ canvasElement, abortSignal }) => {
        const { default: plotlyJs } = await import('plotly.js-dist-min');
        if (abortSignal.aborted) {
            return;
        }
        const chart = canvasElement.querySelector<HTMLElement>('[data-chart]')!;
        const provider = chart.closest('nimble-theme-provider')!;
        const render = async (): Promise<void> => {
            const template = createNimblePlotlyTemplate(chart);
            await plotlyJs.react(chart, [{
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Measured',
                x: rows.map(row => row.day),
                y: rows.map(row => row.value)
            }], {
                height: 280,
                margin: { t: captionToPlotGap, b: 24 },
                modebar: {
                    bgcolor: template.layout.paper_bgcolor,
                    color: template.layout.font.color,
                    activecolor: template.layout.colorway[0]
                },
                uirevision: 'measurements',
                template
            }, { displayModeBar: true, responsive: true });
        };
        const initialRender = render();
        let rendered = initialRender.catch(() => { /* Storybook reports the rejection from play. */ });
        const observer = new MutationObserver(() => {
            rendered = rendered.then(async () => {
                if (!abortSignal.aborted) {
                    await render();
                }
            }).catch(error => {
                // eslint-disable-next-line no-console
                console.error('Could not update the Plotly example', error);
            });
        });
        observer.observe(provider, { attributes: true, attributeFilter: ['theme'] });
        abortSignal.addEventListener('abort', () => {
            observer.disconnect();
            void rendered.finally(() => plotlyJs.purge(chart));
        }, { once: true });
        await initialRender;
    }
};
