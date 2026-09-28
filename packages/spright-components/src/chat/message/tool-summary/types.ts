/**
 * Runtime status of a chat tool call.
 * @public
 */
export const ChatToolCallStatus = {
    pending: 'pending',
    success: 'success',
    warning: 'warning',
    error: 'error',
    canceled: 'canceled',
    declined: 'declined',
    terminated: 'terminated',
    unknown: 'unknown'
} as const;

/**
 * Runtime status of a chat tool call.
 * @public
 */
export type ChatToolCallStatus = typeof ChatToolCallStatus[keyof typeof ChatToolCallStatus];

/**
 * Interpretation applied to a chat tool-call input value.
 * @public
 */
export const ChatToolCallInputValueType = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    json: 'json'
} as const;

/**
 * Interpretation applied to a chat tool-call input value.
 * @public
 */
export type ChatToolCallInputValueType = typeof ChatToolCallInputValueType[keyof typeof ChatToolCallInputValueType];