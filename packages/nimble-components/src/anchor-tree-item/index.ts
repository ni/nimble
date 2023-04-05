import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    AnchorOptions,
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
    public selected = false;

    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled | disabled HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: 'boolean' })
    public disabled = false;

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
     * @internal
     */
    public keydownHandler(e: KeyboardEvent): boolean {
        if (e.defaultPrevented) {
            return false;
        }
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
                if (this.parentElement && this.isNestedItem()) {
                    FoundationTreeItem.focusItem(this.parentElement);
                }
                break;
            default:
        }
        return true;
    }

    /**
     * Activating the anchor by pressing the Enter key results in a click event.
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

    protected selectedChanged(
        _prev: boolean | undefined,
        _next: boolean
    ): void {
        if (this.$fastController.isConnected) {
            this.$emit('selected-change', this);
        }
    }
}

// FoundationAnchor already applies the StartEnd mixin, so we don't need to do it here.

const nimbleAnchorTreeItem = AnchorTreeItem.compose<AnchorOptions>({
    baseName: 'anchor-tree-item',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAnchorTreeItem());
export const anchorTreeItemTag = DesignSystem.tagFor(AnchorTreeItem);
