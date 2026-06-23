import { observable } from '@ni/fast-element';

/**
 * Internal state for a chat message that is configured by the containing
 * `spright-chat-conversation`. Following the `step-internals` pattern, the
 * conversation writes to these observable properties to coordinate behavior
 * (such as scroll anchoring) across the element boundary.
 * @internal
 */
export class ChatMessageInternals {
    /**
     * True when this message is the one the conversation anchors to while
     * auto-scrolling (the most recently sent outbound message).
     */
    @observable
    public isScrollAnchor = false;
}
