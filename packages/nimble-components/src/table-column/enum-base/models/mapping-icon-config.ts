import { html, type ViewTemplate } from '@microsoft/fast-element';
import type { IconSeverity } from '../../../icon-base/types';
import { MappingConfig } from './mapping-config';

export interface IconView {
    severity: IconSeverity;
    label: string;
}
const createIconTemplate = (icon: string): ViewTemplate<IconView> => html`
    <${icon}
        title="${x => x.label}"
        aria-label="${x => x.label}"
        severity="${x => x.severity}"
    >
    </${icon}>`;

/**
 * Mapping configuration corresponding to a text mapping
 */
export class MappingIconConfig extends MappingConfig {
    public readonly iconTemplate: ViewTemplate<IconView>;
    public constructor(
        public readonly label: string,
        public readonly severity: IconSeverity,
        resolvedIcon: string
    ) {
        super();
        this.iconTemplate = createIconTemplate(resolvedIcon);
    }
}
