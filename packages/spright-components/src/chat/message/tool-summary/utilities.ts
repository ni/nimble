import {
    ChatToolCallInputValueType,
    ChatToolCallStatus
} from './types';

const supportedStatuses = new Set<string>(Object.values(ChatToolCallStatus));
const supportedValueTypes = new Set<string>(Object.values(ChatToolCallInputValueType));

/** @internal */
export function normalizeToolCallStatus(value: string | undefined): ChatToolCallStatus {
    return value !== undefined && supportedStatuses.has(value)
        ? value as ChatToolCallStatus
        : ChatToolCallStatus.unknown;
}

/** @internal */
export function normalizeToolCallInputValueType(
    value: string | undefined
): ChatToolCallInputValueType {
    return value !== undefined && supportedValueTypes.has(value)
        ? value as ChatToolCallInputValueType
        : ChatToolCallInputValueType.string;
}

/** @internal */
export function formatToolCallInputValue(
    value: string | undefined,
    valueType: string | undefined
): string {
    const safeValue = value ?? '';
    switch (normalizeToolCallInputValueType(valueType)) {
        case ChatToolCallInputValueType.string:
            return JSON.stringify(safeValue);
        case ChatToolCallInputValueType.json:
            try {
                return JSON.stringify(JSON.parse(safeValue));
            } catch {
                return safeValue;
            }
        default:
            return safeValue;
    }
}