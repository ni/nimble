import { html } from '@ni/fast-element';
import { TsIconDynamic, tsIconDynamicTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

const dynamicIconDataUri = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

async function setup(): Promise<Fixture<TsIconDynamic>> {
    return await fixture<TsIconDynamic>(html`<${tsIconDynamicTag}></${tsIconDynamicTag}>`);
}

describe('TsIconDynamic', () => {
    let element: TsIconDynamic;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(tsIconDynamicTag)).toBeInstanceOf(TsIconDynamic);
    });

    it('should have an empty shadow dom', async () => {
        await connect();
        expect(element.shadowRoot?.childNodes.length).toBe(0);
    });

    it('should throw for invalid icon tag names', () => {
        expect(() => TsIconDynamic.registerIconDynamic('awesome', dynamicIconDataUri)).toThrow();
        expect(() => TsIconDynamic.registerIconDynamic('ok-ts-icon-dynamic-a', dynamicIconDataUri)).toThrow();
        expect(() => TsIconDynamic.registerIconDynamic('ok-ts-icon-dynamic-Aaa', dynamicIconDataUri)).toThrow();
        expect(() => TsIconDynamic.registerIconDynamic('ok-ts-icon-dynamic-a1', dynamicIconDataUri)).toThrow();
        expect(() => TsIconDynamic.registerIconDynamic('ok-ts-icon-dynamic-a-', dynamicIconDataUri)).toThrow();
        expect(() => TsIconDynamic.registerIconDynamic('ok-ts-icon-dynamic-', dynamicIconDataUri)).toThrow();
    });

    it('should register a new dynamic icon tag', async () => {
        const name = 'kiwi';
        const tagName = `ok-ts-icon-dynamic-${name}`;

        TsIconDynamic.registerIconDynamic(tagName, dynamicIconDataUri);
        await customElements.whenDefined(tagName);

        expect(customElements.get(tagName)).toBeDefined();
    });

    it('should render an image with the registered src', async () => {
        const name = 'banana';
        const tagName = `ok-ts-icon-dynamic-${name}`;

        TsIconDynamic.registerIconDynamic(tagName, dynamicIconDataUri);
        await customElements.whenDefined(tagName);

        const dynamicIcon = document.createElement(tagName);
        document.body.appendChild(dynamicIcon);

        const img = dynamicIcon.shadowRoot?.querySelector('img') as HTMLImageElement | null;
        expect(img).toBeTruthy();
        expect(img?.getAttribute('src')).toBe(dynamicIconDataUri);

        dynamicIcon.remove();
    });

    it('should support registering multiple dynamic icons', async () => {
        const firstName = 'apple';
        const secondName = 'orange';
        const firstTagName = `ok-ts-icon-dynamic-${firstName}`;
        const secondTagName = `ok-ts-icon-dynamic-${secondName}`;

        TsIconDynamic.registerIconDynamic(firstTagName, dynamicIconDataUri);
        TsIconDynamic.registerIconDynamic(secondTagName, dynamicIconDataUri);

        await Promise.all([
            customElements.whenDefined(firstTagName),
            customElements.whenDefined(secondTagName)
        ]);

        expect(customElements.get(firstTagName)).toBeDefined();
        expect(customElements.get(secondTagName)).toBeDefined();
    });
});
