import { Severity } from '../patterns/severity/types';

export const AnchorStepSeverity = Severity;
export type AnchorStepSeverity = (typeof AnchorStepSeverity)[keyof typeof AnchorStepSeverity];
