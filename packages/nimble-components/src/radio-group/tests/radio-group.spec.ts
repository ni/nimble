import { html } from '@microsoft/fast-element';
import { RadioGroup, radioGroupTag } from '..';
import { Fixture, fixture } from '../../utilities/tests/fixture';
import { processUpdates } from '../../testing/async-helpers';

async function setup(): Promise<Fixture<RadioGroup>> {
    return await fixture<RadioGroup>(
        html`<${radioGroupTag}></${radioGroupTag}>`
    );
}

describe('Radio Group', () => {
    let element: RadioGroup;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(radioGroupTag)).toBeInstanceOf(
            RadioGroup
        );
    });

    it('should set "aria-required" to true when "required-visible" is true', () => {
        element.requiredVisible = true;
        processUpdates();
        expect(element.getAttribute('aria-required')).toBe('true');
    });

    it('should set "aria-required" to false when "required-visible" is false', () => {
        element.requiredVisible = false;
        processUpdates();
        expect(element.getAttribute('aria-required')).toBe('false');
    });
});
