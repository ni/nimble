/**
 * The possible states of a breakpoint indicator.
 */
export const BreakpointState = {
    off: 'off',
    enabled: 'enabled',
    disabled: 'disabled',
    hit: 'hit',
    conditional: 'conditional',
    hitDisabled: 'hit-disabled'
} as const;
export type BreakpointState = (typeof BreakpointState)[keyof typeof BreakpointState];

/**
 * The event detail for the `breakpoint-column-toggle` event.
 */
export interface BreakpointToggleEventDetail {
    recordId: string;
    newState: BreakpointState;
    oldState: BreakpointState;
}

/**
 * The event detail for the `breakpoint-column-state-change-requested` event.
 */
export interface BreakpointStateChangeRequestedEventDetail {
    recordId: string;
    requestedState: BreakpointState;
    currentState: BreakpointState;
}

/** @internal */
export const breakpointMenuItemStateAttributeName = 'data-breakpoint-state';

/** @internal */
export const breakpointCellViewMenuSlotName = 'menu';
