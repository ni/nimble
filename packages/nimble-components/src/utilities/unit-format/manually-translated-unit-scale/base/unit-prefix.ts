/**
 * A prefix that represents a scaling factor when applied to a base unit.
 * A base unit is represented as factor 1 and empty text.
 */
export class UnitPrefix {
    public constructor(
        public readonly factor: number,
        public readonly text: string
    ) {
        if (factor === 1 && text !== '') {
            throw new Error(
                'Base factor of 1 has unused text and should be empty string'
            );
        }
    }

    public isBase(): boolean {
        return this.factor === 1;
    }
}
