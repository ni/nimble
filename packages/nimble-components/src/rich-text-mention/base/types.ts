import type { MappingConfig } from './models/mapping-config';

/**
 * The type of the detail associated with the `mention-update`
 * event on the banner.
 */
export interface MentionUpdateEventDetail {
    filter: string;
}

export type MappingConfigs = ReadonlyMap<string, MappingConfig>;

export type MentionUpdateEmitter = (filter: string) => void;
