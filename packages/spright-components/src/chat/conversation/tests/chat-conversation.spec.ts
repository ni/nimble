import { html } from '@ni/fast-element';
import { anchorTag } from '@ni/nimble-components/dist/esm/anchor';
import { ChatConversation, chatConversationTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(): Promise<Fixture<ChatConversation>> {
    return await fixture<ChatConversation>(
        html`<${chatConversationTag}></${chatConversationTag}>`
    );
}

describe('ChatConversation', () => {
    let element: ChatConversation;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(chatConversationTag)).toBeInstanceOf(
            ChatConversation
        );
    });

    it('should have a default unnamed slot element in the shadow DOM', async () => {
        await connect();
        const unnamedSlot = element.shadowRoot?.querySelector('slot:not([name])');
        expect(unnamedSlot).not.toBeNull();
    });

    it('should have an input slot element in the shadow DOM', async () => {
        await connect();
        const inputSlot = element.shadowRoot?.querySelector('slot[name="input"]');
        expect(inputSlot).not.toBeNull();
    });

    it('should have a toolbar slot element in the shadow DOM', async () => {
        await connect();
        const toolbarSlot = element.shadowRoot?.querySelector('slot[name="toolbar"]');
        expect(toolbarSlot).not.toBeNull();
    });

    it('should have a start slot element in the shadow DOM', async () => {
        await connect();
        const startSlot = element.shadowRoot?.querySelector('slot[name="start"]');
        expect(startSlot).not.toBeNull();
    });

    it('should have an end slot element in the shadow DOM', async () => {
        await connect();
        const endSlot = element.shadowRoot?.querySelector('slot[name="end"]');
        expect(endSlot).not.toBeNull();
    });

    it('should support content in the end slot', async () => {
        await disconnect();
        ({ element, connect, disconnect } = await fixture<ChatConversation>(
            html`<${chatConversationTag}>
                <span slot="end">
                    AI-generated content may be incorrect. 
                    <${anchorTag} href="https://www.ni.com" target="_blank">View Terms and Conditions</${anchorTag}>
                </span>
            </${chatConversationTag}>`
        ));
        await connect();
        const endSlot: HTMLSlotElement = element.shadowRoot!.querySelector('slot[name="end"]')!;
        expect(endSlot.assignedElements().length).toBe(1);
    });

    describe('scrolling behavior', () => {
        interface MockScrollContainer {
            scrollTop: number;
            scrollHeight: number;
            clientHeight: number;
            style: { paddingBottom: string };
            getBoundingClientRect?: () => DOMRect;
            scrollTo?: (options: ScrollToOptions) => void;
            addEventListener?: (...args: unknown[]) => void;
            removeEventListener?: (...args: unknown[]) => void;
        }
        interface ScrollManagerInternals {
            container: MockScrollContainer;
            isUserScrolledUp: boolean;
            previousScrollTop: number;
            bottomPaddingPx: number;
            userMessageScrollTop: number;
            onScroll: () => void;
            updatePaddingAndScroll: () => void;
            getLastOutboundMessage: () => HTMLElement | null;
            scrollToLastMessageTop: () => void;
        }

        function getScrollManager(el: ChatConversation): ScrollManagerInternals {
            return (el as unknown as { scrollManager: ScrollManagerInternals }).scrollManager;
        }

        function createMockContainer(overrides: Partial<MockScrollContainer> = {}): MockScrollContainer {
            return {
                scrollTop: 0,
                scrollHeight: 600,
                clientHeight: 300,
                style: { paddingBottom: '' },
                addEventListener: () => {},
                removeEventListener: () => {},
                ...overrides
            };
        }

        it('marks user as scrolled up when scrolling up away from bottom', async () => {
            await connect();
            const scrollManager = getScrollManager(element);
            scrollManager.container = createMockContainer({ scrollTop: 100, scrollHeight: 500, clientHeight: 200 });
            scrollManager.previousScrollTop = 200;

            scrollManager.onScroll();

            expect(scrollManager.isUserScrolledUp).toBeTrue();
        });

        it('clears isUserScrolledUp when user scrolls to within 10px of bottom', async () => {
            await connect();
            const scrollManager = getScrollManager(element);
            scrollManager.container = createMockContainer({ scrollTop: 290, scrollHeight: 500, clientHeight: 200 });
            scrollManager.isUserScrolledUp = true;
            scrollManager.previousScrollTop = 100;

            scrollManager.onScroll();

            expect(scrollManager.isUserScrolledUp).toBeFalse();
        });

        it('auto-scroll should default to false', async () => {
            await connect();
            expect(element.autoScroll).toBeFalse();
        });

        describe('with auto-scroll enabled', () => {
            beforeEach(async () => {
                await connect();
                element.autoScroll = true;
            });

            it('auto-scrolls to bottom when content updates and user has not scrolled up', () => {
                const scrollManager = getScrollManager(element);
                const container = createMockContainer({ scrollTop: 0, scrollHeight: 600, clientHeight: 300 });
                scrollManager.container = container;
                scrollManager.updatePaddingAndScroll();

                expect(container.scrollTop).toBe(600);
            });

            it('does not auto-scroll when user has scrolled up and content updates', async () => {
                spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
                    cb(0);
                    return 0;
                });

                const scrollManager = getScrollManager(element);
                const container = createMockContainer({ scrollTop: 100 });
                scrollManager.container = container;
                scrollManager.isUserScrolledUp = true;

                element.appendChild(document.createTextNode('streaming text'));
                await Promise.resolve();
                await Promise.resolve();

                expect(container.scrollTop).toBe(100);
            });

            it('scrolls so that the outbound message appears at top of viewport when user sends a message', () => {
                const scrollManager = getScrollManager(element);
                const container: MockScrollContainer & { scrollTo: (options: ScrollToOptions) => void, getBoundingClientRect: () => DOMRect } = {
                    ...createMockContainer({ scrollTop: 0, scrollHeight: 600, clientHeight: 300 }),
                    getBoundingClientRect: (): DOMRect => ({ top: 50 } as DOMRect),
                    scrollTo(options: ScrollToOptions): void {
                        this.scrollTop = options.top ?? 0;
                    }
                };
                scrollManager.container = container;
                const outboundMsg = document.createElement('div');
                spyOn(outboundMsg, 'getBoundingClientRect').and.returnValue({ top: 200, height: 50 } as DOMRect);
                spyOn(scrollManager, 'getLastOutboundMessage').and.returnValue(outboundMsg);

                scrollManager.scrollToLastMessageTop();

                expect(container.scrollTop).toBe(142);
            });

            it('sets bottom padding to keep outbound message scrollable when content is shorter than viewport', () => {
                const scrollManager = getScrollManager(element);
                const container: MockScrollContainer & { scrollTo: (options: ScrollToOptions) => void, getBoundingClientRect: () => DOMRect } = {
                    ...createMockContainer({ scrollTop: 0, scrollHeight: 600, clientHeight: 300 }),
                    getBoundingClientRect: (): DOMRect => ({ top: 50 } as DOMRect),
                    scrollTo(options: ScrollToOptions): void {
                        this.scrollTop = options.top ?? 0;
                    }
                };
                scrollManager.container = container;
                const outboundMsg = document.createElement('div');
                spyOn(outboundMsg, 'getBoundingClientRect').and.returnValue({ top: 200, height: 50 } as DOMRect);
                spyOn(scrollManager, 'getLastOutboundMessage').and.returnValue(outboundMsg);

                scrollManager.scrollToLastMessageTop();

                expect(scrollManager.bottomPaddingPx).toBe(242);
                expect(container.style.paddingBottom).toBe('242px');
            });

            it('reduces bottom padding as AI response content grows', () => {
                const scrollManager = getScrollManager(element);
                const container: MockScrollContainer & { scrollTo: (options: ScrollToOptions) => void } = {
                    ...createMockContainer({ scrollTop: 142, scrollHeight: 842, clientHeight: 300, style: { paddingBottom: '242px' } }),
                    scrollTo(options: ScrollToOptions): void {
                        this.scrollTop = options.top ?? 0;
                    }
                };
                scrollManager.container = container;
                scrollManager.bottomPaddingPx = 242;
                scrollManager.userMessageScrollTop = 142;

                scrollManager.updatePaddingAndScroll();

                expect(scrollManager.bottomPaddingPx).toBe(0);
                expect(container.style.paddingBottom).toBe('');
            });

            it('auto-scrolls to bottom once all padding is removed as AI content fills the viewport', () => {
                const scrollManager = getScrollManager(element);
                const container: MockScrollContainer & { scrollTo: (options: ScrollToOptions) => void } = {
                    ...createMockContainer({ scrollTop: 142, scrollHeight: 842, clientHeight: 300, style: { paddingBottom: '242px' } }),
                    scrollTo(options: ScrollToOptions): void {
                        this.scrollTop = options.top ?? 0;
                    }
                };
                scrollManager.container = container;
                scrollManager.bottomPaddingPx = 242;
                scrollManager.userMessageScrollTop = 142;

                scrollManager.updatePaddingAndScroll();

                expect(container.scrollTop).toBe(container.scrollHeight);
            });

            it('scrolls so that the last few lines of a tall outbound message appear at top of viewport', () => {
                const scrollManager = getScrollManager(element);
                const container: MockScrollContainer & { scrollTo: (options: ScrollToOptions) => void, getBoundingClientRect: () => DOMRect } = {
                    ...createMockContainer({ scrollTop: 0, scrollHeight: 600, clientHeight: 300 }),
                    getBoundingClientRect: (): DOMRect => ({ top: 50 } as DOMRect),
                    scrollTo(options: ScrollToOptions): void {
                        this.scrollTop = options.top ?? 0;
                    }
                };
                scrollManager.container = container;
                const outboundMsg = document.createElement('div');
                spyOn(outboundMsg, 'getBoundingClientRect').and.returnValue({ top: 200, height: 160 } as DOMRect);
                spyOn(scrollManager, 'getLastOutboundMessage').and.returnValue(outboundMsg);

                scrollManager.scrollToLastMessageTop();

                expect(container.scrollTop).toBe(250);
            });

            it('sets bottom padding to clientHeight minus line gap for a tall outbound message', () => {
                const scrollManager = getScrollManager(element);
                const container: MockScrollContainer & { scrollTo: (options: ScrollToOptions) => void, getBoundingClientRect: () => DOMRect } = {
                    ...createMockContainer({ scrollTop: 0, scrollHeight: 600, clientHeight: 300 }),
                    getBoundingClientRect: (): DOMRect => ({ top: 50 } as DOMRect),
                    scrollTo(options: ScrollToOptions): void {
                        this.scrollTop = options.top ?? 0;
                    }
                };
                scrollManager.container = container;
                const outboundMsg = document.createElement('div');
                spyOn(outboundMsg, 'getBoundingClientRect').and.returnValue({ top: 200, height: 160 } as DOMRect);
                spyOn(scrollManager, 'getLastOutboundMessage').and.returnValue(outboundMsg);

                scrollManager.scrollToLastMessageTop();

                expect(scrollManager.bottomPaddingPx).toBe(240);
                expect(container.style.paddingBottom).toBe('240px');
            });
        });
    });
});
