import * as nimbleIconsMap from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import type { NimbleIconName } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { DesignSystem } from '@microsoft/fast-foundation';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';
import * as allIconsNamespace from '../../icons/all-icons';

describe('Icons', () => {
    describe('should have a viewBox', () => {
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
                for (const path of paths) {
                    expect(path.getAttribute('style')).toBeNull();
                }
            });
        }
    });

    describe('can be constructed', () => {
        type IconName = keyof typeof allIconsNamespace;
        const allIconNames = (Object.keys(allIconsNamespace) as IconName[]).map((x: IconName) => ({ name: x, klass: allIconsNamespace[x] }));

        const focused: IconName[] = [];
        const disabled: IconName[] = [];
        for (const icon of allIconNames) {
            const specType = getSpecTypeByNamedList(icon, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(`for icon ${icon.name}`, () => {
                const tagName = DesignSystem.tagFor(icon.klass);
                expect(typeof tagName).toBe('string');
                expect(tagName.length).toBeGreaterThan(0);
                expect(document.createElement(tagName)).toBeInstanceOf(icon.klass);
            });
        }
    });
});
