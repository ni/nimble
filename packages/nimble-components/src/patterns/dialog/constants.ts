/**
 * Symbol that is returned as the dialog close reason (from the Promise returned by show()) when
 * the dialog was closed by pressing the ESC key (vs. calling the close() function).
 */
export const USER_DISMISSED: unique symbol = Symbol('user dismissed');
export type UserDismissed = typeof USER_DISMISSED;
