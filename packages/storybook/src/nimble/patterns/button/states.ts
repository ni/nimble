import { ButtonAppearance, ButtonAppearanceVariant } from '../../../../../nimble-components/src/patterns/button/types';

/* array of iconVisible, labelVisible, endIconVisible */
export const partVisibilityStates = [
    [true, true, false],
    [true, false, false],
    [false, true, false],
    [true, true, true],
    [false, true, true]
] as const;
export type PartVisibilityState = (typeof partVisibilityStates)[number];
export const partVisibilityStatesOnlyLabel = partVisibilityStates[2];

export const appearanceStates = [
    ['Outline', ButtonAppearance.outline],
    ['Ghost', ButtonAppearance.ghost],
    ['Block', ButtonAppearance.block]
] as const;
export type AppearanceState = (typeof appearanceStates)[number];

export const appearanceVariantStates = [
    ['Default', ButtonAppearanceVariant.default],
    ['Primary', ButtonAppearanceVariant.primary],
    ['Accent', ButtonAppearanceVariant.accent]
] as const;
export type AppearanceVariantState = (typeof appearanceVariantStates)[number];
