import { defineChart, dot, type ChartBuildContext, type ChartHostOptions, type ChartRenderContext, type StaticChartDefinition } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';
import { bodyFontSize, bodyFontWeight, graphTrace1Color, subtitleFontSize } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { FvChart, fvChartTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

interface Datum {
    x: number;
    y: number;
}

function createDefinition(rows = [{ x: 1, y: 2 }]): StaticChartDefinition<Datum, number, number, 'dom'> {
    return defineChart({
        marks: [dot(rows, { x: 'x', y: 'y' })],
        scales: {
            x: { scale: scaleLinear },
            y: { scale: scaleLinear, grid: true }
        }
    });
}

describe('FvChart', () => {
    let element: FvChart<Datum, number, number>;
    let connect: Fixture['connect'];
    let disconnect: Fixture['disconnect'];
    let onRender: jasmine.Spy<(context: ChartRenderContext<Datum, number, number>) => void>;
    let options: ChartHostOptions<Datum, number, number>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await fixture<FvChart<Datum, number, number>>(fvChartTag));
        onRender = jasmine.createSpy('onRender');
        options = {
            definition: createDefinition(),
            width: 480,
            height: 240,
            ariaLabel: 'Measurement history',
            ariaDescription: 'One measured point',
            onRender
        };
    });

    afterEach(async () => {
        await disconnect();
        graphTrace1Color.deleteValueFor(element);
        bodyFontSize.deleteValueFor(element);
        bodyFontWeight.deleteValueFor(element);
        subtitleFontSize.deleteValueFor(element);
    });

    it('can construct without chart options', async () => {
        await connect();
        expect(element).toBeInstanceOf(FvChart);
        expect(element.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('mounts options assigned before connection and forwards accessibility metadata', async () => {
        element.options = options;
        await connect();
        await waitForUpdatesAsync();

        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg?.getAttribute('aria-label')).toBe(options.ariaLabel);
        expect(svg?.querySelector('desc')?.textContent).toBe(options.ariaDescription);
        expect(onRender.calls.mostRecent().args[0].scene.points[0]?.datum).toEqual({ x: 1, y: 2 });
    });

    it('mounts after connection, updates data, and clears removed options', async () => {
        await connect();
        element.options = options;
        await waitForUpdatesAsync();
        element.options = { ...options, definition: createDefinition([{ x: 3, y: 4 }]) };
        await waitForUpdatesAsync();

        expect(onRender.calls.mostRecent().args[0].scene.points[0]?.datum).toEqual({ x: 3, y: 4 });

        element.options = { ...options, definition: createDefinition([]) };
        await waitForUpdatesAsync();
        expect(onRender.calls.mostRecent().args[0].scene.points).toEqual([]);

        element.options = undefined;
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('preserves definition identity when only callbacks change', async () => {
        element.options = options;
        await connect();
        await waitForUpdatesAsync();
        const scene = onRender.calls.mostRecent().args[0].scene;
        const onSelect = jasmine.createSpy('onSelect');
        element.options = { ...options, onSelect };
        await waitForUpdatesAsync();

        const svg = element.shadowRoot!.querySelector('svg')!;
        svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

        expect(onRender.calls.mostRecent().args[0].scene).toBe(scene);
        expect(onSelect).toHaveBeenCalled();
    });

    it('preserves authored scale domains, formatters, and disabled guides', async () => {
        const format = (value: number): string => `${value} V`;
        const x = { scale: scaleLinear().domain([0, 10]), axis: false as const };
        const y = { scale: scaleLinear, axis: { ticks: { values: [0, 2, 4], format }, label: 'Voltage' } };
        const definition = { ...createDefinition(), scales: { x, y, unused: null } };
        element.options = { ...options, definition };
        await connect();
        await waitForUpdatesAsync();

        const scene = onRender.calls.mostRecent().args[0].scene;
        expect(scene.scales.x?.domain).toEqual([0, 10]);
        const svg = element.shadowRoot!.querySelector('svg')!;
        expect(svg.textContent).toContain('2 V');
        expect(svg.querySelector('[data-ts-key^="x-tick-label:"]')).toBeNull();
        expect(definition.scales.x).toBe(x);
        expect(definition.scales.y).toBe(y);
        expect(definition.scales.unused).toBeNull();
    });

    it('resolves relative font sizes and keyword weights for axis text', async () => {
        bodyFontSize.setValueFor(element, '1.5rem');
        subtitleFontSize.setValueFor(element, '1rem');
        bodyFontWeight.setValueFor(element, 'normal');
        const definition = createDefinition();
        element.options = {
            ...options,
            definition: {
                ...definition,
                scales: {
                    ...definition.scales,
                    y: { scale: scaleLinear, grid: true, axis: { label: 'Voltage' } }
                }
            }
        };
        await connect();
        await waitForUpdatesAsync();

        const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const svg = element.shadowRoot!.querySelector('svg')!;
        const tick = svg.querySelector('[data-ts-key^="y-tick-label:"]')!;
        const label = svg.querySelector('[data-ts-key="y-label"]')!;
        expect(Number(tick.getAttribute('font-size'))).toBe(rootSize);
        expect(Number(label.getAttribute('font-size'))).toBe(rootSize * 1.5);
        expect(Number(tick.getAttribute('font-weight'))).toBe(400);
        expect(Number(label.getAttribute('font-weight'))).toBe(400);

        bodyFontSize.setValueFor(element, '1.5em');
        subtitleFontSize.setValueFor(element, '0.75em');
        bodyFontWeight.setValueFor(element, 'bold');
        await waitForUpdatesAsync();
        const inheritedSize = parseFloat(getComputedStyle(element).fontSize);
        const updatedTick = svg.querySelector('[data-ts-key^="y-tick-label:"]')!;
        const updatedLabel = svg.querySelector('[data-ts-key="y-label"]')!;
        expect(Number(updatedTick.getAttribute('font-size'))).toBe(inheritedSize * 0.75);
        expect(Number(updatedLabel.getAttribute('font-size'))).toBe(inheritedSize * 1.5);
        expect(Number(updatedTick.getAttribute('font-weight'))).toBe(700);
        expect(Number(updatedLabel.getAttribute('font-weight'))).toBe(700);

        element.style.setProperty('--test-chart-weight', '500');
        bodyFontSize.setValueFor(element, 'calc(1rem + 2px)');
        bodyFontWeight.setValueFor(element, 'var(--test-chart-weight)');
        await waitForUpdatesAsync();
        expect(Number(svg.querySelector('[data-ts-key="y-label"]')!.getAttribute('font-size'))).toBe(rootSize + 2);
        expect(Number(svg.querySelector('[data-ts-key="y-label"]')!.getAttribute('font-weight'))).toBe(500);
    });

    it('passes Nimble defaults and resolved dimensions to responsive definitions without mutating them', async () => {
        const definition = createDefinition();
        const chart = jasmine.createSpy<(context: ChartBuildContext) => typeof definition>('chart')
            .and.callFake(() => definition);
        element.options = { ...options, definition: { chart } };
        await connect();
        await waitForUpdatesAsync();

        expect(chart.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
            width: 480,
            height: 240,
            defaultTheme: jasmine.objectContaining({
                palette: jasmine.arrayContaining([graphTrace1Color.getValueFor(element)])
            })
        }));
        expect('theme' in definition).toBeFalse();
    });

    it('renders tooltip rows with component classes instead of inline styles', async () => {
        element.options = { ...options, definition: { ...createDefinition(), tooltip } };
        await connect();
        await waitForUpdatesAsync();
        const svg = element.shadowRoot!.querySelector('svg')!;
        svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        await waitForUpdatesAsync();

        const row = element.shadowRoot!.querySelector('.tooltip-row');
        expect(row).not.toBeNull();
        expect(row!.querySelector('.tooltip-value')?.textContent).toBeTruthy();
        expect(element.shadowRoot!.querySelector('.ts-chart-tooltip__row')).toBeNull();
        expect(element.shadowRoot!.querySelectorAll('.ts-chart-tooltip__body [style]:not(.tooltip-swatch)').length).toBe(0);
    });

    it('reacts to token changes, tears down on disconnect, and remounts on reconnect', async () => {
        element.options = options;
        await connect();
        await waitForUpdatesAsync();
        onRender.calls.reset();

        graphTrace1Color.setValueFor(element, '#123456');
        await waitForUpdatesAsync();
        expect(onRender).toHaveBeenCalledTimes(1);

        await disconnect();
        expect(element.shadowRoot?.querySelector('svg')).toBeNull();
        onRender.calls.reset();
        graphTrace1Color.setValueFor(element, '#654321');
        await waitForUpdatesAsync();
        expect(onRender).not.toHaveBeenCalled();

        await connect();
        await waitForUpdatesAsync();
        expect(element.shadowRoot?.querySelectorAll('svg').length).toBe(1);
        expect(onRender).toHaveBeenCalledTimes(1);
    });
});
