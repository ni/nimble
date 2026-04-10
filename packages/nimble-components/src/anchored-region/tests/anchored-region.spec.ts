import { html } from '@ni/fast-element';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { AnchoredRegion, anchoredRegionTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

async function setup(): Promise<Fixture<AnchoredRegion>> {
    return await fixture<AnchoredRegion>(
        html`<${anchoredRegionTag}></${anchoredRegionTag}>`
    );
}

describe('Anchored Region', () => {
    let element: AnchoredRegion;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let parent: HTMLElement;

    it('can construct an element instance', () => {
        expect(document.createElement(anchoredRegionTag)).toBeInstanceOf(
            AnchoredRegion
        );
    });

    describe('slot visibility', () => {
        async function waitUntilLoaded(
            region: AnchoredRegion
        ): Promise<void> {
            await waitForUpdatesAsync();
            await new Promise<void>(resolve => {
                region.addEventListener('loaded', () => {
                    resolve();
                });
            });
        }

        beforeEach(async () => {
            ({ element, connect, disconnect, parent } = await setup());

            const anchor = document.createElement('button');
            anchor.id = 'anchor';
            parent.insertBefore(anchor, element);

            element.setAttribute('anchor', 'anchor');
            element.setAttribute(
                'vertical-positioning-mode',
                'locktodefault'
            );
            element.setAttribute(
                'horizontal-positioning-mode',
                'locktodefault'
            );
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should hide slot content before region is loaded', async () => {
            await connect();

            const slot = element.shadowRoot!.querySelector('slot')!;
            expect(getComputedStyle(slot).display).toBe('none');
        });

        it('should not have "loaded" class before initial layout is complete', async () => {
            await connect();

            expect(element.classList.contains('loaded')).toBeFalse();
        });

        it('should add "loaded" class after region is loaded', async () => {
            await connect();
            await waitUntilLoaded(element);

            expect(element.classList.contains('loaded')).toBeTrue();
        });

        it('should show slot content after region is loaded', async () => {
            await connect();
            await waitUntilLoaded(element);
            await waitForUpdatesAsync();

            const slot = element.shadowRoot!.querySelector('slot')!;
            expect(getComputedStyle(slot).display).toBe('contents');
        });
    });
});
