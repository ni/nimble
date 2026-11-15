import { DOM, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import type { ChartHost, ChartHostOptions, ChartTheme, ChartValue, StaticChartDefinition } from '@tanstack/charts';
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
            const fontSize = parseFloat(bodyFontSize.getValueFor(this));
            const tickFontSize = parseFloat(subtitleFontSize.getValueFor(this));
            const fontWeight = Number(bodyFontWeight.getValueFor(this));
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
        const options = { ...this.options, definition: this.themedDefinition };
        if (this.chartHost) {
            this.chartHost.update(options);
        } else {
            this.chartHost = mountChart(this.chartContainer, options);
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
