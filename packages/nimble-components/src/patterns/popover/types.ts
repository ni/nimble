// TypeScript 5.9's DOM declarations do not include popover source options.
export interface PopoverElement extends HTMLDivElement {
    showPopover(options?: { source?: HTMLElement }): void;
    togglePopover(options?: boolean | { force?: boolean, source?: HTMLElement }): boolean;
}