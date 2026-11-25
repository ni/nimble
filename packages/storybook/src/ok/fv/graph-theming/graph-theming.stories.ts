import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { barY, defineChart, lineY } from '@tanstack/charts';
import { mountChart } from '@tanstack/charts/dom';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';
import { createNimblePlotlyTemplate } from '@ni/ok-components/dist/esm/fv/plotly-template';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';
import './tanstack-graph.css';

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
        <div data-chart style="min-height: 280px;"></div>
        <p>Measurements rose from 42 on Monday to 65 on Friday, peaking at 73 on Thursday.</p>
    </figure>
`);

const roots = new WeakMap<AbortSignal, Element>();
const metadata: Meta = {
    title: 'Ok/Patterns/Graph Theming',
    excludeStories: ['mountTanStackExample', 'mountPlotlyExample'],
    parameters: {
        chromatic: { disableSnapshot: true }
    },
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

export function mountTanStackExample(chart: HTMLElement, abortSignal: AbortSignal, kind: 'line' | 'bar'): void {
    chart.classList.add('nimble-tanstack-chart');
    const channels = { x: 'day', y: 'value', color: () => 'Measured' } as const;
    const host = mountChart(chart, {
        ariaLabel: 'Daily measurements',
        height: 280,
        definition: defineChart({
            margin: { top: captionToPlotGap },
            marks: [kind === 'bar' ? barY(rows, { ...channels, inset: 8 }) : lineY(rows, { ...channels, points: true })],
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

export async function mountPlotlyExample(chart: HTMLElement, abortSignal: AbortSignal, mode: 'lines+markers' | 'markers'): Promise<void> {
    const { default: plotlyJs } = await import('plotly.js-dist-min');
    if (abortSignal.aborted) {
        return;
    }
    const provider = chart.closest('nimble-theme-provider')!;
    const render = async (): Promise<void> => {
        const template = createNimblePlotlyTemplate(chart);
        await plotlyJs.react(chart, [{
            type: 'scatter',
            mode,
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
        }, {
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['sendChartToCloud'],
            responsive: true
        });
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

export const tanStack: StoryObj = {
    name: 'TanStack Charts',
    play: ({ canvasElement, abortSignal }) => {
        mountTanStackExample(canvasElement.querySelector<HTMLElement>('[data-chart]')!, abortSignal, 'line');
    }
};

export const tanStackBar: StoryObj = {
    name: 'TanStack Bar',
    play: ({ canvasElement, abortSignal }) => {
        mountTanStackExample(canvasElement.querySelector<HTMLElement>('[data-chart]')!, abortSignal, 'bar');
    }
};

export const plotly: StoryObj = {
    play: async ({ canvasElement, abortSignal }) => {
        await mountPlotlyExample(canvasElement.querySelector<HTMLElement>('[data-chart]')!, abortSignal, 'lines+markers');
    }
};

export const plotlyScatter: StoryObj = {
    play: async ({ canvasElement, abortSignal }) => {
        await mountPlotlyExample(canvasElement.querySelector<HTMLElement>('[data-chart]')!, abortSignal, 'markers');
    }
};
