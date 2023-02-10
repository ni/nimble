import * as nimbleIconsMap from '@ni/nimble-tokens/dist/icons/js';
import type { NimbleIconName } from '@ni/nimble-tokens/dist/icons/js';
import { DesignSystem } from '@microsoft/fast-foundation';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';
import * as allIconsNamespace from '../../icons/all-icons';
import { iconMetadata } from '../icon-metadata';

describe('Icons', () => {
    describe('should have correct SVG structure', () => {
        const nimbleIcons = Object.values(nimbleIconsMap);
        const getSVGElement = (htmlString: string): SVGElement => {
            const template = document.createElement('template');
            template.innerHTML = htmlString;
            const svg = template.content.querySelector('svg');
            return svg!;
        };
        const getPaths = (svg: SVGElement): SVGPathElement[] => Array.from(svg.querySelectorAll('path'));

        const focused: NimbleIconName[] = [];
        const disabled: NimbleIconName[] = [];
        for (const icon of nimbleIcons) {
            const specType = getSpecTypeByNamedList(icon, focused, disabled);
            specType(`for icon ${icon.name}`, () => {
                const svg = getSVGElement(icon.data);
                const paths = getPaths(svg);
                expect(svg).toBeTruthy();
                expect(svg.getAttribute('viewBox')).toBeTruthy();
                expect(svg.getAttribute('height')).toBeNull();
                expect(svg.getAttribute('width')).toBeNull();
                expect(svg.querySelector('defs')).toBeNull();
                for (const path of paths) {
                    expect(path.getAttribute('style')).toBeNull();
                }
            });
        }
    });

    describe('can be constructed', () => {
        type IconName = keyof typeof allIconsNamespace;
        const allIconNames = (Object.keys(allIconsNamespace) as IconName[]).map(
            (x: IconName) => ({ name: x, klass: allIconsNamespace[x] })
        );

        const focused: IconName[] = [];
        const disabled: IconName[] = [];
        for (const icon of allIconNames) {
            const specType = getSpecTypeByNamedList(icon, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(`for icon ${icon.name}`, () => {
                const tagName = DesignSystem.tagFor(icon.klass);
                expect(typeof tagName).toBe('string');
                expect(tagName.length).toBeGreaterThan(0);
                expect(document.createElement(tagName)).toBeInstanceOf(
                    icon.klass
                );
            });
        }
    });

    describe('should have valid metadata', () => {
        type IconName = keyof typeof iconMetadata;
        const icons = (Object.keys(iconMetadata) as IconName[]).map(name => ({
            name,
            metadata: iconMetadata[name]
        }));

        const focused: IconName[] = [];
        const disabled: IconName[] = [];
        for (const icon of icons) {
            const specType = getSpecTypeByNamedList(icon, focused, disabled);
            specType(`for icon ${icon.name}`, () => {
                expect(icon.metadata.tags).not.toContain('');
            });
        }
    });
});
