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
        separator = element.shadowRoot!.querySelector<HTMLElement>('.splitter')!;
    });

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvSplitterTag)).toBeInstanceOf(FvSplitter);
    });

    it('exposes the vertical separator semantics and default position on the host', () => {
        expect(element.tabIndex).toBe(0);
        expect(separator.tabIndex).toBe(-1);
        expect(element.getAttribute('role')).toBe('separator');
        expect(element.getAttribute('aria-orientation')).toBe('vertical');
        expect(element.getAttribute('aria-label')).toBe('Resize panes');
        expect(element.getAttribute('aria-valuemin')).toBe('0');
        expect(element.getAttribute('aria-valuemax')).toBe('100');
        expect(element.getAttribute('aria-valuenow')).toBe('60');
        expect(element.getAttribute('aria-valuetext')).toBe('60 percent');
    });

    it('keeps keyboard focus on the semantic host', () => {
        element.focus();

        expect(document.activeElement).toBe(element);
        expect(element.shadowRoot!.activeElement).toBeNull();
    });

    it('forwards an accessible name and description of the current position', async () => {
        element.ariaLabel = 'Resize details pane';
        element.ariaControls = 'primary-pane';
        element.position = 59.3;
        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-label')).toBe('Resize details pane');
        expect(element.getAttribute('aria-controls')).toBe('primary-pane');
        expect(element.getAttribute('aria-valuenow')).toBe('59.3');
        expect(element.getAttribute('aria-valuetext')).toBe('59.3 percent');
    });

    it('uses arrow, Home, and End keys within the configured constraints', () => {
        element.position = 60;
        element.min = 20;
        element.max = 80;
        element.step = 5;

        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true }));
        expect(element.position).toBe(55);

        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
        expect(element.position).toBe(60);

        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', cancelable: true }));
        expect(element.position).toBe(20);

        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', cancelable: true }));
        expect(element.position).toBe(80);
    });

    it('moves the splitter with the physical arrow direction in RTL', () => {
        element.parentElement!.style.direction = 'rtl';
        element.position = 60;
        element.step = 5;

        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true }));
        expect(element.position).toBe(65);

        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
        expect(element.position).toBe(60);
    });

    it('emits input and change events for a keyboard adjustment', () => {
        const inputSpy = jasmine.createSpy();
        const changeSpy = jasmine.createSpy();
        element.addEventListener('input', inputSpy);
        element.addEventListener('change', changeSpy);

        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));

        expect(inputSpy).toHaveBeenCalledTimes(1);
        expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('tracks a primary pointer within the parent width and commits on release', () => {
        spyOn(element.parentElement!, 'getBoundingClientRect').and.returnValue({
            left: 100,
            right: 900,
            width: 800
        } as DOMRect);
        const inputSpy = jasmine.createSpy();
        const changeSpy = jasmine.createSpy();
        element.addEventListener('input', inputSpy);
        element.addEventListener('change', changeSpy);

        separator.dispatchEvent(
            new PointerEvent('pointerdown', { pointerId: -1, button: 0, isPrimary: true })
        );
        separator.dispatchEvent(
            new PointerEvent('pointermove', { pointerId: -1, clientX: 500, isPrimary: true })
        );
        separator.dispatchEvent(new PointerEvent('pointerup', { pointerId: -1, isPrimary: true }));

        expect(element.position).toBe(50);
        expect(element.resizing).toBeFalse();
        expect(inputSpy).toHaveBeenCalledTimes(1);
        expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('focuses the semantic host before starting a resize', () => {
        const focusSpy = spyOn(element, 'focus');

        separator.dispatchEvent(
            new PointerEvent('pointerdown', { pointerId: -1, button: 0, isPrimary: true })
        );

        expect(focusSpy).toHaveBeenCalled();
    });

    it('measures pointer position from inline-start in RTL', () => {
        element.parentElement!.style.direction = 'rtl';
        spyOn(element.parentElement!, 'getBoundingClientRect').and.returnValue({
            left: 100,
            right: 900,
            width: 800
        } as DOMRect);

        separator.dispatchEvent(
            new PointerEvent('pointerdown', { pointerId: -1, button: 0, isPrimary: true })
        );
        separator.dispatchEvent(
            new PointerEvent('pointermove', { pointerId: -1, clientX: 700, isPrimary: true })
        );

        expect(element.position).toBe(25);
    });

    it('restores the starting position when pointer resizing is canceled', () => {
        spyOn(element.parentElement!, 'getBoundingClientRect').and.returnValue({
            left: 0,
            width: 1000
        } as DOMRect);

        separator.dispatchEvent(
            new PointerEvent('pointerdown', { pointerId: -1, button: 0, isPrimary: true })
        );
        separator.dispatchEvent(
            new PointerEvent('pointermove', { pointerId: -1, clientX: 750, isPrimary: true })
        );
        separator.dispatchEvent(
            new PointerEvent('pointercancel', { pointerId: -1, isPrimary: true })
        );

        expect(element.position).toBe(60);
        expect(element.resizing).toBeFalse();
    });

    it('restores the starting position when pointer capture is lost', () => {
        spyOn(element.parentElement!, 'getBoundingClientRect').and.returnValue({
            left: 0,
            width: 1000
        } as DOMRect);

        separator.dispatchEvent(
            new PointerEvent('pointerdown', { pointerId: -1, button: 0, isPrimary: true })
        );
        separator.dispatchEvent(
            new PointerEvent('pointermove', { pointerId: -1, clientX: 750, isPrimary: true })
        );
        separator.dispatchEvent(
            new PointerEvent('lostpointercapture', { pointerId: -1, isPrimary: true })
        );

        expect(element.position).toBe(60);
        expect(element.resizing).toBeFalse();

        separator.dispatchEvent(
            new PointerEvent('pointerdown', { pointerId: -1, button: 0, isPrimary: true })
        );
        expect(element.resizing).toBeTrue();
    });

    it('reflects the active resize state onto the host', () => {
        separator.dispatchEvent(
            new PointerEvent('pointerdown', { pointerId: -1, button: 0, isPrimary: true })
        );

        expect(element.hasAttribute('resizing')).toBeTrue();

        separator.dispatchEvent(new PointerEvent('pointercancel', { pointerId: -1, isPrimary: true }));

        expect(element.hasAttribute('resizing')).toBeFalse();
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

    it('retains a requested position while synchronously widening the range', async () => {
        element.min = 25;
        element.max = 75;
        element.position = 75;

        element.position = 90;
        element.max = 100;
        await waitForUpdatesAsync();

        expect(element.position).toBe(90);
    });

    it('does not restore an obsolete constrained position after an explicit assignment', async () => {
        element.min = 25;
        element.max = 75;
        element.position = 90;
        element.position = 75;
        element.max = 100;
        await waitForUpdatesAsync();

        expect(element.position).toBe(75);
    });

    it('rejects non-primary pointers and concurrent pointer resizing', () => {
        spyOn(element.parentElement!, 'getBoundingClientRect').and.returnValue({
            left: 0,
            width: 1000
        } as DOMRect);

        separator.dispatchEvent(
            new PointerEvent('pointerdown', { pointerId: -1, button: 0, isPrimary: false })
        );
        expect(element.resizing).toBeFalse();

        separator.dispatchEvent(
            new PointerEvent('pointerdown', { pointerId: -1, button: 0, isPrimary: true })
        );
        separator.dispatchEvent(
            new PointerEvent('pointerdown', { pointerId: 2, button: 0, isPrimary: true })
        );
        separator.dispatchEvent(
            new PointerEvent('pointermove', { pointerId: 2, clientX: 200, isPrimary: true })
        );

        expect(element.position).toBe(60);
        expect(element.resizing).toBeTrue();
    });

    it('does not emit a change event when pointer resizing does not change position', () => {
        const changeSpy = jasmine.createSpy();
        element.addEventListener('change', changeSpy);

        separator.dispatchEvent(
            new PointerEvent('pointerdown', { pointerId: -1, button: 0, isPrimary: true })
        );
        separator.dispatchEvent(new PointerEvent('pointerup', { pointerId: -1, isPrimary: true }));

        expect(changeSpy).not.toHaveBeenCalled();
    });

    it('normalizes invalid bounds and exposes the effective range in ARIA', async () => {
        element.min = 120;
        element.max = -20;
        element.position = 50;
        await waitForUpdatesAsync();

        expect(element.position).toBe(100);
        expect(element.getAttribute('aria-valuemin')).toBe('100');
        expect(element.getAttribute('aria-valuemax')).toBe('100');

        element.min = 80;
        element.max = 20;
        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-valuemin')).toBe('80');
        expect(element.getAttribute('aria-valuemax')).toBe('80');
    });
});