export const fractionalWidthValue1 = 1 as const;
export const fractionalWidthValue2 = 2 as const;
export const minPixelWidthValue1 = 40 as const;
export const minPixelWidthValue2 = 50 as const;

export const fractionalWidthColumnProperties = [
    { name: 'fractionalWidth', defaultValue: undefined, value1: fractionalWidthValue1, value2: fractionalWidthValue2 },
    { name: 'minPixelWidth', defaultValue: undefined, value1: minPixelWidthValue1, value2: minPixelWidthValue2 }
] as const;