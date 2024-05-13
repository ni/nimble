import { html, type ViewTemplate } from '@microsoft/fast-element';
import type { IconSeverity } from '../../../icon-base/types';
import { MappingConfig } from './mapping-config';

export interface IconView {
    severity: IconSeverity;
    text?: string;
    textHidden: boolean;
}

const createIconTemplate = (icon: string): ViewTemplate<IconView> => {
    return html`
        <${icon}
            title="${x => (x.textHidden ? x.text : '')}"
            role="img"
            aria-label="${x => x.text}"
            aria-hidden="${x => (x.textHidden ? 'false' : 'true')}"
            severity="${x => x.severity}"
        >
        </${icon}>
    `;
};

/**
 * Mapping configuration corresponding to a icon mapping
 */
export class MappingIconConfig extends MappingConfig {
    public readonly iconTemplate: ViewTemplate<IconView>;

    public constructor(
        resolvedIcon: string,
        public readonly severity: IconSeverity,
        text: string | undefined,
        public readonly textHidden: boolean
    ) {
        super(text);
        this.iconTemplate = createIconTemplate(resolvedIcon);
    }
}
