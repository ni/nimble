import { attr, css, html, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { MappingConfig } from '../../table-column/enum-base';
import type { IconSeverity } from '../../icon-base/types';

export interface MappingConfigIconOrSpinner extends MappingConfig {
    label: string;
    viewTemplate: ViewTemplate;
}

export interface MappingConfigIcon extends MappingConfigIconOrSpinner {
    icon: string;
    severity: IconSeverity;
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
    public icon?: string;

    @attr()
    public severity: IconSeverity;

    @attr()
    public label?: string;

    public override getConvertedKeyMapping(
        keyType: 'string' | 'number' | 'boolean'
    ): MappingConfig {
        return {
            key: this.typeConvertKey(this.key, keyType),
            defaultMapping: this.defaultMapping,
            icon: this.icon,
            severity: this.severity,
            label: this.label,
            viewTemplate: html`
                <${this.icon!}
                    title="${this.label ?? ''}"
                    aria-label="${this.label ?? ''}"
                    severity="${this.severity ?? ''}"
                    class="no-shrink">
                </${this.icon!}>`
        } as MappingConfigIcon;
    }
}

const iconMapping = MappingIcon.compose({
    baseName: 'mapping-icon',
    template,
    styles: css``
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconMapping());
export const mappingIconTag = DesignSystem.tagFor(MappingIcon);
