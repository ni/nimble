import { html } from '@microsoft/fast-element';
import { TextField, textFieldTag } from '..';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { processUpdates } from '../../testing/async-helpers';

async function setup(): Promise<Fixture<TextField>> {
    return await fixture<TextField>(
        html`<${textFieldTag}></${textFieldTag}>`
    );
}

describe('TextField', () => {
    let element: TextField;
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
        expect(document.createElement(textFieldTag)).toBeInstanceOf(TextField);
    });

    it('should set "aria-required" to true when "required-visible" is true', () => {
        element.requiredVisible = true;
        processUpdates();
        expect(element.control.getAttribute('aria-required')).toBe('true');
    });

    it('should set "aria-required" to false when "required-visible" is false', () => {
        element.requiredVisible = false;
        processUpdates();
        expect(element.control.getAttribute('aria-required')).toBe('false');
    });
});
