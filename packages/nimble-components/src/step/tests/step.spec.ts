import { html } from '@ni/fast-element';
import { Step, stepTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

describe('Step', () => {
    async function setup(): Promise<Fixture<Step>> {
        return await fixture<Step>(html`<${stepTag}></${stepTag}>`);
    }

    it('can construct an element instance', () => {
        expect(document.createElement(stepTag)).toBeInstanceOf(Step);
    });

    it('should default tabIndex on the internal button to 0', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const innerStep = element.shadowRoot!.querySelector('button')!;
        expect(innerStep.getAttribute('tabindex')).toBeNull();
        expect(innerStep.tabIndex).toEqual(0);

        await disconnect();
    });

    it('should set the `tabindex` attribute on the internal button when provided', async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute('tabindex', '-1');
        await connect();

        const innerStep = element.shadowRoot!.querySelector('button')!;
        expect(innerStep.getAttribute('tabindex')).toEqual('-1');
        expect(innerStep.tabIndex).toEqual(-1);

        await disconnect();
    });

    it('should clear the `tabindex` attribute on the internal button when cleared from the host', async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute('tabindex', '-1');
        await connect();

        element.removeAttribute('tabindex');
        await waitForUpdatesAsync();

        const innerStep = element.shadowRoot!.querySelector('button')!;
        expect(innerStep.getAttribute('tabindex')).toBeNull();
        expect(innerStep.tabIndex).toEqual(0);

        await disconnect();
    });
});
