import type { QueryDocument } from '@ni/ok-components/dist/esm/fv/query-editor';
import { queryBuilderPresets } from '../query-builder/fixtures';

export const queryEditorPresets = {
    ...queryBuilderPresets,
    deeplyNested: {
        version: 1,
        root: {
            kind: 'group',
            combinator: 'and',
            children: [
                queryBuilderPresets.basic.root!,
                {
                    kind: 'group',
                    combinator: 'or',
                    children: [
                        queryBuilderPresets.saved.root!,
                        {
                            kind: 'group',
                            combinator: 'and',
                            children: [
                                { kind: 'predicate', fieldId: 'duration', operatorId: 'greater-than', value: 500 },
                                {
                                    kind: 'group',
                                    combinator: 'or',
                                    children: [
                                        { kind: 'predicate', fieldId: 'workspace', operatorId: 'is', value: 'production' },
                                        {
                                            kind: 'group',
                                            combinator: 'and',
                                            children: [
                                                { kind: 'predicate', fieldId: 'duration', operatorId: 'greater-than', value: 1000 },
                                                { kind: 'predicate', fieldId: 'workspace', operatorId: 'is', value: 'staging' }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
} satisfies { readonly [name: string]: QueryDocument };
