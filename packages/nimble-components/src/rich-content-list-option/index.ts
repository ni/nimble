import {
    DesignSystem,
    ListboxOption as FoundationListboxOption,
    listboxOptionTemplate as template
} from '@microsoft/fast-foundation';
import { ListOption } from '../list-option';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-content-list-option': RichContentListOption;
    }
}

/**
 * A nimble-styled HTML listbox option
 */
export class RichContentListOption extends ListOption {
    private _textNode?: Element | null;

    public constructor(
        _?: string,
        value?: string,
        defaultSelected?: boolean,
        selected?: boolean
    ) {
        super(undefined, value, defaultSelected, selected);
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this._textNode = this.findTextNode();
    }

    public override get text(): string {
        if (!this._textNode) {
            return super.text;
        }

        return this._textNode.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    }

    private findTextNode(): Element | null {
        return this.querySelector('[part="text"]');
    }
}

const nimbleRichContentListOption = RichContentListOption.compose({
    baseName: 'rich-content-list-option',
    baseClass: FoundationListboxOption,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleRichContentListOption());
export const richContentListOptionTag = DesignSystem.tagFor(RichContentListOption);
