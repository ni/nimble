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
        'nimble-mapping-icon': MappingIcon;
    }
}

/**
 * Maps values to an icon
 */
export class MappingIcon extends Mapping {
    @attr()
    public icon: string | null = null;

    @attr()
    public severity: string | null = null;

    @attr()
    public label: string | null = null;

    /** @internal */
    public span: HTMLSpanElement | null = null;

    /** @internal */
    @observable
    public isValidContentAndHasOverflow = false;

    /** @internal */
    @observable
    public cellViewTemplate: ViewTemplate = html``;

    /** @internal */
    @observable
    public groupHeaderViewTemplate: ViewTemplate = html``;

    private iconChanged(): void {
        this.updateCellViewTemplate();
    }

    private updateCellViewTemplate(): void {
        if (!this.icon) {
            return;
        }

        // prettier-ignore
        this.cellViewTemplate = html<MappingIcon>`
            <${this.icon}
                title="${x => x.label}"
                aria-label="${x => x.label}"
                severity="${x => x.severity}">
            </${this.icon}>`;

        // prettier-ignore
        this.groupHeaderViewTemplate = html<MappingIcon>`
            <${this.icon}
                title="${x => x.label}"
                aria-label="${x => x.label}"
                severity="${x => x.severity}">
            </${this.icon}>
            <span
                ${ref('span')}
                @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.label && x.span!.offsetWidth < x.span!.scrollWidth;
    }}"
                @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
                title=${x => (x.isValidContentAndHasOverflow ? x.label : null)}>
                ${x => x.label}
            </span>`;
    }
}

const iconMapping = MappingIcon.compose({
    baseName: 'mapping-icon',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconMapping());
export const mappingIconTag = DesignSystem.tagFor(MappingIcon);
