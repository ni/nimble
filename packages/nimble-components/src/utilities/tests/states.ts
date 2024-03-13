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
export type BackgroundState = (typeof backgroundStates)[number];

export const disabledStates = [
    ['', false],
    ['Disabled', true]
] as const;
export type DisabledState = (typeof disabledStates)[number];

export const errorStates = [
    ['', false, ''],
    ['Error Message', true, 'This is not valid.'],
    ['Error No Message', true, '']
] as const;
export type ErrorState = (typeof errorStates)[number];

export const readOnlyStates = [
    ['', false],
    ['Read-Only', true]
] as const;
export type ReadOnlyState = (typeof readOnlyStates)[number];

export const iconVisibleStates = [false, true] as const;
export type IconVisibleState = (typeof iconVisibleStates)[number];

export const nonInteractionStates = [['', '']] as const;
export const interactionStates = [
    // Using pseudo-*-all will turn on the effect for any nested custom elements (e.g. inc/dec buttons in number field).
    // It works around the limitation that selectors for shadow elements can only see the immediate host's classes.
    ['Hovered', 'hover pseudo-hover-all'],
    ['Hovered Active', 'hover active pseudo-hover-all pseudo-active-all'],
    ['Active', 'active pseudo-active-all'],
    [
        'Focused',
        'focus-visible focus-within pseudo-focus-visible-all pseudo-focus-within-all'
    ]
] as const;
export type InteractionState =
    | (typeof interactionStates)[number]
    | (typeof nonInteractionStates)[number];

// Only interaction relevant to disabled controls is hover
export function disabledInteractionsFilter(
    interactionState: InteractionState,
    disabledState: DisabledState
): boolean {
    return disabledState[0] !== 'Disabled' || interactionState[0] === 'Hovered';
}
