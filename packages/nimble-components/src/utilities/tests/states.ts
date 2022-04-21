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

export type DisabledState = [string, boolean];
export const disabledStates: DisabledState[] = [
    ['', false],
    ['Disabled', true]
];

export type InvalidState = [string, string];
export const invalidStates: InvalidState[] = [
    ['', ''],
    ['Invalid', 'invalid']
];

export type ReadOnlyState = [string, boolean];
export const readOnlyStates: ReadOnlyState[] = [
    ['', false],
    ['Read-Only', true]
];

export type IconVisibleState = boolean;
export const iconVisibleStates: IconVisibleState[] = [false, true];

export type ExpandedState = [string, boolean];
export const expandedStates: ExpandedState[] = [
    ['Collapsed', false],
    ['Expanded', true]
];

export type SelectedState = [string, boolean];
export const selectedStates: SelectedState[] = [
    ['Unselected', false],
    ['Selected', true]
];
