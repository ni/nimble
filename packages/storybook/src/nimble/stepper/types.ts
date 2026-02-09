export const ExampleStepType = {
    simple: 'simple',
    many: 'many',
    wide: 'wide'
} as const;
export type ExampleStepType = (typeof ExampleStepType)[keyof typeof ExampleStepType];
