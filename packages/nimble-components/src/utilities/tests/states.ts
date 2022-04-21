import { Theme } from '../../theme-provider/types';

export const backgroundStates = [
    {
        name: `"${Theme.Light}" theme on white`,
        value: '#F4F4F4',
        theme: Theme.Light
    },
    {
        name: `"${Theme.Color}" theme on dark green`,
        value: '#044123',
        theme: Theme.Color
    },
    {
        name: `"${Theme.Dark}" theme on black`,
        value: '#252526',
        theme: Theme.Dark
    }
] as const;
export const [defaultBackgroundState] = backgroundStates;
export type BackgroundState = typeof backgroundStates[number];

export const disabledStates = [
    ['', false],
    ['Disabled', true]
] as const;
export type DisabledState = typeof disabledStates[number];

export const invalidStates = [
    ['', ''],
    ['Invalid', 'invalid']
] as const;
export type InvalidState = typeof invalidStates[number];

export const readOnlyStates = [
    ['', false],
    ['Read-Only', true]
] as const;
export type ReadOnlyState = typeof readOnlyStates[number];

export const iconVisibleStates = [false, true] as const;
export type IconVisibleState = typeof iconVisibleStates[number];

export const expandedStates = [
    ['Collapsed', false],
    ['Expanded', true]
] as const;
export type ExpandedState = typeof expandedStates[number];

export const selectedStates = [
    ['Unselected', false],
    ['Selected', true]
] as const;
export type SelectedState = typeof selectedStates[number];
