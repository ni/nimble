export interface ScaledUnit {
    conversionFactor: number;
    format(value: number): string;
}
