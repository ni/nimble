import assert from 'node:assert/strict';
import { test } from 'node:test';

test('FV event registration and object properties', async () => {
    globalThis.window = {};
    const handlers = new Map();
    const module = await import('../wwwroot/OkBlazor.lib.module.js');
    module.afterWebStarted({
        registerCustomEventType: (name, handler) => handlers.set(name, handler)
    });

    const element = {};
    globalThis.window.OkBlazor.setProperty(element, 'options', [{ value: 'a', label: 'A' }]);
    assert.deepEqual(element.options, [{ value: 'a', label: 'A' }]);
    assert.deepEqual(handlers.get('okfvmultiselectinput').createEventArgs({
        target: { localName: 'ok-fv-multi-select', selectedValues: ['a'] }
    }), { selectedValues: ['a'], isMultiSelect: true });
    assert.deepEqual(handlers.get('okfveditfilter').createEventArgs({
        detail: { query: { version: 1, root: null } }
    }), { query: { version: 1, root: null } });
    assert.deepEqual(handlers.get('okfvtoggle').createEventArgs({ detail: { open: true } }), { open: true });
    assert.deepEqual(handlers.get('okfvpositionchange').createEventArgs({
        target: { localName: 'ok-fv-split-layout', position: 40 }
    }), { position: 40, source: 'ok-fv-split-layout' });
    assert.equal(handlers.get('okfvsave').browserEventName, 'save');
    assert.doesNotThrow(() => handlers.get('okfvtoggle').createEventArgs({}));
    assert.doesNotThrow(() => handlers.get('okfvchipchange').createEventArgs({}));
});
