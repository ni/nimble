import { type ViewTemplate, html } from '@microsoft/fast-element';
import { MappingConfig } from './mapping-config';
import type { IconView } from './mapping-icon-config';
import { spinnerTag } from '../../../spinner';

export interface SpinnerView {
    text?: string;
}

const createSpinnerTemplate = (textHidden: boolean): ViewTemplate<IconView> => {
    return html`
        <${spinnerTag}
            title="${x => (textHidden ? x.text : '')}"
            aria-label="${x => x.text}"
            aria-hidden="${_ => (textHidden ? 'false' : 'true')}"
        >
        </${spinnerTag}>
    `;
};

/**
 * Mapping configuration corresponding to a spinner mapping
 */
export class MappingSpinnerConfig extends MappingConfig {
    public readonly spinnerCellTemplate: ViewTemplate<SpinnerView>;
    public readonly spinnerGroupRowTemplate: ViewTemplate<SpinnerView>;

    public constructor(
        text: string | undefined,
        public readonly textHidden: boolean
    ) {
        super(text);
        this.spinnerCellTemplate = createSpinnerTemplate(this.textHidden);
        this.spinnerGroupRowTemplate = this.textHidden
            ? createSpinnerTemplate(false)
            : this.spinnerCellTemplate;
    }
}
