import { type ViewTemplate, html } from '@microsoft/fast-element';
import { MappingConfig } from './mapping-config';
import { spinnerTag } from '../../../spinner';

export interface SpinnerView {
    text?: string;
    textHidden?: boolean;
}

const spinnerTemplate: ViewTemplate<SpinnerView> = html`
    <${spinnerTag}
        title="${x => (x.textHidden ? x.text : '')}"
        aria-label="${x => x.text}"
        aria-hidden="${x => (x.textHidden ? 'false' : 'true')}"
    >
    </${spinnerTag}>
`;

/**
 * Mapping configuration corresponding to a spinner mapping
 */
export class MappingSpinnerConfig extends MappingConfig {
    public readonly spinnerTemplate: ViewTemplate<SpinnerView>;

    public constructor(
        text: string | undefined,
        public readonly textHidden: boolean
    ) {
        super(text);
        this.spinnerTemplate = spinnerTemplate;
    }
}
