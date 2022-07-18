import { html, observable, ref } from '@microsoft/fast-element';
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
    @observable
    public readonly dialogElement: HTMLDialogElement | undefined;

    private resolveShowModal: (() => void) | null = null;

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
        <dialog ${ref('dialogElement')} onclose="onClose()">
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