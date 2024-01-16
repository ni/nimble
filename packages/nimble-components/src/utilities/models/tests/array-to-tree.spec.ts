/**
 * [Nimble]
 * Copied from https://github.com/philipstanislaus/performant-array-to-tree/blob/ae56091b76de0065949bdf228096010e8c0117f7/src/arrayToTree.spec.ts
 * with the following changes:
 * - Use jasmine instead of chai
 */

import { arrayToTree, countNodes } from '../array-to-tree';

describe('arrayToTree', () => {
    it('should work with nested objects', () => {
        expect(
            arrayToTree(
                [
                    { id: '4', parentId: null, custom: 'abc' },
                    { id: '31', parentId: '4', custom: '12' },
                    { id: '1941', parentId: '418', custom: 'de' },
                    { id: '1', parentId: '418', custom: 'ZZZz' },
                    { id: '418', parentId: null, custom: 'ü' }
                ],
                { id: 'id', parentId: 'parentId' }
            )
        ).toEqual([
            {
                clientRecord: { id: '4', parentId: null, custom: 'abc' },
                subRows: [
                    {
                        clientRecord: { id: '31', parentId: '4', custom: '12' },
                        subRows: [],
                        originalIndex: 1
                    }
                ],
                originalIndex: 0
            },
            {
                clientRecord: { id: '418', parentId: null, custom: 'ü' },
                subRows: [
                    {
                        clientRecord: {
                            id: '1941',
                            parentId: '418',
                            custom: 'de'
                        },
                        subRows: [],
                        originalIndex: 2
                    },
                    {
                        clientRecord: {
                            id: '1',
                            parentId: '418',
                            custom: 'ZZZz'
                        },
                        subRows: [],
                        originalIndex: 3
                    }
                ],
                originalIndex: 4
            }
        ]);
    });

    it('should throw circular parent child relations are encountered', () => {
        expect(() => arrayToTree(
            [
                { id: '4', parentId: '31', custom: 'abc' },
                { id: '31', parentId: '4', custom: '12' }
            ],
            { id: 'id', parentId: 'parentId' }
        )).toThrowError(
            'The items array contains nodes with a circular parent/child relationship.'
        );

        expect(() => arrayToTree(
            [
                { id: '4', parentId: '31', custom: 'abc' },
                { id: '31', parentId: '5', custom: '12' },
                { id: '5', parentId: '4', custom: '12' }
            ],
            { id: 'id', parentId: 'parentId' }
        )).toThrowError(
            'The items array contains nodes with a circular parent/child relationship.'
        );
    });

    it('should treat objects with missing parentId as root objects', () => {
        expect(
            arrayToTree(
                [
                    { id: '4', custom: 'abc' },
                    { id: '31', parentId: '4', custom: '12' },
                    { id: '1941', parentId: '418', custom: 'de' },
                    { id: '1', parentId: '418', custom: 'ZZZz' },
                    { id: '418', custom: 'ü' }
                ],
                { id: 'id', parentId: 'parentId' }
            )
        ).toEqual([
            {
                clientRecord: { id: '4', custom: 'abc' },
                subRows: [
                    {
                        clientRecord: { id: '31', parentId: '4', custom: '12' },
                        subRows: [],
                        originalIndex: 1
                    }
                ],
                originalIndex: 0
            },
            {
                clientRecord: { id: '418', custom: 'ü' },
                subRows: [
                    {
                        clientRecord: {
                            id: '1941',
                            parentId: '418',
                            custom: 'de'
                        },
                        subRows: [],
                        originalIndex: 2
                    },
                    {
                        clientRecord: {
                            id: '1',
                            parentId: '418',
                            custom: 'ZZZz'
                        },
                        subRows: [],
                        originalIndex: 3
                    }
                ],
                originalIndex: 4
            }
        ]);
    });

    it('should throw if orphans exist', () => {
        expect(() => arrayToTree(
            [
                { id: '4', parentId: null, custom: 'abc' },
                { id: '31', parentId: '4', custom: '12' },
                { id: '418', parentId: '6', custom: 'ü' },
                { id: '419', parentId: '418', custom: 'ü' },
                { id: '420', parentId: '7', custom: 'ü' }
            ],
            { id: 'id', parentId: 'parentId' }
        )).toThrowError(
            'The items array contains orphans that point to the following parentIds: [6,7]. These parentIds do not exist in the items array. Hint: prevent orphans to result in an error by passing the following option: { throwIfOrphans: false }'
        );
    });

    describe('countNodes', () => {
        it('should work with nested objects', () => {
            expect(
                countNodes(
                    arrayToTree(
                        [
                            { id: '4', parentId: null, custom: 'abc' },
                            { id: '31', parentId: '4', custom: '12' },
                            { id: '1941', parentId: '418', custom: 'de' },
                            { id: '1', parentId: '418', custom: 'ZZZz' },
                            { id: '418', parentId: null, custom: 'ü' }
                        ],
                        { id: 'id', parentId: 'parentId' }
                    )
                )
            ).toEqual(5);
        });

        it('should work for 1 node', () => {
            expect(
                countNodes(
                    arrayToTree([{ id: '4', parentId: null, custom: 'abc' }], {
                        id: 'id',
                        parentId: 'parentId'
                    })
                )
            ).toEqual(1);
        });

        it('should work for 0 nodes', () => {
            expect(
                countNodes(arrayToTree([], { id: 'id', parentId: 'parentId' }))
            ).toEqual(0);
        });
    });
});
