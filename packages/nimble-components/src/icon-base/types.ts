/**
 * Predefined icon status states
 * @public
 */
export enum IconStatus {
    Fail = 'fail',
    Warning = 'warning',
    Pass = 'pass',
    Regular = 'regular'
}
export type IconStatusAttribute = `${IconStatus}`;
