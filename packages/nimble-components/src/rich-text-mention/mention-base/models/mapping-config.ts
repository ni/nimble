import type { ViewTemplate } from '@microsoft/fast-element';
import type { ListOption } from '../../../list-option';

/**
 * Common state shared across Mapping Config
 */
export abstract class MappingConfig {
    public readonly listView: ViewTemplate<ListOption> = this.createListView();
    public constructor(public readonly mentionHref: string | undefined, public readonly displayName: string | undefined) {}

    public abstract createListView(): ViewTemplate<ListOption>;
}