import { html } from '@ni/fast-element';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    IconCirclePartialBroken,
    iconCirclePartialBrokenTag
} from '../../icons-multicolor/circle-partial-broken';
import { IconAdd, iconAddTag } from '../../icons/add';
import { Icon } from '..';
import { mixinMultiColorIcon, MAX_ICON_LAYERS } from '../mixins/multi-color';
import { getLayerColorStyles } from '../template';
import {
    graphGridlineColor,
    warningColor,
    failColor,
    borderColor
} from '../../theme-provider/design-tokens';
import { circlePartialBroken16X16 } from '@ni/nimble-tokens/dist/icons/js';

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

        it('should have layerColors property configured', async () => {
            await connect();

            expect(element.layerColors).toBeDefined();
            expect(element.layerColors.length).toBe(2);
            expect(element.layerColors[0]).toBe(graphGridlineColor);
            expect(element.layerColors[1]).toBe(warningColor);
        });

        it('should apply layer colors as inline CSS custom properties', async () => {
            await connect();

            const iconDiv = element.shadowRoot!.querySelector(
                '.icon'
            ) as HTMLElement;
            expect(iconDiv).toBeDefined();

            const styleAttr = iconDiv.getAttribute('style');
            expect(styleAttr).toBeTruthy();
            expect(styleAttr).toContain('--ni-nimble-icon-layer-1-color');
            expect(styleAttr).toContain('--ni-nimble-icon-layer-2-color');
            expect(styleAttr).toContain(
                graphGridlineColor.cssCustomProperty
            );
            expect(styleAttr).toContain(warningColor.cssCustomProperty);
        });

        it('should persist layer colors across disconnect/reconnect', async () => {
            await connect();

            const iconDiv = element.shadowRoot!.querySelector(
                '.icon'
            ) as HTMLElement;
            const initialStyle = iconDiv.getAttribute('style');

            await disconnect();
            await connect();

            const iconDivAfter = element.shadowRoot!.querySelector(
                '.icon'
            ) as HTMLElement;
            const styleAfter = iconDivAfter.getAttribute('style');

            expect(styleAfter).toBe(initialStyle);
        });

        it('should render SVG with correct structure', async () => {
            await connect();

            const iconDiv = element.shadowRoot!.querySelector(
                '.icon'
            ) as HTMLElement;
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

        it('should not have layerColors property', async () => {
            await connect();

            expect((element as any).layerColors).toBeUndefined();
        });

        it('should not have layer color styles', async () => {
            await connect();

            const iconDiv = element.shadowRoot!.querySelector(
                '.icon'
            ) as HTMLElement;
            const styleAttr = iconDiv.getAttribute('style');

            // Regular icons should have empty or no style attribute
            expect(styleAttr === '' || styleAttr === null).toBe(true);
        });

        it('should not be affected by multi-color logic', async () => {
            await connect();

            const iconDiv = element.shadowRoot!.querySelector(
                '.icon'
            ) as HTMLElement;
            const innerHTML = iconDiv.innerHTML;

            expect(innerHTML).toContain('<svg');
            expect(innerHTML).not.toContain('--ni-nimble-icon-layer');
        });
    });

    describe('getLayerColorStyles function', () => {
        it('should return empty string for regular icons', () => {
            const regularIcon = new IconAdd();
            const styles = getLayerColorStyles(regularIcon);

            expect(styles).toBe('');
        });

        it('should return empty string when layerColors is empty', () => {
            class TestIcon extends mixinMultiColorIcon(Icon) {
                public constructor() {
                    super(circlePartialBroken16X16);
                    this.layerColors = [];
                }
            }

            const testIcon = new TestIcon();
            const styles = getLayerColorStyles(testIcon);

            expect(styles).toBe('');
        });

        it('should generate correct CSS for two-layer icon', () => {
            const icon = new IconCirclePartialBroken();
            const styles = getLayerColorStyles(icon);

            expect(styles).toContain('--ni-nimble-icon-layer-1-color');
            expect(styles).toContain('--ni-nimble-icon-layer-2-color');
            expect(styles).toContain(graphGridlineColor.cssCustomProperty);
            expect(styles).toContain(warningColor.cssCustomProperty);
            expect(styles).toContain('var(');
        });

        it('should format styles correctly with semicolons', () => {
            const icon = new IconCirclePartialBroken();
            const styles = getLayerColorStyles(icon);

            // Should have format: "prop1: value1; prop2: value2"
            const parts = styles.split(';').map(s => s.trim()).filter(Boolean);
            expect(parts.length).toBe(2);
            expect(parts[0]).toMatch(/^--ni-nimble-icon-layer-\d+-color:/);
            expect(parts[1]).toMatch(/^--ni-nimble-icon-layer-\d+-color:/);
        });

        it('should enforce MAX_ICON_LAYERS limit', () => {
            // Create icon with more than MAX_ICON_LAYERS colors
            class TestIconManyLayers extends mixinMultiColorIcon(Icon) {
                public constructor() {
                    super(circlePartialBroken16X16);
                    this.layerColors = [
                        graphGridlineColor,
                        warningColor,
                        failColor,
                        borderColor,
                        graphGridlineColor,
                        warningColor,
                        failColor, // Layer 7 - should be ignored
                        borderColor // Layer 8 - should be ignored
                    ];
                }
            }

            const testIcon = new TestIconManyLayers();
            const styles = getLayerColorStyles(testIcon);

            // Count how many layer declarations are in the string
            const layerMatches = styles.match(/--ni-nimble-icon-layer-\d+-color/g);
            expect(layerMatches).toBeTruthy();
            expect(layerMatches!.length).toBe(MAX_ICON_LAYERS);

            // Verify highest layer is 6
            expect(styles).toContain('--ni-nimble-icon-layer-6-color');
            expect(styles).not.toContain('--ni-nimble-icon-layer-7-color');
            expect(styles).not.toContain('--ni-nimble-icon-layer-8-color');
        });

        it('should map layer indices correctly', () => {
            const icon = new IconCirclePartialBroken();
            const styles = getLayerColorStyles(icon);

            // layerColors[0] should map to layer-1
            // layerColors[1] should map to layer-2
            const layer1Match = styles.match(
                /--ni-nimble-icon-layer-1-color:\s*var\(([^)]+)\)/
            );
            const layer2Match = styles.match(
                /--ni-nimble-icon-layer-2-color:\s*var\(([^)]+)\)/
            );

            expect(layer1Match).toBeTruthy();
            expect(layer2Match).toBeTruthy();
            expect(layer1Match![1]).toBe(graphGridlineColor.cssCustomProperty);
            expect(layer2Match![1]).toBe(warningColor.cssCustomProperty);
        });
    });

    describe('mixinMultiColorIcon', () => {
        it('should create a class that extends Icon', () => {
            class TestIcon extends mixinMultiColorIcon(Icon) {
                public constructor() {
                    super(circlePartialBroken16X16);
                }
            }

            const testIcon = new TestIcon();
            expect(testIcon).toBeInstanceOf(Icon);
        });

        it('should add layerColors property', () => {
            class TestIcon extends mixinMultiColorIcon(Icon) {
                public constructor() {
                    super(circlePartialBroken16X16);
                    this.layerColors = [graphGridlineColor];
                }
            }

            const testIcon = new TestIcon();
            expect(testIcon.layerColors).toBeDefined();
            expect(Array.isArray(testIcon.layerColors)).toBe(true);
        });

        it('should allow empty layerColors array', () => {
            class TestIcon extends mixinMultiColorIcon(Icon) {
                public constructor() {
                    super(circlePartialBroken16X16);
                    this.layerColors = [];
                }
            }

            const testIcon = new TestIcon();
            expect(testIcon.layerColors).toEqual([]);
        });

        it('should support multiple layer colors', () => {
            class TestIconThreeLayers extends mixinMultiColorIcon(Icon) {
                public constructor() {
                    super(circlePartialBroken16X16);
                    this.layerColors = [
                        graphGridlineColor,
                        warningColor,
                        failColor
                    ];
                }
            }

            const testIcon = new TestIconThreeLayers();
            expect(testIcon.layerColors.length).toBe(3);
            expect(testIcon.layerColors[0]).toBe(graphGridlineColor);
            expect(testIcon.layerColors[1]).toBe(warningColor);
            expect(testIcon.layerColors[2]).toBe(failColor);
        });

        it('should preserve icon property from base class', () => {
            class TestIcon extends mixinMultiColorIcon(Icon) {
                public constructor() {
                    super(circlePartialBroken16X16);
                }
            }

            const testIcon = new TestIcon();
            expect(testIcon.icon).toBe(circlePartialBroken16X16);
        });
    });

    describe('MAX_ICON_LAYERS constant', () => {
        it('should be defined and equal to 6', () => {
            expect(MAX_ICON_LAYERS).toBe(6);
        });

        it('should be used consistently in template function', () => {
            // Create icon with exactly MAX_ICON_LAYERS colors
            class TestIconMaxLayers extends mixinMultiColorIcon(Icon) {
                public constructor() {
                    super(circlePartialBroken16X16);
                    this.layerColors = [
                        graphGridlineColor,
                        warningColor,
                        failColor,
                        borderColor,
                        graphGridlineColor,
                        warningColor
                    ];
                }
            }

            const testIcon = new TestIconMaxLayers();
            const styles = getLayerColorStyles(testIcon);

            const layerMatches = styles.match(/--ni-nimble-icon-layer-\d+-color/g);
            expect(layerMatches!.length).toBe(MAX_ICON_LAYERS);
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
            const { element: element1, connect: connect1, disconnect: disconnect1 } = await fixture<IconCirclePartialBroken>(
                html`<${iconCirclePartialBrokenTag}></${iconCirclePartialBrokenTag}>`
            );

            const { element: element2, connect: connect2, disconnect: disconnect2 } = await fixture<IconCirclePartialBroken>(
                html`<${iconCirclePartialBrokenTag}></${iconCirclePartialBrokenTag}>`
            );

            await connect1();
            await connect2();

            const iconDiv1 = element1.shadowRoot!.querySelector(
                '.icon'
            ) as HTMLElement;
            const iconDiv2 = element2.shadowRoot!.querySelector(
                '.icon'
            ) as HTMLElement;

            const style1 = iconDiv1.getAttribute('style');
            const style2 = iconDiv2.getAttribute('style');

            // Both should have the same styles
            expect(style1).toBe(style2);
            expect(style1).toContain('--ni-nimble-icon-layer-1-color');

            await disconnect1();
            await disconnect2();
        });
    });

    describe('Edge cases', () => {
        it('should handle undefined layerColors property gracefully', () => {
            const regularIcon = new IconAdd();
            const styles = getLayerColorStyles(regularIcon);

            expect(styles).toBe('');
        });

        it('should handle icon with single layer color', () => {
            class TestIconOneLayer extends mixinMultiColorIcon(Icon) {
                public constructor() {
                    super(circlePartialBroken16X16);
                    this.layerColors = [graphGridlineColor];
                }
            }

            const testIcon = new TestIconOneLayer();
            const styles = getLayerColorStyles(testIcon);

            expect(styles).toContain('--ni-nimble-icon-layer-1-color');
            expect(styles).not.toContain('--ni-nimble-icon-layer-2-color');
        });

        it('should handle very long layerColors array', () => {
            const manyColors = Array(20).fill(graphGridlineColor);

            class TestIconManyLayers extends mixinMultiColorIcon(Icon) {
                public constructor() {
                    super(circlePartialBroken16X16);
                    this.layerColors = manyColors;
                }
            }

            const testIcon = new TestIconManyLayers();
            const styles = getLayerColorStyles(testIcon);

            // Should only include up to MAX_ICON_LAYERS
            const layerMatches = styles.match(/--ni-nimble-icon-layer-\d+-color/g);
            expect(layerMatches!.length).toBe(MAX_ICON_LAYERS);
        });
    });

    describe('Layer index to CSS class mapping', () => {
        it('should map layerColors[0] to layer-1', () => {
            const icon = new IconCirclePartialBroken();
            const styles = getLayerColorStyles(icon);

            const layerPattern = /--ni-nimble-icon-layer-1-color:\s*var\(([^)]+)\)/;
            const match = styles.match(layerPattern);

            expect(match).toBeTruthy();
            expect(match![1]).toBe(graphGridlineColor.cssCustomProperty);
        });

        it('should map layerColors[1] to layer-2', () => {
            const icon = new IconCirclePartialBroken();
            const styles = getLayerColorStyles(icon);

            const layerPattern = /--ni-nimble-icon-layer-2-color:\s*var\(([^)]+)\)/;
            const match = styles.match(layerPattern);

            expect(match).toBeTruthy();
            expect(match![1]).toBe(warningColor.cssCustomProperty);
        });
    });

    describe('Mixin composition', () => {
        it('should work with Icon base class', () => {
            class TestIcon extends mixinMultiColorIcon(Icon) {
                public constructor() {
                    super(circlePartialBroken16X16);
                }
            }

            const testIcon = new TestIcon();
            expect(testIcon).toBeInstanceOf(Icon);
            expect(testIcon.icon).toBeDefined();
        });

        it('should preserve Icon base class functionality', () => {
            const icon = new IconCirclePartialBroken();

            // Should have Icon properties
            expect(icon.icon).toBeDefined();
            expect(icon.icon).toBe(circlePartialBroken16X16);

            // Should have severity attribute support (from Icon base)
            expect(icon.severity).toBeUndefined(); // Not set by default
        });
    });
});
