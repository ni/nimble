import * as nimbleIconsMap from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import type { NimbleIconName } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { getSpecTypeByList } from '../../tests/utilities/parameterized-test-helpers';

describe('Icons', () => {
    describe('should have a viewBox', () => {
        const nimbleIcons = Object.values(nimbleIconsMap);
        const focused: NimbleIconName[] = [
        ];
        // Enable tests after svg icons fixed
        // See: https://github.com/ni/nimble/issues/63
        const disabled: NimbleIconName[] = [
            'home_16_x_16',
            'down_arrow',
            'ni_eagle_16_x_16',
            'up_arrow'
        ];

        const getSVGElement = (htmlString: string): SVGElement | null => {
            const template = document.createElement('template');
            template.innerHTML = htmlString;
            const svg = template.content.querySelector('svg');
            return svg;
        };

        for (const icon of nimbleIcons) {
            const specType = getSpecTypeByList(icon.name, focused, disabled);
            specType(`for icon ${icon.name}`, () => {
                const svg = getSVGElement(icon.data);
                expect(svg).toBeTruthy();
                expect(svg!.getAttribute('viewBox')).toBeTruthy();
                expect(svg!.getAttribute('height')).toBeNull();
                expect(svg!.getAttribute('width')).toBeNull();
            });
        }
    });
});
