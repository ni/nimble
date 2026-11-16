import { DOM, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import type { ChartHost, ChartHostOptions, ChartTheme, ChartTooltipBodyTarget, ChartValue, StaticChartDefinition } from '@tanstack/charts';
import { mountChart } from '@tanstack/charts/dom';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    bodyFontSize,
    bodyFontWeight,
    graphGridlineColor,
    graphTrace1Color,
    graphTrace2Color,
    graphTrace3Color,
    graphTrace4Color,
    graphTrace5Color,
    graphTrace6Color,
    graphTrace7Color,
    graphTrace8Color,
    subtitleFontColor,
    subtitleFontSize
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-chart': FvChart;
    }
}

const paletteTokens = [
    graphTrace1Color,
    graphTrace2Color,
    graphTrace3Color,
    graphTrace4Color,
    graphTrace5Color,
    graphTrace6Color,
    graphTrace7Color,
    graphTrace8Color
];
const themeTokens = [
    ...paletteTokens,
    bodyFont,
    bodyFontColor,
    bodyFontSize,
    bodyFontWeight,
    applicationBackgroundColor,
    graphGridlineColor,
    subtitleFontColor,
    subtitleFontSize
];

const createSwatch = (document: Document, color: string): HTMLSpanElement => {
    const swatch = document.createElement('span');
    swatch.className = 'tooltip-swatch';
    swatch.style.background = color;
    return swatch;
};

// TanStack's default tooltip body uses inline styles, so render our own classed markup instead.
const renderTooltipBody = (target: ChartTooltipBodyTarget | null): void => {
    if (!target) {
        return;
    }
    const { element, content } = target;
    element.classList.add('tooltip');
    if (typeof content === 'string') {
        element.textContent = content;
        return;
    }
    const document = element.ownerDocument;
    const children: HTMLElement[] = [];
    if (content.title) {
        const title = document.createElement('div');
        title.className = 'tooltip-title';
        if (content.color) {
            title.append(createSwatch(document, content.color));
        }
        title.append(content.title);
        children.push(title);
    }
    if (content.rows.length > 0) {
        const rows = document.createElement('div');
        rows.className = 'tooltip-rows';
        rows.setAttribute('aria-hidden', 'true');
        for (const row of content.rows) {
            const line = document.createElement('div');
            line.className = 'tooltip-row';
            line.toggleAttribute('data-active', row.active === true);
            const label = document.createElement('span');
            label.textContent = row.label;
            const value = document.createElement('span');
            value.className = 'tooltip-value';
            value.textContent = row.value;
            line.append(row.color ? createSwatch(document, row.color) : document.createElement('span'), label, value);
            rows.append(line);
        }
        children.push(rows);
    }
    element.replaceChildren(...children);
};

/**
 * A TanStack SVG chart with Nimble typography, guides, and trace colors.
 */
export class FvChart<
    TDatum = unknown,
    TXValue extends ChartValue = ChartValue,
    TYValue extends ChartValue = ChartValue
