/**
 * The possible states of a breakpoint indicator.
 */
export const BreakpointState = {
    off: 'off',
    enabled: 'enabled',
    disabled: 'disabled',
    hit: 'hit'
} as const;
export type BreakpointState =
    (typeof BreakpointState)[keyof typeof BreakpointState];

/**
 * The event detail for the `breakpoint-column-toggle` event.
 */
export interface BreakpointToggleEventDetail {
    recordId: string;
    newState: BreakpointState;
    oldState: BreakpointState;
}
