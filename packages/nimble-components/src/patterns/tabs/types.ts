export interface TabsOwner extends HTMLElement {
    tabs: HTMLElement[];
    tablist: HTMLElement;
    leftScrollButton?: HTMLElement;
    showScrollButtons: boolean;
    tabSlotName: string;
    onScrollLeftClick(): void;
    onScrollRightClick(): void;
}
