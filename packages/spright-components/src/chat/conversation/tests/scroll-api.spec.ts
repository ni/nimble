import { chatMessageOutboundTag } from '../../message/outbound';
import { ChatConversationScrollApi } from '../utils/scroll-api';

describe('ChatConversationScrollApi', () => {
    type MutationCb = (mutations: MutationRecord[]) => void;
    type IntersectionCb = (entries: IntersectionObserverEntry[]) => void;

    let mutationCallback: MutationCb | null = null;
    let intersectionCallback: IntersectionCb | null = null;

    class MockMutationObserver {
        public constructor(callback: MutationCb) {
            mutationCallback = callback;
        }

        public observe(): void {}

        public disconnect(): void {}
    }

    class MockIntersectionObserver {
        public constructor(callback: IntersectionCb) {
            intersectionCallback = callback;
        }

        public observe(): void {}

        public disconnect(): void {}
    }

    const originalMutationObserver = Reflect.get(globalThis, 'MutationObserver');
    const originalIntersectionObserver = Reflect.get(globalThis, 'IntersectionObserver');

    beforeEach(() => {
        mutationCallback = null;
        intersectionCallback = null;
        Reflect.set(globalThis, 'MutationObserver', MockMutationObserver as unknown as typeof MutationObserver);
        Reflect.set(globalThis, 'IntersectionObserver', MockIntersectionObserver as unknown as typeof IntersectionObserver);
    });

    afterEach(() => {
        Reflect.set(globalThis, 'MutationObserver', originalMutationObserver);
        Reflect.set(globalThis, 'IntersectionObserver', originalIntersectionObserver);
    });

    function setupApi(): {
        api: ChatConversationScrollApi,
        container: HTMLElement,
        host: HTMLElement,
        slot: HTMLSlotElement
    } {
        const container = document.createElement('div');
        const host = document.createElement('div');
        const slot = document.createElement('slot');

        const api = new ChatConversationScrollApi(container, host, slot);
        return { api, container, host, slot };
    }

    it('computes outbound geometry from container and message rects', () => {
        const { api, container, slot } = setupApi();
        const outbound = document.createElement(chatMessageOutboundTag);

        spyOn(slot, 'assignedElements').and.returnValue([outbound]);
        spyOn(container, 'getBoundingClientRect').and.returnValue({ top: 50 } as DOMRect);
        spyOn(outbound, 'getBoundingClientRect').and.returnValue({ top: 200, height: 40 } as DOMRect);
        Object.defineProperty(container, 'scrollTop', { value: 10, configurable: true });

        const geometry = api.getLastOutboundMessageGeometry();

        expect(geometry).toEqual({ top: 160, height: 40 });
    });

    it('sets and clears bottom padding and reflects it in distance-from-bottom', () => {
        const { api, container } = setupApi();
        Object.defineProperty(container, 'scrollHeight', { value: 900, configurable: true });
        Object.defineProperty(container, 'clientHeight', { value: 300, configurable: true });
        Object.defineProperty(container, 'scrollTop', { value: 500, configurable: true });

        api.setBottomPadding(120);

        expect(container.style.paddingBottom).toBe('120px');
        expect(api.getDistanceFromBottom()).toBe(-20);

        api.setBottomPadding(0);
        expect(container.style.paddingBottom).toBe('');
    });

    it('fires message-added callbacks via mutation observer', () => {
        const { api } = setupApi();
        const callback = jasmine.createSpy('callback');

        api.onMessageAdded(callback);

        const added = document.createElement('div');
        mutationCallback?.([
            {
                addedNodes: [added]
            } as unknown as MutationRecord
        ]);

        expect(callback).toHaveBeenCalledWith(added);
    });

    it('reports conversation-end visibility changes via intersection observer', () => {
        const { api, slot } = setupApi();
        const last = document.createElement('div');
        spyOn(slot, 'assignedElements').and.returnValue([last]);

        const callback = jasmine.createSpy('callback');
        api.onConversationEndVisibilityChanged(callback);

        intersectionCallback?.([{ isIntersecting: false } as IntersectionObserverEntry]);

        expect(callback).toHaveBeenCalledWith(true);
        expect(callback).toHaveBeenCalledWith(false);
    });
});
