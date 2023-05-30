import {
    attr,
    html,
    observable,
    ref,
    ViewTemplate
} from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '..';
import { spinnerTag } from '../../../../spinner';
import { styles } from '../styles';
import { template } from '../template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-spinner': MappingSpinner;
    }
}

/**
 * Maps values to a spinner
 */
export class MappingSpinner extends Mapping {
    @attr()
    public label: string | null = null;

    /** @internal */
    public span: HTMLSpanElement | null = null;

    /** @internal */
    @observable
    public isValidContentAndHasOverflow = false;

    /** @internal */
    // prettier-ignore
    public cellViewTemplate: ViewTemplate = html<MappingSpinner>`
        <${spinnerTag}
            title="${x => x.label}"
            aria-label="${x => x.label}">
        </${spinnerTag}>`;

    /** @internal */
    // prettier-ignore
    public groupHeaderViewTemplate: ViewTemplate = html<MappingSpinner>`
        <${spinnerTag}
            title="${x => x.label}"
            aria-label="${x => x.label}">
        </${spinnerTag}>
        <span
            ${ref('span')}
            @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.label && x.span!.offsetWidth < x.span!.scrollWidth;
    }}"
            @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
            title=${x => (x.isValidContentAndHasOverflow ? x.label : null)}
        >
            ${x => x.label}
        </span>`;
}

const spinnerMapping = MappingSpinner.compose({
    baseName: 'mapping-spinner',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(spinnerMapping());
export const mappingSpinnerTag = DesignSystem.tagFor(MappingSpinner);
