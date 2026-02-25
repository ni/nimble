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

export const selectedStates = [
    ['', false],
    ['Selected', true],
] as const;
export type SelectedState = (typeof selectedStates)[number];
export const selectedStateNotSelected = selectedStates[0];

export const stepContentStates = [
    ['Absent', undefined, undefined, undefined],
    ['Empty', '', '', ''],
    ['Short', 'Title', 'Subtitle', 'Severity text'],
    ['Long', 'Title That is very long and very interesting', 'Subtitle that is very long and very interesting', 'Severity text that is very long and very interesting'],
] as const;
export type StepContentStates = (typeof stepContentStates)[number];
export const stepContentStateDefault = stepContentStates[0];
