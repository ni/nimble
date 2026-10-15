import { BulkEditState } from '..';

interface Record {
    id: string;
    name: string;
    location: string;
}

type Field = 'name' | 'location';

const records: readonly Record[] = [
    { id: '1', name: 'One', location: 'Austin' },
    { id: '2', name: 'Two', location: 'Austin' },
    { id: '3', name: 'Three', location: 'Boston' }
];

function createState(): BulkEditState<Record, Field> {
    return new BulkEditState({
        records,
        id: record => record.id,
        read: (record, field) => record[field]
    });
}

describe('BulkEditState', () => {
    it('reports common and mixed values', () => {
        const state = createState();
        state.select(['1', '2']);

        expect(state.field('location')).toEqual({
            value: 'Austin',
            mixed: false,
            pending: false,
            willClear: false
        });
        expect(state.field('name')).toEqual({
            value: '',
            mixed: true,
            pending: false,
            willClear: false
        });
    });

    it('distinguishes blank input, explicit clear, reset, and revert', () => {
        const state = createState();
        state.select(['1']);

        state.edit('name', 'Updated');
        state.edit('name', '');
        expect(state.changes).toEqual({});

        state.clear('name');
        expect(state.field('name').willClear).toBeTrue();
        state.resetField('name');
        expect(state.changes).toEqual({});

        state.edit('name', 'Updated');
        state.edit('location', 'Paris');
        state.revert();
        expect(state.changes).toEqual({});
    });

    it('does not clear pending values when the same selection is proposed', () => {
        const state = createState();
        state.select(['1', '2']);
        state.edit('location', 'Paris');

        expect(state.isSelection(['2', '1'])).toBeTrue();
        state.select(['2', '1']);

        expect(state.changes).toEqual({ location: 'Paris' });
    });

    it('clears pending values only when a changed selection is applied', () => {
        const state = createState();
        state.select(['1']);
        state.edit('name', 'Updated');
        const proposed = ['2'];

        expect(state.selectedIds).toEqual(['1']);
        expect(state.isSelection(proposed)).toBeFalse();
        state.select(proposed);

        expect(state.selectedIds).toEqual(['2']);
        expect(state.changes).toEqual({});
    });

    it('projects and merges visible selection while preserving hidden IDs', () => {
        const state = createState();
        state.select(['1', '3']);

        expect(state.visibleSelection(['1', '2'])).toEqual(['1']);
        expect(state.mergeVisible(['1', '2'], ['2'])).toEqual(['3', '2']);
        expect(state.mergeVisible(['1', '2'], ['2'], true)).toEqual(['1', '3', '2']);
    });

    it('creates an immutable commit containing only actually affected records', () => {
        const state = createState();
        state.select(['1', '2']);
        state.edit('location', 'Austin');
        state.edit('name', 'One');

        const commit = state.createCommit();

        expect(commit.selectedIds).toEqual(['1', '2']);
        expect(commit.changes).toEqual({ name: 'One' });
        expect(commit.affectedRecords).toEqual([records[1]!]);
        state.edit('name', 'Later');
        expect(commit.changes).toEqual({ name: 'One' });
    });

    it('retains selection and clears changes after a successful commit', () => {
        const state = createState();
        state.select(['1']);
        state.edit('name', 'Updated');

        state.commitSucceeded([{ ...records[0]!, name: 'Updated' }, records[1]!, records[2]!]);

        expect(state.selectedIds).toEqual(['1']);
        expect(state.changes).toEqual({});
        expect(state.field('name').value).toBe('Updated');
    });

    it('leaves state untouched until commitSucceeded is called', () => {
        const state = createState();
        state.select(['1']);
        state.edit('name', 'Updated');

        state.createCommit();

        expect(state.selectedIds).toEqual(['1']);
        expect(state.changes).toEqual({ name: 'Updated' });
    });

    it('keeps a blank draft visible without scheduling a mutation', () => {
        const state = createState();
        state.select(['1']);
        state.edit('name', '');
        expect(state.field('name').value).toBe('');
        expect(state.changes).toEqual({});
        state.edit('name', '   ');
        expect(state.changes).toEqual({});
        state.resetField('name');
        expect(state.field('name').value).toBe('One');
    });

    it('does not mark a common saved value or an already empty field as pending', () => {
        const state = createState();
        state.select(['1', '2']);
        state.edit('location', 'Austin');
        expect(state.field('location').pending).toBeFalse();
        state.select([]);
        state.edit('name', 'No selection');
        state.clear('location');
        expect(state.changes).toEqual({});
    });
});
