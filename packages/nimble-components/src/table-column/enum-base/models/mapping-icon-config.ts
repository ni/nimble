import { html, when, type ViewTemplate } from '@microsoft/fast-element';
import type { IconSeverity } from '../../../icon-base/types';
import { MappingConfig } from './mapping-config';

export interface IconView {
    severity: IconSeverity;
    text?: string;
}

const createIconTemplate = (
    icon: string | undefined,
    textHidden: boolean
): ViewTemplate<IconView> => {
    return html`
        <span class="reserve-icon-width">
            ${when(_ => icon !== undefined, html<IconView>`
                <${icon!}
                    title="${x => (textHidden ? x.text : '')}"
                    role="img"
                    aria-label="${x => x.text}"
                    aria-hidden="${_ => (textHidden ? 'false' : 'true')}"
                    severity="${x => x.severity}"
                >
                </${icon!}>
            `)}
        </span>       
    `;
};

/**
 * Mapping configuration corresponding to a icon mapping
 */
export class MappingIconConfig extends MappingConfig {
    public readonly iconCellTemplate: ViewTemplate<IconView>;
    public readonly iconGroupRowTemplate: ViewTemplate<IconView>;

    public constructor(
        resolvedIcon: string | undefined,
        public readonly severity: IconSeverity,
        text: string | undefined,
        public readonly textHidden: boolean
    ) {
        super(text);
        this.iconCellTemplate = createIconTemplate(resolvedIcon, textHidden);
        this.iconGroupRowTemplate = textHidden ? createIconTemplate(resolvedIcon, false) : this.iconCellTemplate;
    }
}
