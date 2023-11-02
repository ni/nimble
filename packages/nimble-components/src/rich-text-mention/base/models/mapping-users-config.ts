import { html, ViewTemplate } from '@microsoft/fast-element';
import { ListOption, listOptionTag } from '../../../list-option';
import { MappingConfig } from './mapping-config';

/**
 * Mapping configuration corresponding to a user mapping
 */
export class MappingUsersConfig extends MappingConfig {
    public constructor(
        mentionUrl: string | undefined,
        displayName: string | undefined,
    ) {
        super(mentionUrl, displayName);
    }

    public override createListView(): ViewTemplate<ListOption> {
        return html`<${listOptionTag} value="${this.mentionUrl ?? ''}">${this.displayName ?? ''}</${listOptionTag}>`;
    }
}