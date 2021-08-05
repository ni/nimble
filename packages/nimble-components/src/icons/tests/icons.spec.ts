import * as nimbleIconsMap from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import type { NimbleIconName } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { getSpecTypeByList } from '../../tests/utilities/parameterized-test-helpers';

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
            const specType = getSpecTypeByList(icon.name, focused, disabled);
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
});
