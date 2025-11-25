import { attr, nullableNumberConverter, observable } from '@ni/fast-element';
import { keyEnter, keyEscape, keySpace } from '@ni/fast-web-utilities';
import {
    applyMixins,
    DesignSystem,
    FoundationElement,
    StartEnd,
    type EndOptions,
    type FoundationElementDefinition,
    type StartOptions
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChipAppearance, ChipSelectionMode } from './types';
import { slotTextContent } from '../utilities/models/slot-text-content';
import { itemRemoveLabel } from '../label-provider/core/label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-chip': Chip;
    }
}
export {
    ChipSelectionMode,
    type ChipSelectionMode as ChipSelectionModeType
} from './types';

export type ChipOptions = FoundationElementDefinition &
    StartOptions &
    EndOptions;

/**
 * A Nimble chip component
 */
export class Chip extends FoundationElement {
    @attr({ mode: 'boolean' })
    public removable = false;

    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr({ attribute: 'selection-mode' })
    public selectionMode: ChipSelectionMode;

    @attr({ mode: 'boolean' })
    public selected = false;

    @attr()
    public appearance: ChipAppearance = ChipAppearance.outline;

    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;

    /**
     * Indicates whether the remove button is currently in a mousedown state.
     * Used to prevent the chip's active styling from showing when the remove button is being clicked.
     *
     * @internal
     * @remarks
     * This attribute is automatically managed by handleRemoveMousedown and should not be set directly.
     */
    @attr({ attribute: 'remove-button-active', mode: 'boolean' })
    public removeButtonActive = false;

    /** @internal */
    public readonly content?: HTMLElement[];

    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public get elementTextContent(): string {
        return slotTextContent(this.contentSlot);
    }

    /** @internal */
    public get removeButtonContent(): string {
        return itemRemoveLabel.getValueFor(this);
    }

    /** @internal */
    public contentSlot!: HTMLSlotElement;

    private managingTabIndex = false;
    private suppressTabIndexChanged = false;
    private mouseUpHandler: EventListener | null = null;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateManagedTabIndex();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.mouseUpHandler) {
            document.removeEventListener('mouseup', this.mouseUpHandler);
            this.mouseUpHandler = null;
        }
    }

    /** @internal */
    public clickHandler(e: MouseEvent): boolean {
        if (this.disabled) {
            return false;
        }

        if (this.selectionMode === ChipSelectionMode.single) {
            e.stopPropagation();
            this.selected = !this.selected;
            this.$emit('selected-change');
            return false;
        }
        return true;
    }

    /** @internal */
    public keyupHandler(e: KeyboardEvent): boolean {
        if (this.disabled) {
            return false;
        }
        switch (e.key) {
            case keySpace:
                if (this.selectionMode === ChipSelectionMode.single) {
                    e.stopPropagation();
                    this.selected = !this.selected;
                    this.$emit('selected-change');
                }
                return true;
            default:
                return true;
        }
    }

    /** @internal */
    public keydownHandler(e: KeyboardEvent): boolean {
        if (this.disabled) {
            return false;
        }
        switch (e.key) {
            case keySpace:
                if (this.selectionMode === ChipSelectionMode.single) {
                    return false;
                }
                return true;
            case keyEnter:
                if (this.selectionMode === ChipSelectionMode.single) {
                    e.stopPropagation();
                    this.selected = !this.selected;
                    this.$emit('selected-change');
                    return false;
                }
                return true;
            case keyEscape:
                if (
                    this.removable
                    && this.selectionMode === ChipSelectionMode.single
                ) {
                    e.stopPropagation();
                    this.$emit('remove');
                    return false;
                }
                return true;
            default:
                return true;
        }
    }

    /** @internal */
    public handleRemoveClick(event: MouseEvent): void {
        event.stopPropagation();
        if (this.removable) {
            this.$emit('remove');
        }
    }

    /**
     * Handles mousedown events on the remove button.
     * Sets removeButtonActive to true and registers a document-level mouseup handler to clear it.
     *
     * @internal
     * @remarks
     * The mouseup listener is added to document to ensure it fires even if the mouse moves
     * outside the chip before being released. The listener is cleaned up in disconnectedCallback
     * to prevent memory leaks.
     */
    public handleRemoveMousedown(event: MouseEvent): void {
        event.stopPropagation();
        this.removeButtonActive = true;

        // Clean up any existing listener first
        if (this.mouseUpHandler) {
            document.removeEventListener('mouseup', this.mouseUpHandler);
        }

        this.mouseUpHandler = (): void => {
            this.removeButtonActive = false;
            if (this.mouseUpHandler) {
                document.removeEventListener('mouseup', this.mouseUpHandler);
                this.mouseUpHandler = null;
            }
        };
        document.addEventListener('mouseup', this.mouseUpHandler);
    }

    /** @internal */
    public handleRemoveKeyup(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    protected selectionModeChanged(
        _oldValue: ChipSelectionMode | undefined,
        _newValue: ChipSelectionMode | undefined
    ): void {
        this.updateManagedTabIndex();
    }

    protected disabledChanged(_oldValue: boolean, _newValue: boolean): void {
        this.updateManagedTabIndex();
    }

    protected tabIndexChanged(): void {
        if (this.suppressTabIndexChanged) {
            this.suppressTabIndexChanged = false;
            return;
        }

        this.managingTabIndex = false;
    }

    private updateManagedTabIndex(): void {
        if (!this.$fastController?.isConnected) {
            return;
        }

        const shouldManage = this.selectionMode === ChipSelectionMode.single && !this.disabled;

        if (shouldManage) {
            if (!this.hasAttribute('tabindex')) {
                this.setManagedTabIndex(0);
            }
        } else {
            this.removeManagedTabIndex();
        }
    }

    private setManagedTabIndex(value: number): void {
        this.managingTabIndex = true;
        this.suppressTabIndexChanged = true;
        this.tabIndex = value;
    }

    private removeManagedTabIndex(): void {
        if (!this.managingTabIndex) {
            return;
        }

        this.managingTabIndex = false;
        this.suppressTabIndexChanged = true;
        this.removeAttribute('tabindex');
    }
}
applyMixins(Chip, StartEnd);

const nimbleChip = Chip.compose<ChipOptions>({
    baseName: 'chip',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleChip());
export const chipTag = 'nimble-chip';
