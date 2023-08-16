import { html, type ViewTemplate } from '@microsoft/fast-element';
import type { IconSeverity } from '../../../icon-base/types';
import { MappingConfig } from './mapping-config';

export interface IconView {
    severity?: IconSeverity;
    text?: string;
}
const createIconTemplate = (icon: string): ViewTemplate<IconView> => html`
    <${icon}
        title="${x => x.text}"
        aria-label="${x => x.text}"
        severity="${x => x.severity}"
        class="no-shrink"
    >
    </${icon}>`;

/**
 * Mapping configuration corresponding to a icon mapping
 */
export class MappingIconConfig extends MappingConfig {
    public readonly iconTemplate: ViewTemplate<IconView>;
    public constructor(
        resolvedIcon: string,
        text?: string,
        public readonly severity?: IconSeverity
    ) {
        super(text);
        this.iconTemplate = createIconTemplate(resolvedIcon);
    }
}
