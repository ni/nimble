import { attr, html, observable, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { ConvertedKeyMapping } from '../../table-column/enum-base';

export interface ConvertedKeyMappingForIconColumn extends ConvertedKeyMapping {
    label: string;
    viewTemplate: ViewTemplate;
}

export interface ConvertedKeyMappingIcon
    extends ConvertedKeyMappingForIconColumn {
    icon: string;
    severity: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-icon': MappingIcon;
    }
}

/**
 * An element to be given as content to a nimble-table-column-icon.
 * Maps data values to an icon.
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

    public override getConvertedKeyMapping(
        keyType: 'string' | 'number' | 'boolean'
    ): ConvertedKeyMapping {
        return {
            key: this.typeConvertKey(this.key, keyType),
            defaultMapping: this.defaultMapping,
            icon: this.icon,
            severity: this.severity,
            label: this.label,
            viewTemplate: html<ConvertedKeyMappingIcon>`
                <${this.icon!}
                    title="${x => x.label}"
                    aria-label="${x => x.label}"
                    severity="${x => x.severity}">
                </${this.icon!}>`
        } as ConvertedKeyMappingIcon;
    }
}

const iconMapping = MappingIcon.compose({
    baseName: 'mapping-icon',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconMapping());
export const mappingIconTag = DesignSystem.tagFor(MappingIcon);
