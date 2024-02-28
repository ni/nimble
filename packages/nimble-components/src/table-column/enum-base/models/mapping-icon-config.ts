import { html, type ViewTemplate } from '@microsoft/fast-element';
import type { IconSeverity } from '../../../icon-base/types';
import { MappingConfig } from './mapping-config';

export interface IconView {
    severity: IconSeverity;
    text?: string;
}

// Create an empty template containing only a space because creating a ViewTemplate
// with an empty string throws an exception at runtime.
// prettier-ignore
const emptyTemplate = html<IconView>` `;

const createIconTemplate = (
    icon: string | undefined
): ViewTemplate<IconView> => {
    if (icon === undefined) {
        return emptyTemplate;
    }

    return html`
        <${icon}
            title="${x => x.text}"
            role="img"
            aria-label="${x => x.text}"
            severity="${x => x.severity}"
            class="no-shrink"
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
        resolvedIcon: string | undefined,
        public readonly severity: IconSeverity,
        text: string | undefined
    ) {
        super(text);
        this.iconTemplate = createIconTemplate(resolvedIcon);
    }
}
