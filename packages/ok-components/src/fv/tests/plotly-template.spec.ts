import { html } from '@ni/fast-element';
import { themeProviderTag, type ThemeProvider } from '@ni/nimble-components/dist/esm/theme-provider';
import { bodyFont } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { fixture } from '../../utilities/tests/fixture';
import { createNimblePlotlyTemplate } from '../plotly-template';

describe('createNimblePlotlyTemplate', () => {
    it('rejects a disconnected chart container', () => {
        const chart = document.createElement('div');
        expect(() => createNimblePlotlyTemplate(chart)).toThrowError(/must be connected/);
    });

    it('takes independent snapshots with independently editable axis fonts', async () => {
        const { element, connect, disconnect } = await fixture<ThemeProvider>(
            html`<${themeProviderTag}><div></div></${themeProviderTag}>`
        );
        await connect();
        try {
            const chart = element.firstElementChild as HTMLDivElement;
            const light = createNimblePlotlyTemplate(chart);
            const lightBackground = light.layout.paper_bgcolor;
            element.theme = Theme.dark;
            const dark = createNimblePlotlyTemplate(chart);

            expect(dark.layout.paper_bgcolor).not.toBe(lightBackground);
            expect(light.layout.paper_bgcolor).toBe(lightBackground);
            const yFontSize = dark.layout.yaxis.tickfont.size;
            dark.layout.xaxis.tickfont.size += 1;
            expect(dark.layout.yaxis.tickfont.size).toBe(yFontSize);
            expect(createNimblePlotlyTemplate(chart).layout.xaxis.tickfont.size).toBe(yFontSize);
        } finally {
            await disconnect();
        }
    });

    it('converts a relative Nimble font to a Plotly size without changing the container', async () => {
        const { element, connect, disconnect } = await fixture<HTMLDivElement>(
            html`<div style="font-size: 20px;"></div>`
        );
        await connect();
        bodyFont.setValueFor(element, 'bold 1.5em sans-serif');
        try {
            const template = createNimblePlotlyTemplate(element);

            expect(template.layout.font.size).toBe(30);
            expect(template.layout.font.weight).toBe(700);
            expect(element.childElementCount).toBe(0);
        } finally {
            bodyFont.deleteValueFor(element);
            await disconnect();
        }
    });
});
