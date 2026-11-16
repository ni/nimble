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
    globalThis.window.OkBlazor.setProperty(element, 'message', null);
    assert.equal(element.message, undefined);
    const maskOptions = { mask: [/\d/, '-', /\d/] };
    globalThis.window.OkBlazor.setProperty(element, 'maskOptions', maskOptions);
    assert.equal(element.maskOptions, maskOptions);
    globalThis.window.OkBlazor.setProperty(element, 'maskOptions', null);
    assert.equal(element.maskOptions, undefined);
    const target = { getAttribute: name => (name === 'data-ok-fv-event-source' ? 'source' : null) };
    assert.deepEqual(handlers.get('okfvmultiselectinput').createEventArgs({
        target: { ...target, localName: 'ok-fv-multi-select', selectedValues: ['a'] }
    }), { selectedValues: ['a'], isMultiSelect: true, source: 'source' });
    assert.deepEqual(handlers.get('okfveditfilter').createEventArgs({
        target,
        detail: { query: { version: 1, root: null } }
    }), { query: { version: 1, root: null }, source: 'source' });
    assert.deepEqual(handlers.get('okfvtoggle').createEventArgs({ target, detail: { open: true } }), { open: true, source: 'source' });
    assert.deepEqual(handlers.get('okfvlistchange').createEventArgs({ target, detail: { value: 'a' } }), { value: 'a', source: 'source' });
    assert.deepEqual(handlers.get('okfvpositionchange').createEventArgs({
        target: { ...target, position: 40 }
    }), { position: 40, source: 'source' });
    assert.equal(handlers.get('okfvsave').browserEventName, 'save');
    assert.deepEqual(handlers.get('okfvsave').createEventArgs({ target }), { source: 'source' });
    assert.doesNotThrow(() => handlers.get('okfvtoggle').createEventArgs({}));
    assert.doesNotThrow(() => handlers.get('okfvchipchange').createEventArgs({}));
    assert.deepEqual(handlers.get('okfvmultiselectinput').createEventArgs({
        target: { ...target, selectedValues: 'wrong' }
    }), { selectedValues: undefined, isMultiSelect: false, source: 'source' });
    assert.deepEqual(handlers.get('okfvpositioninput').createEventArgs({
        target: { ...target, position: 'wrong' }
    }), { position: undefined, source: 'source' });
});
