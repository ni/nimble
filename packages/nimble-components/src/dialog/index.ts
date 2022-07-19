import { attr, html, observable, ref } from '@microsoft/fast-element';
import {
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-dialog': Dialog;
    }
}

/**
 * A nimble-styled dialog.
 */
export class Dialog extends FoundationElement {
    @attr({ attribute: 'prevent-dismiss', mode: 'boolean' })
    public preventDismiss = false;

    @observable
    public readonly dialogElement: HTMLDialogElement | undefined;

    private resolveShowModal: (() => void) | null = null;

    public override connectedCallback(): void {
        super.connectedCallback();

        this.dialogElement!.addEventListener('cancel', this.cancelHandler);
        this.dialogElement!.addEventListener('close', this.closeHandler);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();

        this.dialogElement!.removeEventListener('cancel', this.cancelHandler);
        this.dialogElement!.removeEventListener('close', this.closeHandler);
    }

    public async showModal(): Promise<void> {
        this.dialogElement?.showModal();
        return new Promise((resolve, _reject) => {
            this.resolveShowModal = resolve;
        });
    }

    public close(): void {
        this.dialogElement?.close();
    }

    public onClose(): void {
        if (this.resolveShowModal) {
            this.resolveShowModal();
            this.resolveShowModal = null;
        }
    }

    private readonly cancelHandler = (event: Event): void => {
        if (this.preventDismiss) {
            event.preventDefault();
        } else {
            const shouldDismiss = this.$emit(
                'cancel',
                {},
                { bubbles: event.bubbles, cancelable: event.cancelable, composed: event.composed }
            );
            if (!shouldDismiss) {
                event.preventDefault();
            }
        }
    };

    private readonly closeHandler = (event: Event): void => {
        this.onClose();
        this.$emit(
            'close',
            {},
            { bubbles: event.bubbles, cancelable: event.cancelable, composed: event.composed }
        );
    };
}

const template = html<Dialog>`
    <template>
        <dialog ${ref('dialogElement')}>
            <slot></slot>
        </dialog>
    </template>
`;

const nimbleDialog = Dialog.compose({
    baseName: 'dialog',
    template,
    styles,
    baseClass: Dialog
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleDialog());