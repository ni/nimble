/**
 * A prefix that represents a scaling factor when applied to a base unit.
 * A base unit is represented as scale factor 1 and empty text.
 */
export class UnitPrefix {
    public constructor(
        public readonly scaleFactor: number,
        public readonly text: string
    ) {
        if (scaleFactor === 1 && text !== '') {
            throw new Error(
                'Base scale factor of 1 has unused text and should be empty string'
            );
        }
    }

    public isBase(): boolean {
        return this.scaleFactor === 1;
    }
}
