/**
 * Common state shared across Mapping Config
 */
export abstract class MappingConfig {
    public constructor(
        public readonly mentionHref: string | undefined,
        public readonly displayName: string | undefined
    ) {}
}
