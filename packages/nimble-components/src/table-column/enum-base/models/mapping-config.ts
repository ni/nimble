/**
 * Common state shared across Mapping Config
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class MappingConfig {
    protected constructor(public readonly label: string) {}
}
