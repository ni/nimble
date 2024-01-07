import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { template } from '../base/template';
import type { IconSeverity } from '../../icon-base/types';
import { Icon } from '../../icon-base';
import type { MappingKey } from '../base/types';

export const mappingIconTag = 'nimble-mapping-icon';
declare global {
    interface HTMLElementTagNameMap {
        [mappingIconTag]: MappingIcon;
    }
}

function isIconClass(elementClass: CustomElementConstructor): boolean {
    return elementClass.prototype instanceof Icon;
}

/**
 * Maps a data value to an icon.
 * One or more may be added as children of a nimble-table-column-icon element to define
 * how specific data values should be displayed as icons in that column's cells.
 */
export class MappingIcon extends Mapping<MappingKey> {
    @attr()
    public icon?: string;

    @attr()
    public severity: IconSeverity;

    @attr()
    public text?: string;

    /**
     * @internal
     * Calculated asynchronously by the icon mapping based on the configured icon value.
     * When assigned, it corresponds to an element name that is resolved to type of Nimble Icon.
     */
    @observable
    public resolvedIcon?: string;

    // Allow icons to be defined asynchronously from when the property is configured
    private async resolveIconAsync(icon: string): Promise<void> {
        try {
            // Clear the current resolution while waiting for async resolution
            this.resolvedIcon = undefined;
            await customElements.whenDefined(icon);
        } catch (ex) {
            // If any error (i.e. invalid custom element name) don't continue
            // Don't update the resolvedIcon as it was already set to undefined before async resolution
            // (in case other async resolutions were started)
            return;
        }

        if (icon !== this.icon) {
            // Possible the icon has changed while waiting for async resolution
            // Don't update the resolvedIcon as it was already set to undefined before async resolution
            // (in case other async resolutions were started)
            return;
        }

        const elementClass = customElements.get(icon)!;
        this.resolvedIcon = isIconClass(elementClass) ? icon : undefined;
    }

    private iconChanged(): void {
        const icon = this.icon;
        if (!icon) {
            this.resolvedIcon = undefined;
            return;
        }
        const elementClass = customElements.get(icon);
        if (elementClass) {
            this.resolvedIcon = isIconClass(elementClass) ? icon : undefined;
            return;
        }
        void this.resolveIconAsync(icon);
    }
}

const iconMapping = MappingIcon.compose({
    baseName: mappingIconTag,
    template
});
DesignSystem.getOrCreate().register(iconMapping());
