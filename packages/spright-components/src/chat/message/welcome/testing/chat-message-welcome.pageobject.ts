import type { ChatMessageWelcome } from '..';
import { iconNigelChatTag } from '../../../../icons/nigel-chat';

/**
 * Page object for the `spright-chat-message-welcome` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class ChatMessageWelcomePageObject {
    public constructor(protected readonly element: ChatMessageWelcome) {}

    public getTitleText(): string | null {
        const titleDiv = this.element.shadowRoot?.querySelector('.title');
        if (titleDiv === null || titleDiv === undefined) {
            return null;
        }
        return titleDiv.textContent?.trim() ?? '';
    }

    public getSubtitleText(): string | null {
        const subtitleDiv = this.element.shadowRoot?.querySelector('.subtitle');
        if (subtitleDiv === null || subtitleDiv === undefined) {
            return null;
        }
        return subtitleDiv.textContent?.trim() ?? '';
    }

    public isTitleRendered(): boolean {
        return this.element.shadowRoot?.querySelector('.title') !== null;
    }

    public isSubtitleRendered(): boolean {
        return this.element.shadowRoot?.querySelector('.subtitle') !== null;
    }

    public getSlottedBrandIconNodes(): Element[] {
        const slot = this.getBrandIconSlot();
        return slot?.assignedElements() ?? [];
    }

    public hasBrandIconDefaultContent(): boolean {
        const slot = this.getBrandIconSlot();
        const defaultContent = slot?.children[0];
        return defaultContent?.tagName.toLowerCase() === iconNigelChatTag;
    }

    public getMessageContentSlottedText(): string {
        const slot = this.getDefaultSlot();
        const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
        return assigned.map(n => n.textContent ?? '').join('');
    }

    private getDefaultSlot(): HTMLSlotElement | null | undefined {
        return this.element.shadowRoot?.querySelector('slot:not([name])');
    }

    private getBrandIconSlot(): HTMLSlotElement | null | undefined {
        return this.element.shadowRoot?.querySelector('slot[name="brand-icon"]');
    }
}
