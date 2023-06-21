import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { IconSeverity } from '../../icon-base/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-icon': MappingIcon;
    }
}

/**
 * Maps values to an icon.
 */
export class MappingIcon extends Mapping {
    @attr()
    public icon?: string;

    @attr()
    public severity: IconSeverity;

    @attr()
    public label?: string;
}

const iconMapping = MappingIcon.compose({
    baseName: 'mapping-icon',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconMapping());
export const mappingIconTag = DesignSystem.tagFor(MappingIcon);
