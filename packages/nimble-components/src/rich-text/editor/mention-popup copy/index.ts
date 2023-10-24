import {
    DesignSystem,
    ListboxElement,
    listboxTemplate as template
} from '@microsoft/fast-foundation';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-list-box': ListboxElement;
    }
}

const nimbleListBox = ListboxElement.compose({
    baseName: 'list-box',
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleListBox());
export const listBoxTag = DesignSystem.tagFor(ListboxElement);
