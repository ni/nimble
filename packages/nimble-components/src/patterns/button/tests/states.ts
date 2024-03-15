import { pascalCase } from '@microsoft/fast-web-utilities';
import { ButtonAppearance, ButtonAppearanceVariant } from '../types';

/* array of iconVisible, labelVisible, endIconVisible */
export const partVisibilityStates = [
    [true, true, false],
    [true, false, false],
    [false, true, false],
    [true, true, true],
    [false, true, true]
] as const;
export type PartVisibilityState = (typeof partVisibilityStates)[number];

export const appearanceStates: [string, string | undefined][] = Object.entries(
    ButtonAppearance
).map(([key, value]) => [pascalCase(key), value]);
export type AppearanceState = (typeof appearanceStates)[number];

export const appearanceVariantStates: [string, string | undefined][] = Object.entries(ButtonAppearanceVariant).map(([key, value]) => [
    pascalCase(key),
    value
]);
export type AppearanceVariantState = (typeof appearanceVariantStates)[number];
