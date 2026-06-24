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

    private readonly host: HTMLElement;
    private slotName?: string;

    public constructor(host: HTMLElement, options?: ChatMessageInternalsOptions) {
        this.host = host;
        this.anchorOnInsert = options?.anchorOnInsert ?? false;
    }

    /**
     * The conversation slot this message is assigned to. Owned by the
     * conversation, which partitions messages between its regions. Reflected to
     * the host `slot` attribute by the message itself so framework wrappers never
     * manage slotting. `undefined` places the message in the default slot.
     */
    public get slot(): string | undefined {
        return this.slotName;
    }

    public set slot(value: string | undefined) {
        if (value === this.slotName) {
            return;
        }
        this.slotName = value;
        if (value === undefined) {
            this.host.removeAttribute('slot');
        } else {
            this.host.setAttribute('slot', value);
        }
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
