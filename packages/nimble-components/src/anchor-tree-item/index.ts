import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    AnchorOptions,
    StartEnd,
    applyMixins,
    isTreeItemElement,
    TreeItem as FoundationTreeItem
} from '@microsoft/fast-foundation';
import { keyArrowLeft, keyEnter } from '@microsoft/fast-web-utilities';
import { AnchorBase } from '../anchor-base';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor-tree-item': AnchorTreeItem;
    }
}

/**
 * A nimble-styled anchor tree item
 */
export class AnchorTreeItem extends AnchorBase {
    /**
     * When true, the control will appear selected by user interaction.
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    @attr({ mode: 'boolean' })
    public selected?: boolean;

    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled | disabled HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: 'boolean' })
    public disabled?: boolean;

    /**
     * Whether the item is focusable
     *
     * @internal
     */
    public focusable?: boolean;

    /**
     * Indicates if the tree item is nested
     *
     * @internal
     */
    public nested?: boolean;

    /**
     *  Readonly property identifying the element as a tree item
     *
     * @internal
     */
    public readonly isTreeItem: boolean = true;

    /**
     * Whether the tree is nested
     *
     * @public
     */
    public isNestedItem(): boolean {
        return isTreeItemElement(this.parentElement as Element);
    }

    /**
     * Handle focus events
     *
     * @internal
     */
    public handleFocus(_e: FocusEvent): void {
        this.setAttribute('tabindex', '0');
    }

    /**
     * Handle blur events
     *
     * @internal
     */
    public handleBlur(_e: FocusEvent): void {
        this.setAttribute('tabindex', '-1');
    }

    /**
     * Gets number of children
     *
     * @internal
     */
    public childItemLength(): number {
        return 0;
    }

    /**
     * @internal
     */
    public keydownHandler(e: KeyboardEvent): boolean {
        if (e.defaultPrevented) {
            return false;
        }
        const item = e.target as HTMLElement;
        switch (e.key) {
            case keyEnter:
                // Do not let the event bubble up to the FAST tree, or it will
                // prevent the default action.
                e.stopPropagation();
                break;
            case keyArrowLeft:
                // For FAST tree items, the FAST tree view handles this navigation,
                // but since our anchor tree item is not "instanceof FASTTreeItem",
                // the FAST tree view won't do this for us. We do it ourselves.
                if (item === this.control && this.parentElement && this.isNestedItem()) {
                    FoundationTreeItem.focusItem(this.parentElement);
                }
                break;
            default:
        }
        return true;
    }

    /**
     * Apparently, pressing the Enter key on an anchor generates a click event, too.
     * This bubbles up to the Nimble tree-view's click handler, causing the tree item
     * to be selected. We don't want that for anchor tree items. We'll stop propagation
     * of the event to prevent that.
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean {
        if (e.defaultPrevented) {
            return false;
        }
        e.stopPropagation();
        return true;
    }

    protected selectedChanged(_prev: boolean | undefined, _next: boolean): void {
        if (this.$fastController.isConnected) {
            this.$emit('selected-change', this);
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AnchorTreeItem extends StartEnd {}
applyMixins(AnchorTreeItem, StartEnd);

const nimbleAnchorTreeItem = AnchorTreeItem.compose<AnchorOptions>({
    baseName: 'anchor-tree-item',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchorTreeItem());
export const anchorTreeItemTag = DesignSystem.tagFor(AnchorTreeItem);