import { TooltipPosition } from '@ni/fast-foundation';
import { html } from '@ni/fast-element';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { Tooltip, tooltipTag } from '..';
import { anchoredRegionTag } from '../../anchored-region';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { iconExclamationMarkTag } from '../../icons/exclamation-mark';
import { iconInfoTag } from '../../icons/info';

async function setup(): Promise<Fixture<Tooltip>> {
    return await fixture<Tooltip>(html`<${tooltipTag}></${tooltipTag}>`);
}

describe('Tooltip', () => {
    let parent: HTMLElement;
    let element: Tooltip;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    function isIconVisible(elementName: string): boolean {
        const iconElement = element.shadowRoot?.querySelector(elementName);
        if (!iconElement) {
            throw new Error(`Cannot find icon with name ${elementName}`);
        }
        const display = window.getComputedStyle(iconElement).display;
        if (typeof display !== 'string' || display === '') {
            throw new Error(
                `Invalid display value was calcualted for ${elementName}`
            );
        }
        return display !== 'none';
    }

    async function waitUntilAnchoredRegionLoaded(
        tooltip: Tooltip
    ): Promise<void> {
        await waitForUpdatesAsync();
        const region = tooltip.shadowRoot!.querySelector(anchoredRegionTag)!;
        await new Promise<void>((resolve, _reject) => {
            region.addEventListener('loaded', () => {
                resolve();
            });
        });
    }

    beforeEach(async () => {
        ({ element, connect, disconnect, parent } = await setup());
        const button = document.createElement('button');
        button.id = 'anchor';

        const button2 = document.createElement('button');
        button2.id = 'anchor2';

        parent.insertBefore(button, element);
        parent.insertBefore(button2, element);

        element.setAttribute('anchor', 'anchor');
        element.id = 'tooltip';
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(tooltipTag)).toBeInstanceOf(Tooltip);
    });

    it('should not render the tooltip by default', async () => {
        element.delay = 0;

        await connect();
        await waitForUpdatesAsync();

        expect(element.visible).toBeUndefined();
        expect(element.shadowRoot?.querySelector(anchoredRegionTag)).toBeNull();

        await disconnect();
    });

    it('should render the tooltip when visible is true', async () => {
        element.visible = true;
        element.delay = 0;

        await connect();
        await waitForUpdatesAsync();

        expect(element.visible).toBe(true);
        expect(
            element.shadowRoot?.querySelector(anchoredRegionTag)
        ).not.toBeNull();

        await disconnect();
    });

    it('should not render the tooltip when visible is false', async () => {
        element.visible = false;
        element.delay = 0;

        await connect();
        await waitForUpdatesAsync();

        expect(element.visible).toBe(false);
        expect(element.shadowRoot?.querySelector(anchoredRegionTag)).toBeNull();

        await disconnect();
    });

    it('should set positioning mode to dynamic by default', async () => {
        await connect();

        expect(element.verticalPositioningMode).toEqual('dynamic');
        expect(element.horizontalPositioningMode).toEqual('dynamic');

        await disconnect();
    });

    it("should set update mode to 'anchor' by default", async () => {
        await connect();

        expect(element.autoUpdateMode).toEqual('anchor');

        await disconnect();
    });

    it("should set horizontal position to 'center' and vertical position to 'undefined' by default", async () => {
        await connect();

        expect(element.verticalDefaultPosition).toEqual(undefined);
        expect(element.horizontalDefaultPosition).toEqual('center');

        await disconnect();
    });

    it('should set horizontal scaling and vertical scaling to match content by default', async () => {
        await connect();

        expect(element.verticalScaling).toEqual('content');
        expect(element.horizontalScaling).toEqual('content');

        await disconnect();
    });

    it('should render the default state when selected', async () => {
        element.visible = true;

        await connect();
        await waitUntilAnchoredRegionLoaded(element);

        expect(isIconVisible(iconExclamationMarkTag)).toBeFalse();
        expect(isIconVisible(iconInfoTag)).toBeFalse();

        await disconnect();
    });

    it('should render the default state when selected and not render an icon when true', async () => {
        element.visible = true;
        element.iconVisible = true;

        await connect();
        await waitUntilAnchoredRegionLoaded(element);

        expect(isIconVisible(iconExclamationMarkTag)).toBeFalse();
        expect(isIconVisible(iconInfoTag)).toBeFalse();

        await disconnect();
    });

    it('should render the error severity when selected', async () => {
        element.visible = true;
        element.severity = 'error';

        await connect();
        await waitUntilAnchoredRegionLoaded(element);

        expect(isIconVisible(iconExclamationMarkTag)).toBeFalse();
        expect(isIconVisible(iconInfoTag)).toBeFalse();

        await disconnect();
    });

    it('should render the error severity when selected and render the corresponding icon when true', async () => {
        element.visible = true;
        element.severity = 'error';
        element.iconVisible = true;

        await connect();
        await waitUntilAnchoredRegionLoaded(element);

        expect(isIconVisible(iconExclamationMarkTag)).toBeTrue();
        expect(isIconVisible(iconInfoTag)).toBeFalse();

        await disconnect();
    });

    it('should render the information severity when selected', async () => {
        element.visible = true;
        element.severity = 'information';

        await connect();
        await waitUntilAnchoredRegionLoaded(element);

        expect(isIconVisible(iconExclamationMarkTag)).toBeFalse();
        expect(isIconVisible(iconInfoTag)).toBeFalse();

        await disconnect();
    });

    it('should render the information severity when selected and render the corresponding icon when true', async () => {
        element.visible = true;
        element.severity = 'information';
        element.iconVisible = true;

        await connect();
        await waitUntilAnchoredRegionLoaded(element);

        expect(isIconVisible(iconExclamationMarkTag)).toBeFalse();
        expect(isIconVisible(iconInfoTag)).toBeTrue();

        await disconnect();
    });

    it('should set vertical and horizontal positioning mode to locktodefault when position is set to top', async () => {
        element.position = TooltipPosition.top;

        await connect();

        expect(element.verticalPositioningMode).toEqual('locktodefault');
        expect(element.horizontalPositioningMode).toEqual('locktodefault');

        await disconnect();
    });

    it('should set default vertical position to top when position is set to top', async () => {
        element.position = TooltipPosition.top;

        await connect();

        expect(element.verticalDefaultPosition).toEqual('top');
        expect(element.horizontalDefaultPosition).toEqual('center');

        await disconnect();
    });

    it('should set scaling to match content when position is set to top', async () => {
        element.position = TooltipPosition.top;

        await connect();

        expect(element.verticalScaling).toEqual('content');
        expect(element.horizontalScaling).toEqual('content');

        await disconnect();
    });

    it('should set vertical positioning mode to locked when position is set to bottom', async () => {
        element.position = TooltipPosition.bottom;

        await connect();

        expect(element.verticalPositioningMode).toEqual('locktodefault');
        expect(element.horizontalPositioningMode).toEqual('locktodefault');

        await disconnect();
    });

    it('should set default vertical position to bottom when position is set to bottom', async () => {
        element.position = TooltipPosition.bottom;

        await connect();

        expect(element.verticalDefaultPosition).toEqual('bottom');
        expect(element.horizontalDefaultPosition).toEqual('center');

        await disconnect();
    });

    it('should set horizontal scaling to match anchor and vertical scaling to match content when position is set to bottom', async () => {
        element.position = TooltipPosition.bottom;

        await connect();

        expect(element.verticalScaling).toEqual('content');
        expect(element.horizontalScaling).toEqual('content');

        await disconnect();
    });

    it('should set positioning mode to locked when position is set to left', async () => {
        element.position = TooltipPosition.left;

        await connect();

        expect(element.verticalPositioningMode).toEqual('locktodefault');
        expect(element.horizontalPositioningMode).toEqual('locktodefault');

        await disconnect();
    });

    it('should set default horizontal position to left when position is set to left', async () => {
        element.position = TooltipPosition.left;

        await connect();

        expect(element.verticalDefaultPosition).toEqual('center');
        expect(element.horizontalDefaultPosition).toEqual('left');

        await disconnect();
    });

    it('should set vertical scaling to match content when position is set to bottom', async () => {
        element.position = TooltipPosition.left;

        await connect();

        expect(element.verticalScaling).toEqual('content');
        expect(element.horizontalScaling).toEqual('content');

        await disconnect();
    });

    it('should set positioning mode to locked when position is set to right', async () => {
        element.position = TooltipPosition.right;

        await connect();

        expect(element.verticalPositioningMode).toEqual('locktodefault');
        expect(element.horizontalPositioningMode).toEqual('locktodefault');

        await disconnect();
    });

    it('should set default horizontal position to right when position is set to right', async () => {
        element.position = TooltipPosition.right;

        await connect();

        expect(element.verticalDefaultPosition).toEqual('center');
        expect(element.horizontalDefaultPosition).toEqual('right');

        await disconnect();
    });

    it('should set scaling to match content when position is set to right', async () => {
        element.position = TooltipPosition.right;

        await connect();

        expect(element.verticalScaling).toEqual('content');
        expect(element.horizontalScaling).toEqual('content');

        await disconnect();
    });

    it('should set viewport lock attributes to undefined(false) by default', async () => {
        await connect();

        expect(element.verticalViewportLock).toBeUndefined();
        expect(element.horizontalViewportLock).toBeUndefined();

        await disconnect();
    });

    it('should change anchor element when the anchor attribute changes', async () => {
        await connect();

        expect(element.anchorElement?.id).toEqual('anchor');
        element.setAttribute('anchor', 'anchor2');
        expect(element.anchorElement?.id).toEqual('anchor2');

        await disconnect();
    });
});