> extends FoundationElement {
    /** Replace this object to update the chart. Uses TanStack's DOM host API. */
    @observable
    public options?: ChartHostOptions<TDatum, TXValue, TYValue>;

    /** @internal */
    public readonly chartContainer!: HTMLDivElement;

    private chartHost?: ChartHost<TDatum, TXValue, TYValue>;
    private sourceDefinition?: ChartHostOptions<TDatum, TXValue, TYValue>['definition'];
    private themedDefinition?: ChartHostOptions<TDatum, TXValue, TYValue>['definition'];
    private updateQueued = false;
    private readonly tokenSubscriber = {
        handleChange: (): void => {
            this.themedDefinition = undefined;
            this.queueUpdate();
        }
    };

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        themeTokens.forEach(token => token.subscribe(this.tokenSubscriber, this));
        this.queueUpdate();
    }

    /** @internal */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        themeTokens.forEach(token => token.unsubscribe(this.tokenSubscriber, this));
        this.chartHost?.destroy();
        this.chartHost = undefined;
        this.sourceDefinition = undefined;
        this.themedDefinition = undefined;
    }

    /** @internal */
    public optionsChanged(): void {
        this.queueUpdate();
    }

    private queueUpdate(): void {
        if (!this.$fastController.isConnected || this.updateQueued) {
            return;
        }
        this.updateQueued = true;
        DOM.queueUpdate(() => {
            this.updateQueued = false;
            if (this.$fastController.isConnected) {
                this.updateChart();
            }
        });
    }

    private updateChart(): void {
        if (!this.options) {
            this.chartHost?.destroy();
            this.chartHost = undefined;
            this.sourceDefinition = undefined;
            this.themedDefinition = undefined;
            return;
        }

        const definition = this.options.definition;
        if (definition !== this.sourceDefinition || !this.themedDefinition) {
            const theme: ChartTheme = {
                foreground: bodyFontColor.getValueFor(this),
                muted: subtitleFontColor.getValueFor(this),
                grid: graphGridlineColor.getValueFor(this),
                background: applicationBackgroundColor.getValueFor(this),
                palette: paletteTokens.map(token => token.getValueFor(this))
            };
            // TanStack needs numeric values; resolve CSS units and keywords in the chart's font context.
            const fontProbe = this.ownerDocument.createElement('span');
            fontProbe.style.position = 'absolute';
            fontProbe.style.visibility = 'hidden';
            fontProbe.style.fontSize = bodyFontSize.getValueFor(this);
            fontProbe.style.fontWeight = bodyFontWeight.getValueFor(this);
            this.chartContainer.append(fontProbe);
            const fontSize = parseFloat(getComputedStyle(fontProbe).fontSize);
            const fontWeight = Number(getComputedStyle(fontProbe).fontWeight);
            fontProbe.style.fontSize = subtitleFontSize.getValueFor(this);
            const tickFontSize = parseFloat(getComputedStyle(fontProbe).fontSize);
            fontProbe.remove();
            const styleSpec = (spec: Pick<StaticChartDefinition, 'scales' | 'theme'>): Pick<StaticChartDefinition, 'scales' | 'theme'> => ({
                theme: { ...theme, ...spec.theme },
                scales: Object.fromEntries(Object.entries(spec.scales).map(([id, scale]) => {
                    if (!scale) {
                        return [id, scale];
                    }
                    const axis = scale.axis;
                    return [id, {
                        ...scale,
                        // Nimble's grid token includes opacity; do not attenuate it a second time.
                        grid: scale.grid === undefined || scale.grid === false
                            ? scale.grid : { strokeOpacity: 1, ...(scale.grid === true ? {} : scale.grid) },
                        axis: axis === false ? false : {
                            line: { stroke: spec.theme?.grid ?? theme.grid },
                            ...axis,
                            ticks: axis?.ticks === false ? false : { size: 0, ...axis?.ticks },
                            tickLabels: axis?.tickLabels === false ? false : {
                                fontSize: tickFontSize,
                                fontWeight,
                                ...axis?.tickLabels
                            },
                            label: typeof axis?.label === 'string'
                                ? { text: axis.label, fontSize, fontWeight }
                                : axis?.label && { fontSize, fontWeight, ...axis.label }
                        }
                    }];
                }))
            });
            this.themedDefinition = 'chart' in definition
                ? {
                    ...definition,
                    chart: context => {
                        const spec = definition.chart({ ...context, defaultTheme: theme });
                        return { ...spec, ...styleSpec(spec) };
                    }
                }
                : { ...definition, ...styleSpec(definition) };
            this.sourceDefinition = definition;
        }
        // mountChart forwards onTooltipBodyChange to its renderer host, but ChartHostOptions omits it from the type.
        const options: ChartHostOptions<TDatum, TXValue, TYValue> & {
            onTooltipBodyChange: typeof renderTooltipBody
        } = { ...this.options, definition: this.themedDefinition, onTooltipBodyChange: renderTooltipBody };
        if (this.chartHost) {
            this.chartHost.update(options);
        } else {
            const chartHost = mountChart(this.chartContainer, options);
            if (this.$fastController.isConnected) {
                this.chartHost = chartHost;
            } else {
                chartHost.destroy();
            }
        }
    }
}

const okFvChart = FvChart.compose({
    baseName: 'fv-chart',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvChart());
export const fvChartTag = 'ok-fv-chart';
