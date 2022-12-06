import { DOM, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    Anchor as FoundationAnchor
} from '@microsoft/fast-foundation';
import { Anchor } from '..';
import { fixture, Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<Anchor>> {
    return fixture<Anchor>(html`<nimble-anchor></nimble-anchor>`);
}

describe('Anchor', () => {
    let element: Anchor;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should have its tag returned by tagFor(FoundationAnchor)', () => {
        expect(DesignSystem.tagFor(FoundationAnchor)).toBe('nimble-anchor');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-anchor')).toBeInstanceOf(Anchor);
    });

    it('should set the "control" class on the internal control', async () => {
        await connect();
        expect(element.control.classList.contains('control')).toBe(true);
    });

    it('should set the `part` attribute to "control" on the internal control', async () => {
        await connect();
        expect(element.control.part.contains('control')).toBe(true);
    });

    it('should reflect `download` value to the internal control', async () => {
        await connect();

        element.setAttribute('download', 'filename');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('download')).toBe('filename');
    });

    it('should reflect `hreflang` value to the internal control', async () => {
        await connect();

        element.setAttribute('hreflang', 'en');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('hreflang')).toBe('en');
    });

    it('should reflect `ping` value to the internal control', async () => {
        await connect();

        element.setAttribute('ping', 'http://www.ni.com http://www.google.com');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('ping')).toBe(
            'http://www.ni.com http://www.google.com'
        );
    });

    it('should reflect `referrerpolicy` value to the internal control', async () => {
        await connect();

        element.setAttribute('referrerpolicy', 'no-referrer');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('referrerpolicy')).toBe(
            'no-referrer'
        );
    });

    it('should reflect `rel` value to the internal control', async () => {
        await connect();

        element.setAttribute('rel', 'alternate');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('rel')).toBe('alternate');
    });

    it('should reflect `target` value to the internal control', async () => {
        await connect();

        element.setAttribute('target', '_blank');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('target')).toBe('_blank');
    });

    it('should reflect `type` value to the internal control', async () => {
        await connect();

        element.setAttribute('type', 'text/plain');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('type')).toBe('text/plain');
    });

    it('should reflect `aria-atomic` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-atomic', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-atomic')).toBe('foo');
    });

    it('should reflect `aria-busy` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-busy', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-busy')).toBe('foo');
    });

    it('should reflect `aria-controls` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-controls', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-controls')).toBe('foo');
    });

    it('should reflect `aria-current` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-current', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-current')).toBe('foo');
    });

    it('should reflect `aria-describedby` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-describedby', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-describedby')).toBe('foo');
    });

    it('should reflect `aria-details` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-details', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-details')).toBe('foo');
    });

    it('should reflect `aria-disabled` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-disabled', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-disabled')).toBe('foo');
    });

    it('should reflect `aria-errormessage` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-errormessage', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-errormessage')).toBe('foo');
    });

    it('should reflect `aria-expanded` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-expanded', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-expanded')).toBe('foo');
    });

    it('should reflect `aria-flowto` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-flowto', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-flowto')).toBe('foo');
    });

    it('should reflect `aria-haspopup` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-haspopup', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-haspopup')).toBe('foo');
    });

    it('should reflect `aria-hidden` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-hidden', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-hidden')).toBe('foo');
    });

    it('should reflect `aria-invalid` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-invalid', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-invalid')).toBe('foo');
    });

    it('should reflect `aria-keyshortcuts` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-keyshortcuts', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-keyshortcuts')).toBe('foo');
    });

    it('should reflect `aria-label` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-label', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-label')).toBe('foo');
    });

    it('should reflect `aria-labelledby` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-labelledby', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-labelledby')).toBe('foo');
    });

    it('should reflect `aria-live` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-live', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-live')).toBe('foo');
    });

    it('should reflect `aria-owns` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-owns', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-owns')).toBe('foo');
    });

    it('should reflect `aria-relevant` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-relevant', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-relevant')).toBe('foo');
    });

    it('should reflect `aria-roledescription` value to the internal control', async () => {
        await connect();

        element.setAttribute('aria-roledescription', 'foo');
        await DOM.nextUpdate();

        expect(element.control.getAttribute('aria-roledescription')).toBe(
            'foo'
        );
    });
});
