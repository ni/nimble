import { Severity } from '@ni/nimble-components/dist/esm/patterns/severity/types';
import { StepperOrientation } from '@ni/nimble-components/dist/esm/stepper/types';

export const ExampleStepType = {
    simple: 'simple',
    severity: 'severity',
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
    ['Absent', undefined, undefined, undefined, false],
    ['Empty', '', '', '', false],
    ['Short', 'Title', 'Subtitle', 'Severity text', false],
    ['NoSubtitle', 'Title', undefined, 'Severity text', false],
    ['LongSeverity', 'Title is short', 'Subtitle is short', 'Severity text that is very long and very interesting', false],
    ['StepIndicator', 'Title', 'Subtitle', 'Severity text', true]
] as const;
export type StepContentStates = (typeof stepContentStates)[number];
export const stepContentStateShort = stepContentStates[2];
export const stepContentStateStepIndicator = stepContentStates[5];

export const orientationStates = [
    ['Horizontal', StepperOrientation.horizontal],
    ['Vertical', StepperOrientation.vertical],
] as const;
export type OrientationStates = (typeof orientationStates)[number];

export const stepLayoutStates = [
    ['First Horizontal', false, 'horizontal'],
    ['Last Horizontal', true, 'horizontal'],
    ['First Vertical', false, 'vertical'],
    ['Last Vertical', true, 'vertical'],
] as const;
export type StepLayoutStates = (typeof stepLayoutStates)[number];

export const stepManipulationStates = [
    ['', false, false],
    ['Disabled', false, true],
    ['Read-Only', true, false],
    ['Read-Only Disabled', true, true],
] as const;
export type StepManipulationState = (typeof stepManipulationStates)[number];

export const stepManipulationState = {
    none: stepManipulationStates[0],
    disabled: stepManipulationStates[1],
    readOnly: stepManipulationStates[2],
    readOnlyDisabled: stepManipulationStates[3],
} as const;
