import { DOM } from '@ni/fast-element';
import { fixture } from '../../utilities/tests/fixture';
import { anchoredRegionTag, AnchoredRegion } from '..';

interface AnchoredRegionTestSetup {
    element: AnchoredRegion;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    content: HTMLDivElement;
}

async function setup(): Promise<AnchoredRegionTestSetup> {
    const { element, connect, disconnect, parent } = await fixture<AnchoredRegion>(`<${anchoredRegionTag}></${anchoredRegionTag}>`);

    const button = document.createElement('button');
    const content = document.createElement('div');

    button.id = 'anchor';
    button.setAttribute('style', 'width: 100px; height: 100px;');

    content.id = 'content';
    content.setAttribute('style', 'width: 100px; height: 100px;');

    parent.id = 'viewport';
    parent.setAttribute('style', 'width: 1000px; height: 1000px;');
    parent.insertBefore(button, element);

    element.appendChild(content);
    element.setAttribute('viewport', 'viewport');
    element.setAttribute('anchor', 'anchor');
    element.id = 'region';

    return { element, connect, disconnect, content };
}

describe('Anchored Region', () => {
    it("should set positioning modes to 'uncontrolled' by default", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.verticalPositioningMode).toEqual('uncontrolled');
        expect(element.horizontalPositioningMode).toEqual('uncontrolled');

        await disconnect();
    });

    it('should assign anchor and viewport elements by id', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        await DOM.nextUpdate();

        expect(element.anchorElement?.id).toEqual('anchor');
        expect(element.viewportElement?.id).toEqual('viewport');

        await disconnect();
    });

    it('should be sized to match content by default', async () => {
        const { element, connect, disconnect, content } = await setup();

        await connect();
        await DOM.nextUpdate();

        expect(element.clientHeight).toEqual(content.clientHeight);
        expect(element.clientWidth).toEqual(content.clientWidth);

        await disconnect();
    });
});
