import { circlePartialBroken16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { html } from '@ni/fast-element';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    IconCirclePartialBroken,
    iconCirclePartialBrokenTag
} from '../../icons-multicolor/circle-partial-broken';
import { IconAdd, iconAddTag } from '../../icons/add';
import { Icon } from '..';
import { MultiColorIcon, MAX_ICON_LAYERS } from '../multi-color';

describe('Multi-color icons', () => {
    describe('IconCirclePartialBroken', () => {
        async function setup(): Promise<Fixture<IconCirclePartialBroken>> {
            return await fixture<IconCirclePartialBroken>(
                html`<${iconCirclePartialBrokenTag}></${iconCirclePartialBrokenTag}>`
            );
        }

        let element: IconCirclePartialBroken;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
        });

        afterEach(async () => {
            await disconnect();
        });

        it('can be constructed', () => {
            expect(
                document.createElement(iconCirclePartialBrokenTag)
            ).toBeInstanceOf(IconCirclePartialBroken);
        });

        it('should apply layer colors as CSS custom properties on host', async () => {
            await connect();

            const computedStyle = getComputedStyle(element);
            const layer1Color = computedStyle
                .getPropertyValue('--ni-nimble-icon-layer-1-color')
                .trim();
            const layer2Color = computedStyle
                .getPropertyValue('--ni-nimble-icon-layer-2-color')
                .trim();

            // Verify custom properties resolve to color values (not empty)
            expect(layer1Color).toBeTruthy();
            expect(layer2Color).toBeTruthy();
            // Verify they resolve to different colors
            expect(layer1Color).not.toBe(layer2Color);
        });

        it('should persist layer colors across disconnect/reconnect', async () => {
            await connect();

            const layer1Before = getComputedStyle(element).getPropertyValue(
                '--ni-nimble-icon-layer-1-color'
            );
            const layer2Before = getComputedStyle(element).getPropertyValue(
                '--ni-nimble-icon-layer-2-color'
            );

            await disconnect();
            await connect();

            const layer1After = getComputedStyle(element).getPropertyValue(
                '--ni-nimble-icon-layer-1-color'
            );
            const layer2After = getComputedStyle(element).getPropertyValue(
                '--ni-nimble-icon-layer-2-color'
            );

            expect(layer1After).toBe(layer1Before);
            expect(layer2After).toBe(layer2Before);
        });

        it('should render SVG with correct structure', async () => {
            await connect();

            const iconDiv = element.shadowRoot!.querySelector('.icon')!;
            expect(iconDiv.innerHTML).toContain('<svg');
            expect(iconDiv.innerHTML).toContain('viewBox');
        });

        it('should have aria-hidden on inner div', async () => {
            await connect();

            const iconDiv = element.shadowRoot!.querySelector('.icon');
            expect(iconDiv?.getAttribute('aria-hidden')).toBe('true');
        });

        it('should be accessible via tag name', () => {
            const tagName = customElements.getName(IconCirclePartialBroken);
            expect(tagName).toBe(iconCirclePartialBrokenTag);
        });
    });

    describe('Regular icons (non-multi-color)', () => {
        async function setup(): Promise<Fixture<IconAdd>> {
            return await fixture<IconAdd>(
                html`<${iconAddTag}></${iconAddTag}>`
            );
        }

        let element: IconAdd;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should not be a MultiColorIcon', async () => {
            await connect();

            expect(element instanceof MultiColorIcon).toBe(false);
        });

        it('should not have layer color CSS properties on host', async () => {
            await connect();

            const computedStyle = getComputedStyle(element);
            expect(
                computedStyle.getPropertyValue('--ni-nimble-icon-layer-1-color')
            ).toBe('');
            expect(
                computedStyle.getPropertyValue('--ni-nimble-icon-layer-2-color')
            ).toBe('');
        });

        it('should not be affected by multi-color logic', async () => {
            await connect();

            const iconDiv = element.shadowRoot!.querySelector('.icon')!;
            const innerHTML = iconDiv.innerHTML;

            expect(innerHTML).toContain('<svg');
        });
    });

    describe('MultiColorIcon base class', () => {
        it('should extend Icon', () => {
            const icon = new IconCirclePartialBroken();
            expect(icon).toBeInstanceOf(Icon);
            expect(icon).toBeInstanceOf(MultiColorIcon);
        });

        it('should preserve icon property from base class', () => {
            const icon = new IconCirclePartialBroken();
            expect(icon.icon).toBe(circlePartialBroken16X16);
        });

        it('should respect MAX_ICON_LAYERS limit', () => {
            // Verify the constant is set to expected value
            // The actual enforcement is tested through updateLayerColors()
            // which slices the layerColors array to MAX_ICON_LAYERS
            expect(MAX_ICON_LAYERS).toBe(6);
        });
    });

    describe('MAX_ICON_LAYERS constant', () => {
        it('should be defined and equal to 6', () => {
            expect(MAX_ICON_LAYERS).toBe(6);
        });
    });

    describe('Integration with DOM', () => {
        it('should render multi-color icon in DOM', async () => {
            const { element, connect, disconnect } = await fixture<IconCirclePartialBroken>(
                html`<${iconCirclePartialBrokenTag}></${iconCirclePartialBrokenTag}>`
            );

            await connect();

            expect(element.isConnected).toBe(true);
            expect(element.shadowRoot).toBeTruthy();

            const iconDiv = element.shadowRoot!.querySelector('.icon');
            expect(iconDiv).toBeTruthy();

            await disconnect();
        });

        it('should support multiple instances on same page', async () => {
            const {
                element: element1,
                connect: connect1,
                disconnect: disconnect1
            } = await fixture<IconCirclePartialBroken>(
                html`<${iconCirclePartialBrokenTag}></${iconCirclePartialBrokenTag}>`
            );

            const {
                element: element2,
                connect: connect2,
                disconnect: disconnect2
            } = await fixture<IconCirclePartialBroken>(
                html`<${iconCirclePartialBrokenTag}></${iconCirclePartialBrokenTag}>`
            );

            await connect1();
            await connect2();

            const iconDiv1 = element1.shadowRoot!.querySelector('.icon')!;
            const iconDiv2 = element2.shadowRoot!.querySelector('.icon')!;

            expect(iconDiv1).toBeDefined();
            expect(iconDiv2).toBeDefined();

            // Both instances should have layer colors set on host
            const layer1Color1 = getComputedStyle(element1)
                .getPropertyValue('--ni-nimble-icon-layer-1-color')
                .trim();
            const layer1Color2 = getComputedStyle(element2)
                .getPropertyValue('--ni-nimble-icon-layer-1-color')
                .trim();

            // Verify both instances have the layer color set and they match
            expect(layer1Color1).toBeTruthy();
            expect(layer1Color2).toBeTruthy();
            expect(layer1Color1).toBe(layer1Color2);

            await disconnect1();
            await disconnect2();
        });
    });

    describe('Icon base class functionality', () => {
        it('should preserve Icon base class properties', () => {
            const icon = new IconCirclePartialBroken();

            // Should have Icon properties
            expect(icon.icon).toBeDefined();
            expect(icon.icon).toBe(circlePartialBroken16X16);

            // Should have severity attribute support (from Icon base)
            expect(icon.severity).toBeUndefined(); // Not set by default
        });
    });
});
