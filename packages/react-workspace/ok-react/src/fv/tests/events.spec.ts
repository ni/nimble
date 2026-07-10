import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
    fvChipSelectorTag,
    OkFvChipSelector
} from '../chip-selector';
import type { FvChipSelectorChangeEvent } from '../chip-selector';
import {
    fvMasterDetailListTag,
    OkFvMasterDetailList
} from '../master-detail-list';
import type { FvMasterDetailListChangeEvent } from '../master-detail-list';
import {
    fvSplitButtonAnchorTag,
    OkFvSplitButtonAnchor
} from '../split-button-anchor';
import type {
    FvSplitButtonAnchorToggleEvent,
    FvSplitButtonAnchorTriggerEvent
} from '../split-button-anchor';
import {
    fvSplitButtonTag,
    OkFvSplitButton
} from '../split-button';
import type {
    FvSplitButtonToggleEvent,
    FvSplitButtonTriggerEvent
} from '../split-button';
import {
    fvSummaryPanelTag,
    OkFvSummaryPanel
} from '../summary-panel';
import type { FvSummaryPanelEditItemsEvent } from '../summary-panel';

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { value: true });

function getRequiredElement<T extends Element>(container: HTMLElement, selector: string): T {
    const element = container.querySelector<T>(selector);
    if (!element) {
        throw new Error(`Expected ${selector} to render`);
    }

    return element;
}

describe('OK React wrapper events', () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.append(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => {
            root.unmount();
        });
        container.remove();
    });

    function render(component: ReturnType<typeof createElement>): void {
        act(() => {
            root.render(component);
        });
    }

    it('passes chip selector changes to onChange', () => {
        const onChange = jasmine.createSpy<(event: FvChipSelectorChangeEvent) => void>('onChange');
        render(createElement(OkFvChipSelector, { onChange }));

        const element = getRequiredElement(container, fvChipSelectorTag);
        const event = new CustomEvent('change', { detail: { selectedValues: ['active'] } }) as unknown as FvChipSelectorChangeEvent;
        void act(() => element.dispatchEvent(event));

        expect(onChange).toHaveBeenCalledOnceWith(event);
    });

    it('passes master-detail list changes to onChange', () => {
        const onChange = jasmine.createSpy<(event: FvMasterDetailListChangeEvent) => void>('onChange');
        render(createElement(OkFvMasterDetailList, { onChange }));

        const element = getRequiredElement(container, fvMasterDetailListTag);
        const event = new CustomEvent('change', { detail: { item: null, value: null } }) as unknown as FvMasterDetailListChangeEvent;
        void act(() => element.dispatchEvent(event));

        expect(onChange).toHaveBeenCalledOnceWith(event);
    });

    it('passes split button trigger and toggle events to React handlers', () => {
        const onTrigger = jasmine.createSpy<(event: FvSplitButtonTriggerEvent) => void>('onTrigger');
        const onToggle = jasmine.createSpy<(event: FvSplitButtonToggleEvent) => void>('onToggle');
        render(createElement(OkFvSplitButton, { onTrigger, onToggle }));

        const element = getRequiredElement(container, fvSplitButtonTag);
        const triggerEvent = new CustomEvent('trigger') as unknown as FvSplitButtonTriggerEvent;
        const toggleEvent = new CustomEvent('toggle', { detail: { open: true } }) as unknown as FvSplitButtonToggleEvent;
        act(() => {
            element.dispatchEvent(triggerEvent);
            element.dispatchEvent(toggleEvent);
        });

        expect(onTrigger).toHaveBeenCalledOnceWith(triggerEvent);
        expect(onToggle).toHaveBeenCalledOnceWith(toggleEvent);
    });

    it('passes split button anchor trigger and toggle events to React handlers', () => {
        const onTrigger = jasmine.createSpy<(event: FvSplitButtonAnchorTriggerEvent) => void>('onTrigger');
        const onToggle = jasmine.createSpy<(event: FvSplitButtonAnchorToggleEvent) => void>('onToggle');
        render(createElement(OkFvSplitButtonAnchor, { onTrigger, onToggle }));

        const element = getRequiredElement(container, fvSplitButtonAnchorTag);
        const triggerEvent = new CustomEvent('trigger') as unknown as FvSplitButtonAnchorTriggerEvent;
        const toggleEvent = new CustomEvent('toggle', { detail: { open: true } }) as unknown as FvSplitButtonAnchorToggleEvent;
        act(() => {
            element.dispatchEvent(triggerEvent);
            element.dispatchEvent(toggleEvent);
        });

        expect(onTrigger).toHaveBeenCalledOnceWith(triggerEvent);
        expect(onToggle).toHaveBeenCalledOnceWith(toggleEvent);
    });

    it('passes summary panel edit events to onEditItems', () => {
        const onEditItems = jasmine.createSpy<(event: FvSummaryPanelEditItemsEvent) => void>('onEditItems');
        render(createElement(OkFvSummaryPanel, { onEditItems }));

        const element = getRequiredElement(container, fvSummaryPanelTag);
        const event = new CustomEvent('edit-items') as unknown as FvSummaryPanelEditItemsEvent;
        void act(() => element.dispatchEvent(event));

        expect(onEditItems).toHaveBeenCalledOnceWith(event);
    });
});