import { html, ViewTemplate } from '@microsoft/fast-element';
import { ListOption, listOptionTag } from '../../../list-option';
import { MappingConfig } from './mapping-config';

/**
 * Mapping configuration corresponding to a user mapping
 */
export class MappingUserConfig extends MappingConfig {
    public override createListView(): ViewTemplate<ListOption> {
        return html`<${listOptionTag} value="${this.mentionHref ?? ''}">${
            this.displayName ?? ''
        }</${listOptionTag}>`;
    }
}
