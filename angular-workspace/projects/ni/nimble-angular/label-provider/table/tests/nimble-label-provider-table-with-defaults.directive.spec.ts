import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { computeMsgId } from '@angular/compiler';
import { loadTranslations } from '@angular/localize';
import type { LabelProviderTable } from '../nimble-label-provider-table.directive';
import { NimbleLabelProviderTableModule } from '../nimble-label-provider-table.module';

describe('Nimble LabelProviderTable withDefaults directive', () => {
    @Component({
        template: `
        <nimble-label-provider-table withDefaults #labelProvider>
        </nimble-label-provider-table>
         `
    })
    class TestHostComponent {
        @ViewChild('labelProvider', { static: true }) public labelProvider: ElementRef<LabelProviderTable>;
    }

    let labelProvider: LabelProviderTable;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleLabelProviderTableModule, CommonModule]
        });
    });

    beforeEach(() => {
        loadTranslations({
            [computeMsgId('Collapse group', 'Nimble table - collapse group')]: 'Translated collapse group',
            [computeMsgId('Expand group', 'Nimble table - expand group')]: 'Translated expand group',
            [computeMsgId('Collapse all groups', 'Nimble table - collapse all groups')]: 'Translated collapse all groups',
            [computeMsgId('Options', 'Nimble table - cell action menu')]: 'Translated options',
            [computeMsgId('Grouped', 'Nimble table - column header grouped indicator')]: 'Translated grouped',
            [computeMsgId('Sorted ascending', 'Nimble table - column header sorted ascending indicator')]: 'Translated sorted ascending',
            [computeMsgId('Sorted descending', 'Nimble table - column header sorted descending indicator')]: 'Translated sorted descending',
            [computeMsgId('Select all rows', 'Nimble table - select all rows')]: 'Translated select all rows',
            [computeMsgId('Select all rows in group', 'Nimble table - select all rows in group')]: 'Translated select all rows in group',
            [computeMsgId('Select row', 'Nimble table - select row')]: 'Translated select row',
            [computeMsgId('Row operations', 'Nimble table - row operation column')]: 'Translated row operations',
        });
        const fixture = TestBed.createComponent(TestHostComponent);
        const testHostComponent = fixture.componentInstance;
        labelProvider = testHostComponent.labelProvider.nativeElement;
        fixture.detectChanges();
    });

    it('applies translated values for each label', () => {
        expect(labelProvider.groupCollapse).toBe('Translated collapse group');
        expect(labelProvider.groupExpand).toBe('Translated expand group');
        expect(labelProvider.groupsCollapseAll).toBe('Translated collapse all groups');
        expect(labelProvider.cellActionMenu).toBe('Translated options');
        expect(labelProvider.columnHeaderGrouped).toBe('Translated grouped');
        expect(labelProvider.columnHeaderSortedAscending).toBe('Translated sorted ascending');
        expect(labelProvider.columnHeaderSortedDescending).toBe('Translated sorted descending');
        expect(labelProvider.selectAll).toBe('Translated select all rows');
        expect(labelProvider.groupSelectAll).toBe('Translated select all rows in group');
        expect(labelProvider.rowSelect).toBe('Translated select row');
        expect(labelProvider.rowOperationColumn).toBe('Translated row operations');
    });
});
