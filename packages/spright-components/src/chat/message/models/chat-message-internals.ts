import { observable } from '@ni/fast-element';

/**
 * Options for configuring a `ChatMessageInternals` instance.
 * @internal
 */
export interface ChatMessageInternalsOptions {
    /** When true, the conversation anchors to this message when it is inserted. */
    anchorOnInsert?: boolean;
}

/**
 * Internal state for a chat message that is configured by the containing
 * `spright-chat-conversation`. Following the `step-internals` pattern, the
 * conversation reads declarative behavior (such as `anchorOnInsert`) and writes
 * observable state (such as `isScrollAnchor`) across the element boundary.
 * @internal
 */
export class ChatMessageInternals {
    /**
     * Declares that the conversation should anchor to this message (pin it near
     * the top of the viewport) when it is inserted.
     */
    public readonly anchorOnInsert: boolean;

    /**
     * True when this message is the one the conversation anchors to while
     * auto-scrolling.
     */
    @observable
    public isScrollAnchor = false;

    public constructor(options?: ChatMessageInternalsOptions) {
        this.anchorOnInsert = options?.anchorOnInsert ?? false;
    }

    public static elementHasMessageInternals(
        element: Element
    ): element is ChatMessage {
        return (element as Partial<ChatMessage>).messageInternals instanceof ChatMessageInternals;
    }
}

/**
 * An element that exposes `ChatMessageInternals` for the conversation to read and
 * coordinate scroll management.
 * @internal
 */
export interface ChatMessage extends HTMLElement {
    readonly messageInternals: ChatMessageInternals;
}
