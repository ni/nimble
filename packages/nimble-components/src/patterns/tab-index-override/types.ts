/**
 * Implemented by controls that typically set tabindex="0" in their templates,
 * but allow overriding that behavior in some Nimble-internal cases (i.e. the table)
 */
export interface TabIndexOverride {
    tabIndexOverride: number;
}
