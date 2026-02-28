/**
 * Orientation of steppers.
 * @public
 */
import { Orientation } from '@ni/fast-web-utilities';

export const StepperOrientation = Orientation;

export type StepperOrientation = (typeof StepperOrientation)[keyof typeof StepperOrientation];
