import { html, ref } from '@microsoft/fast-element';
import { AnchoredRegion, anchoredRegionTag } from '..';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import { createEventListener } from '../../utilities/tests/component';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

describe('Anchored Region', () => {
    it('should export its tag', () => {
        expect(anchoredRegionTag).toBe('nimble-anchored-region');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-anchored-region')).toBeInstanceOf(
            AnchoredRegion
        );
    });

    describe('target-out-of-view event', () => {
        let componentReferences: ComponentReferences;
        let scrollableElement: HTMLDivElement;
        let disconnect: () => Promise<void>;

        class ComponentReferences {
            public div1!: HTMLDivElement;
            public anchoredRegion!: AnchoredRegion;
        }

        async function setup(
            source: ComponentReferences
        ): Promise<Fixture<HTMLDivElement>> {
            return fixture<HTMLDivElement>(
                // prettier-ignore
                html`
                <div style="height: 100px; width: 100px; overflow: auto;">
                    <div style="height: 1000px; width: 1000px;">
                        <div ${ref('div1')} style="height: 20px; width: 20px;"></div>
                        <${anchoredRegionTag} ${ref('anchoredRegion')}></${anchoredRegionTag}>
                    </div>
                </div>
            `,
                { source }
            );
        }

        beforeEach(async () => {
            componentReferences = new ComponentReferences();
            let element: HTMLDivElement;
            let connect: () => Promise<void>;
            ({ element, connect, disconnect } = await setup(
                componentReferences
            ));
            scrollableElement = element;
            componentReferences.anchoredRegion.anchorElement = componentReferences.div1;

            await connect();
            await waitForUpdatesAsync();
        });

        afterEach(async () => {
            await disconnect();
        });

        async function scrollParent(options?: ScrollToOptions): Promise<void> {
            scrollableElement.scroll(options);
            await waitForUpdatesAsync();
        }

        it('emits when the target scrolls completely out of view vertically', async () => {
            const listener = createEventListener(
                componentReferences.anchoredRegion,
                'target-out-of-view'
            );
            await scrollParent({ top: 700 });

            expect(listener.spy).toHaveBeenCalled();
        });

        it('emits when the target scrolls completely out of view horizontally', async () => {
            const listener = createEventListener(
                componentReferences.anchoredRegion,
                'target-out-of-view'
            );
            await scrollParent({ left: 700 });

            expect(listener.spy).toHaveBeenCalled();
        });

        it('does not emit when the target scrolls partly out of view', async () => {
            const listener = createEventListener(
                componentReferences.anchoredRegion,
                'target-out-of-view'
            );
            await scrollParent({ left: 10 });
            expect(listener.spy).not.toHaveBeenCalled();
        });

        it('does not emit when previous target scrolls completely out of view', async () => {
            componentReferences.anchoredRegion.anchorElement = scrollableElement;
            const listener = createEventListener(
                componentReferences.anchoredRegion,
                'target-out-of-view'
            );
            await scrollParent({ left: 700 });
            expect(listener.spy).not.toHaveBeenCalled();
        });
    });
});
