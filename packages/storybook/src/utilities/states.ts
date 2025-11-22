import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';

export const backgroundStates = [
    {
        name: `"${Theme.light}" theme on white`,
        value: '#F4F4F4',
        theme: Theme.light
    },
    {
        name: `"${Theme.color}" theme on dark green`,
        value: '#044123',
        theme: Theme.color
    },
    {
        name: `"${Theme.dark}" theme on black`,
        value: '#252526',
        theme: Theme.dark
    }
] as const;
export const [defaultBackgroundState] = backgroundStates;
export type BackgroundState = (typeof backgroundStates)[number];

export const disabledStates = [
    ['', false],
    ['Disabled', true]
] as const;
export type DisabledState = (typeof disabledStates)[number];
export const disabledStateIsEnabled = disabledStates[0];

export const errorStates = [
    ['', false, ''],
    ['Error Message', true, 'This is not valid.'],
    ['Error No Message', true, '']
] as const;
export type ErrorState = (typeof errorStates)[number];
export const errorStatesNoError = errorStates[0];
export const errorStatesErrorWithMessage = errorStates[1];
export const errorStatesErrorNoMessage = errorStates[2];

export const readOnlyStates = [
    ['', false],
    ['Read-Only', true]
] as const;
export type ReadOnlyState = (typeof readOnlyStates)[number];

export const iconVisibleStates = [false, true] as const;
export type IconVisibleState = (typeof iconVisibleStates)[number];

export const placeholderStates = [
    ['With Placeholder', 'Custom placeholder'],
    ['', undefined]
] as const;
export type PlaceholderState = (typeof placeholderStates)[number];

export const requiredVisibleStates = [
    ['', false],
    ['Required', true]
] as const;
export type RequiredVisibleState = (typeof requiredVisibleStates)[number];

export const fullBleedStates = [
    ['', false],
    ['Full Bleed', true]
] as const;
export type FullBleedState = (typeof fullBleedStates)[number];

export const manipulationStates = [
    ['', false, false, false],
    ['Appearance-Read-Only', false, false, true],
    ['Disabled', false, true, false],
    ['Disabled Appearance-Read-Only', false, true, true],
    ['Read-Only', true, false, false],
    ['Read-Only Appearance-Read-Only', true, false, true],
    ['Read-Only Disabled', true, true, false],
    ['Read-Only Disabled Appearance-Read-Only', true, true, true]
] as const;
export type ManipulationState = (typeof manipulationStates)[number];

export const manipulationState = {
    none: manipulationStates[0],
    appearanceReadOnly: manipulationStates[1],
    disabled: manipulationStates[2],
    disabledAppearanceReadOnly: manipulationStates[3],
    readOnly: manipulationStates[4],
    readOnlyAppearanceReadOnly: manipulationStates[5],
    readOnlyDisabled: manipulationStates[6],
    readOnlyDisabledAppearanceReadOnly: manipulationStates[7]
} as const;

export const manipulationDisabledAbsentStates = manipulationStates.filter(
    (state: (typeof manipulationStates)[number]) => state[2] === false
);
export type ManipulationDisabledAbsentState = (typeof manipulationDisabledAbsentStates)[number];

export const manipulationReadOnlyAbsentStates = manipulationStates.filter(
    (state: (typeof manipulationStates)[number]) => state[1] === false
);
export type ManipulationReadOnlyAbsentState = (typeof manipulationReadOnlyAbsentStates)[number];
