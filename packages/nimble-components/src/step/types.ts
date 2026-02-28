import { Severity } from '../patterns/severity/types';

export const StepSeverity = Severity;
export type StepSeverity = (typeof StepSeverity)[keyof typeof StepSeverity];
