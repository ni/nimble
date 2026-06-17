import { ChatConversationScrollManager } from '../utils/scroll-manager';
import { ChatConversationScrollApi } from '../utils/scroll-api';

describe('ChatConversationScrollManager', () => {
    interface MockApi {
        getScrollContainerDimensions: jasmine.Spy<() => {
            scrollTop: number,
            scrollHeight: number,
            clientHeight: number
        }>;
        getDistanceFromBottom: jasmine.Spy<() => number>;
        getLastOutboundMessageGeometry: jasmine.Spy<() => { top: number, height: number } | null>;
        setScrollPosition: jasmine.Spy<(scrollTop: number, smooth?: boolean) => void>;
        setBottomPadding: jasmine.Spy<(paddingPx: number) => void>;
        onMessageAdded: jasmine.Spy<(callback: (element: Element) => void) => void>;
        onUserScroll: jasmine.Spy<(callback: (scrollTop: number) => void) => void>;
        onContentSizeChanged: jasmine.Spy<(callback: () => void) => void>;
        onConversationEndVisibilityChanged: jasmine.Spy<(callback: (isVisible: boolean) => void) => void>;
        getIsConversationEndVisible: jasmine.Spy<() => boolean>;
        unsubscribeAll: jasmine.Spy<() => void>;
    }

    function createMockApi(): MockApi {
        return {
            getScrollContainerDimensions: jasmine.createSpy<() => {
                scrollTop: number,
                scrollHeight: number,
                clientHeight: number
            }>('getScrollContainerDimensions').and.returnValue({
                scrollTop: 200,
                scrollHeight: 800,
                clientHeight: 300
            }),
            getDistanceFromBottom: jasmine.createSpy<() => number>('getDistanceFromBottom').and.returnValue(0),
            getLastOutboundMessageGeometry: jasmine.createSpy<() => { top: number, height: number } | null>('getLastOutboundMessageGeometry').and.returnValue(null),
            setScrollPosition: jasmine.createSpy<(scrollTop: number, smooth?: boolean) => void>('setScrollPosition'),
            setBottomPadding: jasmine.createSpy<(paddingPx: number) => void>('setBottomPadding'),
            onMessageAdded: jasmine.createSpy<(callback: (element: Element) => void) => void>('onMessageAdded'),
            onUserScroll: jasmine.createSpy<(callback: (scrollTop: number) => void) => void>('onUserScroll'),
            onContentSizeChanged: jasmine.createSpy<(callback: () => void) => void>('onContentSizeChanged'),
            onConversationEndVisibilityChanged: jasmine.createSpy<(callback: (isVisible: boolean) => void) => void>('onConversationEndVisibilityChanged'),
            getIsConversationEndVisible: jasmine.createSpy<() => boolean>('getIsConversationEndVisible').and.returnValue(true),
            unsubscribeAll: jasmine.createSpy<() => void>('unsubscribeAll')
        };
    }

    it('subscribes to API events on connect', () => {
        const api = createMockApi();
        const manager = new ChatConversationScrollManager(
            api as unknown as ChatConversationScrollApi,
            document.createElement('div')
        );

        manager.connect();

        expect(api.onMessageAdded).toHaveBeenCalled();
        expect(api.onUserScroll).toHaveBeenCalled();
        expect(api.onContentSizeChanged).toHaveBeenCalled();
        expect(api.onConversationEndVisibilityChanged).toHaveBeenCalled();
    });

    it('uses conversation end visibility to decide if resize should scroll', () => {
        const api = createMockApi();
        api.getIsConversationEndVisible.and.returnValue(false);

        let onContentSizeChanged!: () => void;
        let onEndVisibilityChanged!: (visible: boolean) => void;
        api.onContentSizeChanged.and.callFake(cb => {
            onContentSizeChanged = cb;
        });
        api.onConversationEndVisibilityChanged.and.callFake(cb => {
            onEndVisibilityChanged = cb;
        });

        const manager = new ChatConversationScrollManager(
            api as unknown as ChatConversationScrollApi,
            document.createElement('div')
        );

        manager.connect();

        onContentSizeChanged();
        expect(api.setScrollPosition).not.toHaveBeenCalled();

        onEndVisibilityChanged(true);
        onContentSizeChanged();
        expect(api.setScrollPosition).toHaveBeenCalledWith(800, false);
    });

    it('stops auto-scroll after user scrolls up and resumes when user scrolls back near bottom', () => {
        const api = createMockApi();

        let onContentSizeChanged!: () => void;
        let onUserScroll!: (scrollTop: number) => void;
        api.onContentSizeChanged.and.callFake(cb => {
            onContentSizeChanged = cb;
        });
        api.onUserScroll.and.callFake(cb => {
            onUserScroll = cb;
        });

        const manager = new ChatConversationScrollManager(
            api as unknown as ChatConversationScrollApi,
            document.createElement('div')
        );

        manager.connect();

        api.getDistanceFromBottom.and.returnValue(120);
        onUserScroll(100);
        api.setScrollPosition.calls.reset();

        onContentSizeChanged();
        expect(api.setScrollPosition).not.toHaveBeenCalled();

        api.getDistanceFromBottom.and.returnValue(5);
        onUserScroll(260);

        onContentSizeChanged();
        expect(api.setScrollPosition).toHaveBeenCalledWith(800, false);
    });

    it('scrolls to the last outbound message when one is added', () => {
        const api = createMockApi();
        api.getScrollContainerDimensions.and.returnValue({
            scrollTop: 0,
            scrollHeight: 600,
            clientHeight: 300
        });
        api.getLastOutboundMessageGeometry.and.returnValue({
            top: 200,
            height: 200
        });

        let onMessageAdded!: (element: Element) => void;
        api.onMessageAdded.and.callFake(cb => {
            onMessageAdded = cb;
        });

        spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
            cb(0);
            return 1;
        });

        const manager = new ChatConversationScrollManager(
            api as unknown as ChatConversationScrollApi,
            document.createElement('div')
        );

        manager.connect();

        onMessageAdded(document.createElement('spright-chat-message-outbound'));

        expect(api.setBottomPadding).toHaveBeenCalled();
        expect(api.setScrollPosition).toHaveBeenCalledWith(340, true);
    });

    it('uses viewport height for tall message anchoring with 20% line gap', () => {
        const api = createMockApi();
        api.getScrollContainerDimensions.and.returnValue({
            scrollTop: 0,
            scrollHeight: 1000,
            clientHeight: 500
        });
        api.getLastOutboundMessageGeometry.and.returnValue({
            top: 200,
            height: 300
        });

        let onMessageAdded!: (element: Element) => void;
        api.onMessageAdded.and.callFake(cb => {
            onMessageAdded = cb;
        });

        spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
            cb(0);
            return 1;
        });

        const manager = new ChatConversationScrollManager(
            api as unknown as ChatConversationScrollApi,
            document.createElement('div')
        );

        manager.connect();

        onMessageAdded(document.createElement('spright-chat-message-outbound'));

        expect(api.setBottomPadding).toHaveBeenCalledWith(400);
        expect(api.setScrollPosition).toHaveBeenCalledWith(400, true);
    });

    it('unsubscribes from API on disconnect', () => {
        const api = createMockApi();
        const manager = new ChatConversationScrollManager(
            api as unknown as ChatConversationScrollApi,
            document.createElement('div')
        );

        manager.disconnect();

        expect(api.unsubscribeAll).toHaveBeenCalled();
    });
});
