export const SliderShowMinMax = {
    always: 'always',
    hover: 'hover',
    never: 'never'
} as const;

export type SliderShowMinMax = (typeof SliderShowMinMax)[keyof typeof SliderShowMinMax];