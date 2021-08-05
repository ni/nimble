import * as nimbleIconsMap from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import type { NimbleIconName } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

describe('Icons', () => {
    describe('should have a viewBox', () => {
        const nimbleIcons = Object.values(nimbleIconsMap);

        // eslint-disable-next-line no-restricted-globals
        const getSpecType = (icon: NimbleIconName): typeof fit | typeof xit | typeof it => {
            const focused: NimbleIconName[] = [
            ];

            const disabled: NimbleIconName[] = [
                'home_16_x_16',
                'down_arrow',
                'ni_eagle_16_x_16',
                'up_arrow'
            ];

            if (focused.includes(icon)) {
                // eslint-disable-next-line no-restricted-globals
                return fit;
            }
            if (disabled.includes(icon)) {
                return xit;
            }
            return it;
        };

        for (const icon of nimbleIcons) {
            const specType = getSpecType(icon.name);
            specType(`with name ${icon.name} should have a viewBox`, () => {
                expect(icon.data).toContain('viewBox');
            });
        }
    });
});
