/** TODO */
export class TrappedFocus {
    /**
     * @returns Whether focus was trapped.
     * @internal
     */
    protected _trappedFocus(
        event: KeyboardEvent,
        getFocusableEls: () => NodeListOf<HTMLElement>
    ): boolean {
        if (event.key === 'Tab') {
            const focusableEls = getFocusableEls();
            const firstFocusableEl = focusableEls[0];
            const lastFocusableEl = focusableEls[focusableEls.length - 1];

            if (event.shiftKey) {
                // Shift + tab
                if (this.shadowRoot!.activeElement === firstFocusableEl) {
                    lastFocusableEl?.focus();
                    return true;
                }
            } else if (this.shadowRoot!.activeElement === lastFocusableEl) {
                // Tab
                firstFocusableEl?.focus();
                return true;
            }
        }

        return false;
    }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TrappedFocus extends HTMLElement {}
