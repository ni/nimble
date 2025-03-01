import { Theme } from '../../../nimble-components/src/theme-provider/types';

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
