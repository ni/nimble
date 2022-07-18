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

    public showModal(): void {
        this.dialogElement?.showModal();
    }

    public close(): void {
        this.dialogElement?.close();
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