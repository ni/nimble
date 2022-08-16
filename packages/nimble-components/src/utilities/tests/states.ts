import { Theme } from '../../theme-provider/types';

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

export const placeholderStates = [
    ['Placeholder', 'Placeholder...'],
    ['No Placeholder', '']
] as const;
export type PlaceholderState = typeof placeholderStates[number];
