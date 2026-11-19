import type { Data, Layout } from 'plotly.js-dist-min';
import { bodyFontSize, bodyFontWeight, graphTrace1Color } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { FvChartPlotly, fvChartPlotlyTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

type PlotDiv = HTMLDivElement & { _fullLayout?: Layout };

const data: Data[] = [{ type: 'scatter', x: [1, 2, 3], y: [2, 4, 3] }];

describe('FvChartPlotly', () => {
    let element: FvChartPlotly;
    let connect: Fixture['connect'];
    let disconnect: Fixture['disconnect'];

    const afterPlot = async (): Promise<Event> => await new Promise(resolve => {
        element.addEventListener('plotly_afterplot', resolve, { once: true });
    });
    const fullLayout = (): Layout => (element.chartContainer as PlotDiv)._fullLayout!;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await fixture<FvChartPlotly>(fvChartPlotlyTag));
    });

    afterEach(async () => {
        await disconnect();
        graphTrace1Color.deleteValueFor(element);
        bodyFontSize.deleteValueFor(element);
        bodyFontWeight.deleteValueFor(element);
    });

    it('can construct without data', async () => {
        await connect();
        expect(element).toBeInstanceOf(FvChartPlotly);
        expect(element.shadowRoot!.querySelector('.main-svg')).toBeNull();
    });

    it('plots data with Nimble defaults, forwards Plotly events, and lets the layout override them', async () => {
        graphTrace1Color.setValueFor(element, '#123456');
        element.data = data;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        element.layout = { plot_bgcolor: '#abcdef' };
        const plotted = afterPlot();
        await connect();
        await plotted;
        await new Promise(requestAnimationFrame);

        expect(element.shadowRoot!.querySelector('.main-svg')).not.toBeNull();
        expect(fullLayout().colorway![0]).toBe('#123456');
        expect(fullLayout().plot_bgcolor).toBe('#abcdef');
        expect(element.shadowRoot!.adoptedStyleSheets.some(sheet => Array.from(sheet.cssRules).some(rule => rule.cssText.includes('.modebar')))).toBeTrue();
    });

    it('resolves relative font sizes and keyword weights', async () => {
        bodyFontSize.setValueFor(element, '1.5rem');
        bodyFontWeight.setValueFor(element, 'bold');
        element.data = data;
        const plotted = afterPlot();
        await connect();
        await plotted;

        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        expect(fullLayout().font!.size).toBe(rootFontSize * 1.5);
        expect(fullLayout().font!.weight).toBe(700);
    });

    it('restyles when a Nimble token changes and purges when data is cleared', async () => {
        element.data = data;
        let plotted = afterPlot();
        await connect();
        await plotted;

        plotted = afterPlot();
        graphTrace1Color.setValueFor(element, '#654321');
        await plotted;
        expect(fullLayout().colorway![0]).toBe('#654321');

        element.data = undefined;
        await new Promise(requestAnimationFrame);
        expect(element.shadowRoot!.querySelector('.main-svg')).toBeNull();
    });
});
