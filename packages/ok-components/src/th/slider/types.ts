export const ThSliderShowMinMax = {
    always: 'always',
    hover: 'hover',
    never: 'never'
} as const;

export type ThSliderShowMinMax = (typeof ThSliderShowMinMax)[keyof typeof ThSliderShowMinMax];