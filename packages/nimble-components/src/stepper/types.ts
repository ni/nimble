/**
 * Orientation of steppers.
 * @public
 */
export const StepperOrientation = {
    horizontal: undefined,
    vertical: 'vertical'
} as const;

export type StepperOrientation = (typeof StepperOrientation)[keyof typeof StepperOrientation];
