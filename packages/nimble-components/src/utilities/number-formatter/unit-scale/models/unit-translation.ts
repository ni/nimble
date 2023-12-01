/**
 * Representations of a base unit in a particular language
 */
export class UnitTranslation {
    public constructor(
        public readonly singular: string,
        public readonly plural: string,
        public readonly symbol: string
    ) {}
}
