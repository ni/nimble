import { html } from '@ni/fast-element';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvContextHelp, fvContextHelpTag } from '..';

async function setup(): Promise<Fixture<FvContextHelp>> {
    return await fixture<FvContextHelp>(html`
        <${fvContextHelpTag} text="Calibration assets include scheduled maintenance history."></${fvContextHelpTag}>
    `);
}

describe('FvContextHelp', () => {
    let element: FvContextHelp;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvContextHelpTag)).toBeInstanceOf(FvContextHelp);
    });

    it('wires the tooltip to the internal trigger', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const tooltip = element.shadowRoot?.querySelector('nimble-tooltip');
        const button = element.shadowRoot?.querySelector('button');

        expect(tooltip?.getAttribute('anchor')).toBe(button?.id);
    });
});