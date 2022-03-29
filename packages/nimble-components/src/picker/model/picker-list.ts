import {
    DesignSystem,
    PickerList as FoundationPickerList,
    pickerListTemplate as template
} from '@microsoft/fast-foundation';
import type { Picker } from '..';
import { styles } from './picker-list.styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-picker-list': PickerList;
    }
}

/**
 * A multi-select Picker
 */
export class PickerList extends FoundationPickerList {
    private picker: Picker | null = null;
    private mutationObserver: MutationObserver | null = null;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.picker = this.getParentPicker();
        if (this.picker) {
            this.mutationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes') {
                        this.handleReadOnlyChange(
                            this.picker?.readOnly || false
                        );
                    }
                });
            });
            this.mutationObserver.observe(this.picker, { attributes: true });
            this.handleReadOnlyChange(this.picker.readOnly);
        }
    }

    public override disconnectedCallback(): void {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
    }

    private getParentPicker(): Picker | null {
        const parentNode: Element | null = this.parentElement!.closest('nimble-picker');
        return parentNode as Picker;
    }

    private handleReadOnlyChange(readonly: boolean): void {
        const input = this.getElementsByTagName('input')[0];
        if (input) {
            if (readonly) {
                input.style.display = 'none';
            } else {
                input.style.display = 'flex';
            }
        }
        const selections = this.getElementsByTagName('nimble-picker-list-item');
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < selections.length; i++) {
            if (readonly) {
                selections[i]!.tabIndex = -1;
            } else {
                selections[i]!.tabIndex = 0;
            }
        }
    }
}

const nimblePickerList = PickerList.compose({
    baseName: 'picker-list',
    baseClass: FoundationPickerList,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimblePickerList());
