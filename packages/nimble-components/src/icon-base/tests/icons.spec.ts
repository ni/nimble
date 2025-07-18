import * as nimbleIconsMap from '@ni/nimble-tokens/dist/icons/js';
import { html } from '@ni/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import * as allIconsNamespace from '../../icons/all-icons';
import { iconMetadata } from './icon-metadata';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import { IconAdd, iconAddTag } from '../../icons/add';

describe('Icons', () => {
    const nimbleIcons = Object.values(nimbleIconsMap);
    const getSVGElement = (htmlString: string): SVGElement => {
        const template = document.createElement('template');
        template.innerHTML = htmlString;
        const svg = template.content.querySelector('svg');
        return svg!;
    };

    describe('should have correct SVG structure', () => {
        parameterizeSpec(nimbleIcons, (spec, name, value) => {
            spec(`for icon ${name}`, () => {
                const svg = getSVGElement(value.data);
                expect(svg).toBeTruthy();
                expect(svg.getAttribute('viewBox')).toBeTruthy();
                expect(svg.getAttribute('height')).toBeNull();
                expect(svg.getAttribute('width')).toBeNull();
            });
        });
    });

    describe('should not have inline style', () => {
        const getPaths = (svg: SVGElement): SVGPathElement[] => Array.from(svg.querySelectorAll('path'));

        const nimbleIconsWithStyle = ['sparkle_swirls_16_x_16'];
        const nimbleIconsWithoutStyle = nimbleIcons.filter(
            value => !nimbleIconsWithStyle.includes(value.name)
        );
        parameterizeSpec(nimbleIconsWithoutStyle, (spec, name, value) => {
            spec(`for icon ${name}`, () => {
                const svg = getSVGElement(value.data);
                const paths = getPaths(svg);

                expect(svg.querySelector('defs')).toBeNull();
                for (const path of paths) {
                    expect(path.getAttribute('style')).toBeNull();
                }
            });
        });
    });

    describe('can be constructed', () => {
        type IconName = keyof typeof allIconsNamespace;
        const allIconNames = (Object.keys(allIconsNamespace) as IconName[]).map(
            (x: IconName) => ({ name: x, iconClass: allIconsNamespace[x] })
        );

        parameterizeSpec(allIconNames, (spec, name, value) => {
            spec(`for icon ${name}`, () => {
                const tagName = customElements.getName(value.iconClass)!;
                expect(typeof tagName).toBe('string');
                expect(tagName.length).toBeGreaterThan(0);
                expect(document.createElement(tagName)).toBeInstanceOf(
                    value.iconClass
                );
            });
        });
    });

    describe('should have valid metadata', () => {
        type IconName = keyof typeof iconMetadata;
        const icons = (Object.keys(iconMetadata) as IconName[]).map(name => ({
            name,
            metadata: iconMetadata[name]
        }));

        parameterizeSpec(icons, (spec, name, value) => {
            spec(`for icon ${name}`, () => {
                expect(value.metadata.tags).not.toContain('');
            });
        });
    });

    describe('Representative icon', () => {
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

        it('sets aria-hidden on inner div', async () => {
            await connect();
            const div = element.shadowRoot!.querySelector('.icon');
            expect(div?.getAttribute('aria-hidden')).toEqual('true');
        });
    });
});
