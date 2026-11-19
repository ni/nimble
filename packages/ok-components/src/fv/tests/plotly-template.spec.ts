import { html } from '@ni/fast-element';
import { bodyFont } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { fixture } from '../../utilities/tests/fixture';
import { createNimblePlotlyTemplate } from '../plotly-template';

describe('createNimblePlotlyTemplate', () => {
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
