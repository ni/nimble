import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    graphGridlineColor,
    graphTrace1Color,
    graphTrace2Color,
    graphTrace3Color,
    graphTrace4Color,
    graphTrace5Color,
    graphTrace6Color,
    graphTrace7Color,
    graphTrace8Color,
    popupBorderColor,
    subtitleFont,
    subtitleFontColor,
    tooltipBackgroundColor,
    tooltipCaptionFont,
    tooltipCaptionFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

const palette = [
    graphTrace1Color, graphTrace2Color, graphTrace3Color, graphTrace4Color,
    graphTrace5Color, graphTrace6Color, graphTrace7Color, graphTrace8Color
];

interface PlotlyFont {
    family: string;
    size: number;
    weight: number;
    color: string;
}

interface PlotlyAxis {
    gridcolor: string;
    zerolinecolor: string;
    tickfont: PlotlyFont;
    automargin: boolean;
}

interface NimblePlotlyTemplate {
    layout: {
        font: PlotlyFont,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        paper_bgcolor: string,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        plot_bgcolor: string,
        colorway: string[],
        xaxis: PlotlyAxis,
        yaxis: PlotlyAxis,
        hoverlabel: { bgcolor: string, bordercolor: string, font: PlotlyFont }
    };
}

/**
 * Creates a fresh snapshot of common Plotly layout defaults for a connected chart container.
 * Call again when the Nimble theme changes.
 * @throws If the container is not connected to a document with a window.
 */
export function createNimblePlotlyTemplate(element: HTMLElement): NimblePlotlyTemplate {
    const document = element.ownerDocument;
    const view = document.defaultView;
    if (!element.isConnected || !view) {
        throw new Error('The Plotly chart container must be connected to a document with a window.');
    }

    const probe = document.createElement('span');
    probe.hidden = true;
    element.append(probe);
    const resolveFont = (font: string, color: string): PlotlyFont => {
        probe.style.font = font;
        const computed = view.getComputedStyle(probe);
        return {
            family: computed.fontFamily,
            size: parseFloat(computed.fontSize),
            weight: Number(computed.fontWeight),
            color
        };
    };
    try {
        const background = applicationBackgroundColor.getValueFor(element);
        const gridcolor = graphGridlineColor.getValueFor(element);
        const tickfont = resolveFont(subtitleFont.getValueFor(element), subtitleFontColor.getValueFor(element));
        const axis = { gridcolor, zerolinecolor: gridcolor, tickfont, automargin: true };
        return {
            layout: {
                font: resolveFont(bodyFont.getValueFor(element), bodyFontColor.getValueFor(element)),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                paper_bgcolor: background,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                plot_bgcolor: background,
                colorway: palette.map(token => token.getValueFor(element)),
                xaxis: axis,
                yaxis: { ...axis, tickfont: { ...tickfont } },
                hoverlabel: {
                    bgcolor: tooltipBackgroundColor.getValueFor(element),
                    bordercolor: popupBorderColor.getValueFor(element),
                    font: resolveFont(tooltipCaptionFont.getValueFor(element), tooltipCaptionFontColor.getValueFor(element))
                }
            }
        };
    } finally {
        probe.remove();
    }
}
