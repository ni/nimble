import { html } from '@ni/fast-element';
import { IconDynamic, iconDynamicTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';

const dynamicIconDataUri = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

async function setup(): Promise<Fixture<IconDynamic>> {
    return await fixture<IconDynamic>(html`<${iconDynamicTag}></${iconDynamicTag}>`);
}

describe('IconDynamic', () => {
    let element: IconDynamic;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(iconDynamicTag)).toBeInstanceOf(IconDynamic);
    });

    it('should have an empty shadow dom', async () => {
        await connect();
        expect(element.shadowRoot?.childNodes.length).toBe(0);
    });

    it('should throw for invalid icon names', () => {
        expect(() => IconDynamic.registerIconDynamic('a', dynamicIconDataUri)).toThrow();
        expect(() => IconDynamic.registerIconDynamic('Aaa', dynamicIconDataUri)).toThrow();
        expect(() => IconDynamic.registerIconDynamic('a1', dynamicIconDataUri)).toThrow();
        expect(() => IconDynamic.registerIconDynamic('a-', dynamicIconDataUri)).toThrow();
    });

    it('should register a new dynamic icon tag', async () => {
        const name = 'kiwi';
        const tagName = `ok-icon-dynamic-${name}`;

        IconDynamic.registerIconDynamic(name, dynamicIconDataUri);
        await customElements.whenDefined(tagName);

        expect(customElements.get(tagName)).toBeDefined();
    });

    it('should render an image with the registered src', async () => {
        const name = 'banana';
        const tagName = `ok-icon-dynamic-${name}`;

        IconDynamic.registerIconDynamic(name, dynamicIconDataUri);
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
        const firstTagName = `ok-icon-dynamic-${firstName}`;
        const secondTagName = `ok-icon-dynamic-${secondName}`;

        IconDynamic.registerIconDynamic(firstName, dynamicIconDataUri);
        IconDynamic.registerIconDynamic(secondName, dynamicIconDataUri);

        await Promise.all([
            customElements.whenDefined(firstTagName),
            customElements.whenDefined(secondTagName)
        ]);

        expect(customElements.get(firstTagName)).toBeDefined();
        expect(customElements.get(secondTagName)).toBeDefined();
    });
});
