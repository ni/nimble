import { DOM, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import Plotly, { type Config, type Data, type Layout, type Template } from 'plotly.js-dist-min';
import {
    applicationBackgroundColor,
    bodyFontColor,
    bodyFontFamily,
    bodyFontSize,
    bodyFontWeight,
    failColor,
    graphGridlineColor,
    graphTrace1Color,
    graphTrace2Color,
    graphTrace3Color,
    graphTrace4Color,
    graphTrace5Color,
    graphTrace6Color,
    graphTrace7Color,
    graphTrace8Color,
    passColor,
    popupBorderColor,
    subtitleFontColor,
    subtitleFontSize,
    tooltipBackgroundColor,
    tooltipCaptionFontColor,
    tooltipCaptionFontFamily,
    tooltipCaptionFontSize
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-chart-plotly': FvChartPlotly;
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
    applicationBackgroundColor,
    bodyFontColor,
    bodyFontFamily,
    bodyFontSize,
    bodyFontWeight,
    failColor,
    graphGridlineColor,
    passColor,
    popupBorderColor,
    subtitleFontColor,
    subtitleFontSize,
    tooltipBackgroundColor,
    tooltipCaptionFontColor,
    tooltipCaptionFontFamily,
    tooltipCaptionFontSize
];

type PlotEmitter = HTMLDivElement & { emit?: (name: string, data?: unknown) => void };

/**
 * A Plotly.js chart with Nimble typography, guides, hover labels, and trace colors.
 * @fires chart-render-error - The chart failed to render. The error is in `detail.error`.
 */
export class FvChartPlotly extends FoundationElement {
    /** Plotly traces, as passed to `Plotly.react`. Replace the array to update the chart. */
    @observable
    public data?: Data[];

    /** Plotly layout. Values here override the Nimble template. */
    @observable
    public layout?: Partial<Layout>;

    /** Plotly config. Values here override the component's defaults. */
    @observable
    public config?: Partial<Config>;

    /** @internal */
    public readonly chartContainer!: PlotEmitter;

    private nimbleTemplate?: Template;
    private plotted = false;
    private width = 0;
    private updateQueued = false;
    private rendering = false;
    private purgeAfterRender = false;
    private forwardingEmit?: PlotEmitter['emit'];
    private readonly plotlySheet = new CSSStyleSheet();
    private readonly resizeObserver = new ResizeObserver(entries => {
        const width = entries[0]!.contentRect.width;
        if (this.plotted && width > 0 && width !== this.width && this.layout?.width === undefined && this.layout?.autosize !== false) {
            this.width = width;
            Plotly.Plots.resize(this.chartContainer);
        }
    });

    private readonly tokenSubscriber = {
        handleChange: (): void => {
            this.nimbleTemplate = undefined;
            this.queueUpdate();
        }
    };

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        themeTokens.forEach(token => token.subscribe(this.tokenSubscriber, this));
        this.resizeObserver.observe(this.chartContainer);
        this.queueUpdate();
    }

    /** @internal */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        themeTokens.forEach(token => token.unsubscribe(this.tokenSubscriber, this));
        this.resizeObserver.disconnect();
        if (this.rendering) {
            this.purgeAfterRender = true;
        } else {
            this.purge();
        }
        this.nimbleTemplate = undefined;
    }

    /** @internal */
    public dataChanged(): void {
        this.queueUpdate();
    }

    /** @internal */
    public layoutChanged(): void {
        this.queueUpdate();
    }

    /** @internal */
    public configChanged(): void {
        this.queueUpdate();
    }

    private queueUpdate(): void {
        if (!this.$fastController.isConnected || this.updateQueued) {
            return;
        }
        this.updateQueued = true;
        DOM.queueUpdate(() => {
            if (this.rendering) {
                return;
            }
            this.updateQueued = false;
            if (this.$fastController.isConnected) {
                void this.updateChart();
            }
        });
    }

    private purge(): void {
        if (this.plotted) {
            Plotly.purge(this.chartContainer);
            this.plotted = false;
            this.forwardingEmit = undefined;
        }
    }

    private async updateChart(): Promise<void> {
        if (!this.data) {
            this.purge();
            return;
        }
        this.rendering = true;
        try {
            this.nimbleTemplate ??= this.createTemplate();
            this.plotted = true;
            const rendered = Plotly.react(
                this.chartContainer,
                this.data,
                { ...this.layout, template: (this.layout?.template as Template | undefined) ?? this.nimbleTemplate },
                { displaylogo: false, ...this.config }
            );
            this.width = this.chartContainer.clientWidth;
            this.forwardEvents();
            await rendered;
            if (!this.purgeAfterRender) {
                this.adoptPlotlyStyles();
            }
        } catch (error) {
            this.purge();
            if (!this.purgeAfterRender) {
                this.$emit('chart-render-error', { error });
            }
        } finally {
            // Plotly can still write to the container until react settles, even after disconnect.
            if (this.purgeAfterRender) {
                this.purge();
                this.purgeAfterRender = false;
            }
            this.rendering = false;
            if (this.updateQueued) {
                this.updateQueued = false;
                this.queueUpdate();
            }
        }
    }

    // Plotly creates its emitter synchronously in react(); re-dispatch its events (plotly_click, ...) from the host.
    private forwardEvents(): void {
        const plot = this.chartContainer;
        const emit = plot.emit;
        if (emit && emit !== this.forwardingEmit) {
            this.forwardingEmit = (name, data): void => {
                emit(name, data);
                if (!this.purgeAfterRender) {
                    this.$emit(name, data);
                }
            };
            plot.emit = this.forwardingEmit;
        }
    }

    // Plotly injects its modebar, hover, and map styles into document.head, which does not reach the shadow tree.
    private adoptPlotlyStyles(): void {
        const shadowRoot = this.shadowRoot!;
        const rules = Array.from(this.ownerDocument.head.querySelectorAll('style'))
            .filter(style => style.id.startsWith('plotly.js-style') || style.textContent?.includes('.maplibregl'))
            .flatMap(style => Array.from(style.sheet?.cssRules ?? [], rule => rule.cssText));
        this.plotlySheet.replaceSync(rules.join('\n'));
        if (!shadowRoot.adoptedStyleSheets.includes(this.plotlySheet)) {
            shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, this.plotlySheet];
        }
    }

    private createTemplate(): Template {
        // Plotly needs numeric font values; resolve CSS units and keywords in the chart's font context.
        const fontProbe = this.ownerDocument.createElement('span');
        fontProbe.style.position = 'absolute';
        fontProbe.style.visibility = 'hidden';
        this.shadowRoot!.append(fontProbe);
        const resolve = (size: string, weight = 'normal'): [number, number] => {
            fontProbe.style.fontSize = size;
            fontProbe.style.fontWeight = weight;
            const computed = getComputedStyle(fontProbe);
            return [parseFloat(computed.fontSize), Number(computed.fontWeight)];
        };
        const [fontSize, weight] = resolve(bodyFontSize.getValueFor(this), bodyFontWeight.getValueFor(this));
        const [tickFontSize] = resolve(subtitleFontSize.getValueFor(this));
        const [captionFontSize] = resolve(tooltipCaptionFontSize.getValueFor(this));
        fontProbe.remove();

        const foreground = bodyFontColor.getValueFor(this);
        const muted = subtitleFontColor.getValueFor(this);
        const grid = graphGridlineColor.getValueFor(this);
        const background = applicationBackgroundColor.getValueFor(this);
        const palette = paletteTokens.map(token => token.getValueFor(this));
        const tickfont = { size: tickFontSize, color: muted };
        const axis = {
            gridcolor: grid,
            linecolor: grid,
            zerolinecolor: grid,
            tickcolor: grid,
            ticks: '',
            tickfont,
            title: { font: { size: fontSize } },
            automargin: true
        } as const;
        const polarAxis = {
            gridcolor: grid, linecolor: grid, tickcolor: grid, ticks: '', tickfont, title: { font: { size: fontSize } }
        } as const;
        const sceneAxis = { ...polarAxis, zerolinecolor: grid, backgroundcolor: background } as const;
        const sequential: [number, string][] = [[0, background], [1, palette[0]!]];
        const scaled = [{ colorscale: sequential }];
        const pass = passColor.getValueFor(this);
        const fail = failColor.getValueFor(this);
        const priceDirections = [{ increasing: { line: { color: pass } }, decreasing: { line: { color: fail } } }];
        const tableCells = { fill: { color: background }, line: { color: grid }, font: { color: foreground } };

        // Plotly hard-codes colors for these traces instead of reading the layout.
        return {
            data: {
                heatmap: scaled,
                contour: scaled,
                histogram2d: scaled,
                histogram2dcontour: scaled,
                surface: scaled,
                mesh3d: scaled,
                isosurface: scaled,
                volume: scaled,
                cone: scaled,
                streamtube: scaled,
                choropleth: scaled,
                choroplethmap: scaled,
                densitymap: scaled,
                candlestick: priceDirections,
                ohlc: priceDirections,
                waterfall: [{
                    increasing: { marker: { color: pass } },
                    decreasing: { marker: { color: fail } },
                    totals: { marker: { color: palette[0] } },
                    connector: { line: { color: grid } }
                }],
                indicator: [{
                    gauge: { bar: { color: palette[0] }, bordercolor: grid },
                    delta: { increasing: { color: pass }, decreasing: { color: fail } }
                }],
                sankey: [{ node: { line: { width: 0 } }, link: { color: grid } }],
                table: [{ header: tableCells, cells: tableCells }]
            },
            layout: {
                font: { family: bodyFontFamily.getValueFor(this), size: fontSize, weight, color: foreground },
                title: { automargin: true, x: 0, xanchor: 'left', xref: 'paper', yref: 'container' },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                paper_bgcolor: background,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                plot_bgcolor: background,
                colorway: palette,
                colorscale: {
                    sequential,
                    sequentialminus: sequential,
                    diverging: [[0, palette[1]!], [0.5, background], [1, palette[0]!]]
                },
                margin: { t: 32, r: 16, b: 16, l: 16 },
                xaxis: axis,
                yaxis: axis,
                polar: { bgcolor: background, angularaxis: polarAxis, radialaxis: polarAxis },
                ternary: { bgcolor: background, aaxis: polarAxis, baxis: polarAxis, caxis: polarAxis },
                scene: { xaxis: sceneAxis, yaxis: sceneAxis, zaxis: sceneAxis },
                geo: {
                    bgcolor: background,
                    lakecolor: background,
                    landcolor: grid,
                    subunitcolor: background,
                    countrycolor: background,
                    coastlinecolor: grid
                },
                legend: { bgcolor: 'rgba(0, 0, 0, 0)' },
                hoverlabel: {
                    bgcolor: tooltipBackgroundColor.getValueFor(this),
                    bordercolor: popupBorderColor.getValueFor(this),
                    font: {
                        family: tooltipCaptionFontFamily.getValueFor(this),
                        size: captionFontSize,
                        color: tooltipCaptionFontColor.getValueFor(this)
                    },
                    align: 'left'
                },
                modebar: { bgcolor: 'rgba(0, 0, 0, 0)', color: muted, activecolor: foreground }
            }
        };
    }
}

const okFvChartPlotly = FvChartPlotly.compose({
    baseName: 'fv-chart-plotly',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvChartPlotly());
export const fvChartPlotlyTag = 'ok-fv-chart-plotly';
