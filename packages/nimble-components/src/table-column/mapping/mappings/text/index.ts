import {
    attr,
    html,
    observable,
    ref,
    ViewTemplate
} from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '..';
import { styles } from '../styles';
import { template } from '../template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-text': MappingText;
    }
}

/**
 * Maps values to text
 */
export class MappingText extends Mapping {
    @attr()
    public label: string | null = null;

    /** @internal */
    public span: HTMLSpanElement | null = null;

    /** @internal */
    @observable
    public isValidContentAndHasOverflow = false;

    /** @internal */
    // prettier-ignore
    public readonly commonTemplate = html<MappingText>`
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

    /** @internal */
    public cellViewTemplate: ViewTemplate = this.commonTemplate;

    /** @internal */
    public groupHeaderViewTemplate: ViewTemplate = this.commonTemplate;
}

const textMapping = MappingText.compose({
    baseName: 'mapping-text',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textMapping());
export const mappingTextTag = DesignSystem.tagFor(MappingText);
