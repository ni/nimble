import { attr, DOM, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import {
    BulkEditFieldStatus,
    type BulkEditFieldStatus as BulkEditFieldStatusType
} from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-bulk-edit-field': FvBulkEditField;
    }
}

/**
 * A labeled field shell for single- and multi-record editing.
 */
export class FvBulkEditField extends FoundationElement {
    @attr
    public label = '';

    @attr
    public status: BulkEditFieldStatusType = BulkEditFieldStatus.unchanged;

    @attr({ attribute: 'reset-disabled', mode: 'boolean' })
    public resetDisabled = false;

    @attr({ attribute: 'clear-disabled', mode: 'boolean' })
    public clearDisabled = false;

    /** @internal */
    @observable
    public controls: HTMLElement[] = [];

    // Some controls reapply their own label bindings when reconnected.
    private readonly labelObserver = new MutationObserver(() => this.updateControlLabels());

    public override connectedCallback(): void {
        super.connectedCallback();
        this.observeControlLabels();
        this.updateControlLabels();
    }

    public override disconnectedCallback(): void {
        this.labelObserver.disconnect();
        super.disconnectedCallback();
    }

    /** Accessible name applied to directly slotted field controls. */
    public get controlLabel(): string {
        const description = this.status === BulkEditFieldStatus.mixed
            ? 'Mixed values. Enter a value to overwrite all selected rows.'
            : this.statusText;
        return description ? `${this.label}. ${description}` : this.label;
    }

    /** @internal */
    public controlsChanged(): void {
        this.observeControlLabels();
        this.updateControlLabels();
    }

    /** @internal */
    public labelChanged(): void {
        this.updateControlLabels();
    }

    /** @internal */
    public statusChanged(): void {
        this.updateControlLabels();
    }

    /** @internal */
    public get statusText(): string {
        switch (this.status) {
            case BulkEditFieldStatus.mixed:
                return 'Mixed values';
            case BulkEditFieldStatus.changed:
                return 'Changed';
            case BulkEditFieldStatus.willClear:
                return 'Will clear';
            default:
                return '';
        }
    }

    /** @internal */
    public reset(): boolean {
        if (!this.resetDisabled) {
            this.$emit('reset');
        }
        return true;
    }

    /** @internal */
    public clear(): boolean {
        if (!this.clearDisabled) {
            this.$emit('clear');
        }
        return true;
    }

    private updateControlLabels(): void {
        DOM.queueUpdate(() => {
            this.controls?.forEach(control => {
                if (control.getAttribute('aria-label') !== this.controlLabel) {
                    control.setAttribute('aria-label', this.controlLabel);
                }
            });
        });
    }

    private observeControlLabels(): void {
        this.labelObserver?.disconnect();
        if (this.isConnected) {
            this.controls?.forEach(control => this.labelObserver.observe(control, {
                attributes: true,
                attributeFilter: ['aria-label']
            }));
        }
    }
}

const okFvBulkEditField = FvBulkEditField.compose({
    baseName: 'fv-bulk-edit-field',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvBulkEditField());
export const fvBulkEditFieldTag = 'ok-fv-bulk-edit-field';
export { BulkEditFieldStatus };
export type { BulkEditFieldStatusType };
