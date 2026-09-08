import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture } from '../../../utilities/tests/fixture';
import { FvSplitter, fvSplitterTag } from '..';

describe('FvSplitter', () => {
    let element: FvSplitter;
    let separator: HTMLElement;
    let disconnect: (() => Promise<void>) | undefined;

    beforeEach(async () => {
        let connect: () => Promise<void>;
        ({ element, connect, disconnect } = await fixture<FvSplitter>(html`
            <${fvSplitterTag}></${fvSplitterTag}>
        `));
        await connect();
        separator = element.shadowRoot!.querySelector<HTMLElement>('[role="separator"]')!;
    });

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvSplitterTag)).toBeInstanceOf(FvSplitter);
    });

    it('exposes the vertical separator semantics and default position', () => {
        expect(separator.tabIndex).toBe(0);
        expect(separator.getAttribute('aria-orientation')).toBe('vertical');
        expect(separator.getAttribute('aria-label')).toBe('Resize panes');
        expect(separator.getAttribute('aria-valuemin')).toBe('0');
        expect(separator.getAttribute('aria-valuemax')).toBe('100');
        expect(separator.getAttribute('aria-valuenow')).toBe('60');
        expect(separator.getAttribute('aria-valuetext')).toBe('60 percent');
    });

    it('forwards an accessible name and description of the current position', async () => {
        element.ariaLabel = 'Resize details pane';
        element.position = 59.3;
        await waitForUpdatesAsync();

        expect(separator.getAttribute('aria-label')).toBe('Resize details pane');
        expect(separator.getAttribute('aria-valuenow')).toBe('59.3');
        expect(separator.getAttribute('aria-valuetext')).toBe('59 percent');
    });

    it('uses arrow, Home, and End keys within the configured constraints', () => {
        element.position = 60;
        element.min = 20;
        element.max = 80;
        element.step = 5;

        separator.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true }));
        expect(element.position).toBe(55);

        separator.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
        expect(element.position).toBe(60);

        separator.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', cancelable: true }));
        expect(element.position).toBe(20);

        separator.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', cancelable: true }));
        expect(element.position).toBe(80);
    });

    it('emits input and change events for a keyboard adjustment', () => {
        const inputSpy = jasmine.createSpy();
        const changeSpy = jasmine.createSpy();
        element.addEventListener('input', inputSpy);
        element.addEventListener('change', changeSpy);

        separator.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));

        expect(inputSpy).toHaveBeenCalledTimes(1);
        expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('tracks a primary pointer within the parent width and commits on release', () => {
        spyOn(element.parentElement!, 'getBoundingClientRect').and.returnValue({
            left: 100,
            width: 800
        } as DOMRect);
        const inputSpy = jasmine.createSpy();
        const changeSpy = jasmine.createSpy();
        element.addEventListener('input', inputSpy);
        element.addEventListener('change', changeSpy);

        separator.dispatchEvent(new PointerEvent('pointerdown', { pointerId: -1, button: 0 }));
        separator.dispatchEvent(new PointerEvent('pointermove', { pointerId: -1, clientX: 500 }));
        separator.dispatchEvent(new PointerEvent('pointerup', { pointerId: -1 }));

        expect(element.position).toBe(50);
        expect(element.resizing).toBeFalse();
        expect(inputSpy).toHaveBeenCalledTimes(1);
        expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('restores the starting position when pointer resizing is canceled', () => {
        spyOn(element.parentElement!, 'getBoundingClientRect').and.returnValue({
            left: 0,
            width: 1000
        } as DOMRect);

        separator.dispatchEvent(new PointerEvent('pointerdown', { pointerId: -1, button: 0 }));
        separator.dispatchEvent(new PointerEvent('pointermove', { pointerId: -1, clientX: 750 }));
        separator.dispatchEvent(new PointerEvent('pointercancel', { pointerId: -1 }));

        expect(element.position).toBe(60);
        expect(element.resizing).toBeFalse();
    });

    it('clamps programmatic positions to min and max', async () => {
        element.min = 25;
        element.max = 75;
        element.position = 90;
        await waitForUpdatesAsync();
        expect(element.position).toBe(75);

        element.position = 10;
        await waitForUpdatesAsync();
        expect(element.position).toBe(25);
    });
});