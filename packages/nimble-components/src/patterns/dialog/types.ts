/**
 * Symbol that is returned as the close reason (from the Promise returned by show()) when
 * the dialog or drawer was closed by pressing the ESC key (vs. calling the close() function).
 */
export const UserDismissed: unique symbol = Symbol('user dismissed');
export type UserDismissed = typeof UserDismissed;
