import type { Meta, StoryFn } from '@storybook/html-vite';
import { fvExpandableChipTag } from '@ni/ok-components/dist/esm/fv/expandable-chip';
import { fvMultiSelectTag } from '@ni/ok-components/dist/esm/fv/multi-select';
import { fvQueryBuilderTag } from '@ni/ok-components/dist/esm/fv/query-builder';
import { fvQueryEditorTag } from '@ni/ok-components/dist/esm/fv/query-editor';
import { queryBuilderDefinition, queryBuilderSavedPresets } from './fixtures';

const metadata: Meta = { title: 'Tests Ok/Query Review Lab' };
export default metadata;

export const interactive: StoryFn = () => {
    const app = document.createElement('main');
    app.style.cssText = 'font: 14px sans-serif; max-width: 900px; margin: 24px auto; padding: 16px; line-height: 1.5';
    app.innerHTML = `
        <h1>Query review lab</h1>
        <p>Experiments use the current components and in-memory data. They do not change saved queries on a server.</p>
        <section>
            <h2>1. Detached chip</h2>
            <p>Create a chip, detach it, then change its controls attribute. Check for an exception.</p>
            <button type="button" data-test="detached">Run detached-chip check</button>
            <output data-result="detached"></output>
        </section>
        <section>
            <h2>2. Accessibility relationship</h2>
            <p>Assign a controlled element, then clear it. Check whether the button still references the old element.</p>
            <button type="button" data-test="relationship">Run relationship check</button>
            <output data-result="relationship"></output>
        </section>
        <section>
            <h2>3. Scaling checks</h2>
            <p>Measure query-editor condition rendering and multi-select selected-label lookup.
            Run multiple times; timings depend on this browser and machine.</p>
            <button type="button" data-test="performance">Run scaling checks</button>
            <output data-result="performance"></output>
        </section>
        <section>
            <h2>4. Delete confirmation</h2>
            <p>Open the Queries menu and select <strong>Sample saved query</strong>. Open the Queries menu again,
            choose <strong>Edit saved query</strong>, then choose Delete from the editor's action menu.
            Confirm or cancel in the modal dialog.</p>
            <output data-result="delete" aria-live="polite"></output>
            <div data-slot="builder"></div>
        </section>
    `;
    const result = (name: string): HTMLOutputElement => app.querySelector(`[data-result="${name}"]`)!;
    const button = (name: string): HTMLButtonElement => app.querySelector(`[data-test="${name}"]`)!;

    button('detached').addEventListener('click', () => {
        const chip = document.createElement(fvExpandableChipTag);
        app.append(chip);
        chip.remove();
        try {
            chip.controls = 'missing-dialog';
            result('detached').textContent = ' No exception.';
        } catch (error) {
            result('detached').textContent = ` Exception: ${String(error)}`;
        }
    });

    button('relationship').addEventListener('click', () => {
        const target = document.createElement('div');
        const chip = document.createElement(fvExpandableChipTag);
        app.append(target, chip);
        const control = chip.shadowRoot?.querySelector<HTMLButtonElement>('button');
        if (!control || !('ariaControlsElements' in control)) {
            result('relationship').textContent = ' ariaControlsElements is unavailable in this browser.';
        } else {
            chip.controlsElement = target;
            const before = control.ariaControlsElements?.includes(target) ?? false;
            chip.controlsElement = undefined;
            const after = control.ariaControlsElements?.includes(target) ?? false;
            result('relationship').textContent = ` References target before clearing: ${before}; after: ${after}.`;
        }
        chip.remove();
        target.remove();
    });

    button('performance').addEventListener('click', () => {
        const editor = document.createElement(fvQueryEditorTag);
        const conditions = [250, 500, 1000].map(size => {
            editor.editorTokens = Array.from({ length: size }, (_, index) => ({
                kind: 'condition' as const,
                groupId: 'root',
                rule: {
                    id: `rule-${index}`,
                    revision: 0,
                    fieldId: 'duration',
                    operatorId: 'greater-than',
                    operand: { kind: 'scalar' as const, value: index }
                }
            }));
            const start = performance.now();
            const count = editor.parts.length;
            return `${size}: ${(performance.now() - start).toFixed(1)} ms (${count} parts)`;
        });
        const select = document.createElement(fvMultiSelectTag);
        const options = [1000, 2000, 4000].map(size => {
            select.options = Array.from({ length: size }, (_, index) => ({ value: `${index}`, label: `Option ${index}` }));
            select.selectedValues = select.options.map(option => option.value);
            const start = performance.now();
            const text = select.displayValue;
            const elapsed = performance.now() - start;
            return `${size}: ${elapsed.toFixed(1)} ms (${text.length} characters)`;
        });
        result('performance').textContent = ` Conditions: ${conditions.join('; ')}. Selected options: ${options.join('; ')}.`;
    });

    const builder = document.createElement(fvQueryBuilderTag);
    builder.label = 'Queries';
    builder.definition = queryBuilderDefinition;
    builder.savedQueries = [{
        id: 'sample', name: 'Sample saved query', document: structuredClone(queryBuilderSavedPresets.failedProduction)
    }];
    builder.allowSavedQueryEditing = true;
    builder.allowSavedQueryDeletion = true;
    builder.deleteHandler = async () => {
        await Promise.resolve();
        result('delete').textContent = ' In-memory delete handler called.';
    };
    app.querySelector('[data-slot="builder"]')!.append(builder);
    return app;
};
