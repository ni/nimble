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

        this.dialogElement!.addEventListener('cancel', event => {
            if (this.preventDismiss) {
                event.preventDefault();
            }
        });

        this.dialogElement!.addEventListener('close', _event => {
            this.onClose();
        });
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