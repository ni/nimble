import { Severity } from '@ni/nimble-components/dist/esm/patterns/severity/types';

export const ExampleStepType = {
    simple: 'simple',
    many: 'many',
    wide: 'wide'
} as const;
export type ExampleStepType = (typeof ExampleStepType)[keyof typeof ExampleStepType];

export const severityStates = [
    ['Default', Severity.default],
    ['Error', Severity.error],
    ['Warning', Severity.warning],
    ['Success', Severity.success]
] as const;
export type SeverityStates = (typeof severityStates)[number];
