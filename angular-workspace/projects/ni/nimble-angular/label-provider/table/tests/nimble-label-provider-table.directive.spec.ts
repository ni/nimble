import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabelProviderTable, NimbleLabelProviderTableDirective } from '../nimble-label-provider-table.directive';
import { NimbleLabelProviderTableModule } from '../nimble-label-provider-table.module';

describe('Nimble Label Provider Table', () => {
    const label1 = 'String 1';
    const label2 = 'String 2';
    const label3 = 'String 3';
    const label4 = 'String 4';
    const label5 = 'String 5';
    const label6 = 'String 6';
    const label7 = 'String 7';
    const label8 = 'String 8';
    const label9 = 'String 9';
    const label10 = 'String 10';
    const label11 = 'String 11';
    const label12 = 'String 12';
    const label13 = 'String 13';
    const label14 = 'String 14';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleLabelProviderTableModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-label-provider-table')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-label-provider-table #labelProvider></nimble-label-provider-table>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderTableDirective }) public directive: NimbleLabelProviderTableDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderTable>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderTableDirective;
        let nativeElement: LabelProviderTable;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderTableModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for cellActionMenu', () => {
            expect(directive.cellActionMenu).toBeUndefined();
            expect(nativeElement.cellActionMenu).toBeUndefined();
        });

        it('has expected defaults for columnHeaderGrouped', () => {
            expect(directive.columnHeaderGrouped).toBeUndefined();
            expect(nativeElement.columnHeaderGrouped).toBeUndefined();
        });

        it('has expected defaults for groupCollapse', () => {
            expect(directive.groupCollapse).toBeUndefined();
            expect(nativeElement.groupCollapse).toBeUndefined();
        });

        it('has expected defaults for groupExpand', () => {
            expect(directive.groupExpand).toBeUndefined();
            expect(nativeElement.groupExpand).toBeUndefined();
        });

        it('has expected defaults for rowCollapse', () => {
            expect(directive.rowCollapse).toBeUndefined();
            expect(nativeElement.rowCollapse).toBeUndefined();
        });

        it('has expected defaults for rowExpand', () => {
            expect(directive.rowExpand).toBeUndefined();
            expect(nativeElement.rowExpand).toBeUndefined();
        });

        it('has expected defaults for collapseAll', () => {
            expect(directive.collapseAll).toBeUndefined();
            expect(nativeElement.collapseAll).toBeUndefined();
        });

        it('has expected defaults for columnHeaderSortedAscending', () => {
            expect(directive.columnHeaderSortedAscending).toBeUndefined();
            expect(nativeElement.columnHeaderSortedAscending).toBeUndefined();
        });

        it('has expected defaults for columnHeaderSortedDescending', () => {
            expect(directive.columnHeaderSortedDescending).toBeUndefined();
            expect(nativeElement.columnHeaderSortedDescending).toBeUndefined();
        });

        it('has expected defaults for selectAll', () => {
            expect(directive.selectAll).toBeUndefined();
            expect(nativeElement.selectAll).toBeUndefined();
        });

        it('has expected defaults for groupSelectAll', () => {
            expect(directive.groupSelectAll).toBeUndefined();
            expect(nativeElement.groupSelectAll).toBeUndefined();
        });

        it('has expected defaults for rowSelect', () => {
            expect(directive.rowSelect).toBeUndefined();
            expect(nativeElement.rowSelect).toBeUndefined();
        });

        it('has expected defaults for rowOperationColumn', () => {
            expect(directive.rowOperationColumn).toBeUndefined();
            expect(nativeElement.rowOperationColumn).toBeUndefined();
        });

        it('has expected defaults for rowLoading', () => {
            expect(directive.rowLoading).toBeUndefined();
            expect(nativeElement.rowLoading).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-label-provider-table #labelProvider
                    cell-action-menu="${label1}"
                    column-header-grouped="${label2}"
                    group-collapse="${label3}"
                    group-expand="${label4}"
                    row-collapse="${label5}"
                    row-expand="${label6}"
                    collapse-all="${label7}"
                    column-header-sorted-ascending="${label8}"
                    column-header-sorted-descending="${label9}"
                    select-all="${label10}"
                    group-select-all="${label11}"
                    row-select="${label12}"
                    row-operation-column="${label13}"
                    row-loading="${label14}"
                    >
                </nimble-label-provider-table>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderTableDirective }) public directive: NimbleLabelProviderTableDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderTable>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderTableDirective;
        let nativeElement: LabelProviderTable;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderTableModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for cellActionMenu', () => {
            expect(directive.cellActionMenu).toBe(label1);
            expect(nativeElement.cellActionMenu).toBe(label1);
        });

        it('will use template string values for columnHeaderGrouped', () => {
            expect(directive.columnHeaderGrouped).toBe(label2);
            expect(nativeElement.columnHeaderGrouped).toBe(label2);
        });

        it('will use template string values for groupCollapse', () => {
            expect(directive.groupCollapse).toBe(label3);
            expect(nativeElement.groupCollapse).toBe(label3);
        });

        it('will use template string values for groupExpand', () => {
            expect(directive.groupExpand).toBe(label4);
            expect(nativeElement.groupExpand).toBe(label4);
        });

        it('will use template string values for rowCollapse', () => {
            expect(directive.rowCollapse).toBe(label5);
            expect(nativeElement.rowCollapse).toBe(label5);
        });

        it('will use template string values for rowExpand', () => {
            expect(directive.rowExpand).toBe(label6);
            expect(nativeElement.rowExpand).toBe(label6);
        });

        it('will use template string values for collapseAll', () => {
            expect(directive.collapseAll).toBe(label7);
            expect(nativeElement.collapseAll).toBe(label7);
        });

        it('will use template string values for columnHeaderSortedAscending', () => {
            expect(directive.columnHeaderSortedAscending).toBe(label8);
            expect(nativeElement.columnHeaderSortedAscending).toBe(label8);
        });

        it('will use template string values for columnHeaderSortedDescending', () => {
            expect(directive.columnHeaderSortedDescending).toBe(label9);
            expect(nativeElement.columnHeaderSortedDescending).toBe(label9);
        });

        it('will use template string values for selectAll', () => {
            expect(directive.selectAll).toBe(label10);
            expect(nativeElement.selectAll).toBe(label10);
        });

        it('will use template string values for groupSelectAll', () => {
            expect(directive.groupSelectAll).toBe(label11);
            expect(nativeElement.groupSelectAll).toBe(label11);
        });

        it('will use template string values for rowSelect', () => {
            expect(directive.rowSelect).toBe(label12);
            expect(nativeElement.rowSelect).toBe(label12);
        });

        it('will use template string values for rowOperationColumn', () => {
            expect(directive.rowOperationColumn).toBe(label13);
            expect(nativeElement.rowOperationColumn).toBe(label13);
        });

        it('will use template string values for rowLoading', () => {
            expect(directive.rowLoading).toBe(label14);
            expect(nativeElement.rowLoading).toBe(label14);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-label-provider-table #labelProvider
                    [cellActionMenu]="cellActionMenu"
                    [columnHeaderGrouped]="columnHeaderGrouped"
                    [groupCollapse]="groupCollapse"
                    [groupExpand]="groupExpand"
                    [rowCollapse]="rowCollapse"
                    [rowExpand]="rowExpand"
                    [collapseAll]="collapseAll"
                    [columnHeaderSortedAscending]="columnHeaderSortedAscending"
                    [columnHeaderSortedDescending]="columnHeaderSortedDescending"
                    [selectAll]="selectAll"
                    [groupSelectAll]="groupSelectAll"
                    [rowSelect]="rowSelect"
                    [rowOperationColumn]="rowOperationColumn"
                    [rowLoading]="rowLoading"
                    >
                </nimble-label-provider-table>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderTableDirective }) public directive: NimbleLabelProviderTableDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderTable>;
            public cellActionMenu = label1;
            public columnHeaderGrouped = label1;
            public groupCollapse = label1;
            public groupExpand = label1;
            public rowCollapse = label1;
            public rowExpand = label1;
            public collapseAll = label1;
            public columnHeaderSortedAscending = label1;
            public columnHeaderSortedDescending = label1;
            public selectAll = label1;
            public groupSelectAll = label1;
            public rowSelect = label1;
            public rowOperationColumn = label1;
            public rowLoading = label1;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderTableDirective;
        let nativeElement: LabelProviderTable;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderTableModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for cellActionMenu', () => {
            expect(directive.cellActionMenu).toBe(label1);
            expect(nativeElement.cellActionMenu).toBe(label1);

            fixture.componentInstance.cellActionMenu = label2;
            fixture.detectChanges();

            expect(directive.cellActionMenu).toBe(label2);
            expect(nativeElement.cellActionMenu).toBe(label2);
        });

        it('can be configured with property binding for columnHeaderGrouped', () => {
            expect(directive.columnHeaderGrouped).toBe(label1);
            expect(nativeElement.columnHeaderGrouped).toBe(label1);

            fixture.componentInstance.columnHeaderGrouped = label2;
            fixture.detectChanges();

            expect(directive.columnHeaderGrouped).toBe(label2);
            expect(nativeElement.columnHeaderGrouped).toBe(label2);
        });

        it('can be configured with property binding for groupCollapse', () => {
            expect(directive.groupCollapse).toBe(label1);
            expect(nativeElement.groupCollapse).toBe(label1);

            fixture.componentInstance.groupCollapse = label2;
            fixture.detectChanges();

            expect(directive.groupCollapse).toBe(label2);
            expect(nativeElement.groupCollapse).toBe(label2);
        });

        it('can be configured with property binding for groupExpand', () => {
            expect(directive.groupExpand).toBe(label1);
            expect(nativeElement.groupExpand).toBe(label1);

            fixture.componentInstance.groupExpand = label2;
            fixture.detectChanges();

            expect(directive.groupExpand).toBe(label2);
            expect(nativeElement.groupExpand).toBe(label2);
        });

        it('can be configured with property binding for rowCollapse', () => {
            expect(directive.rowCollapse).toBe(label1);
            expect(nativeElement.rowCollapse).toBe(label1);

            fixture.componentInstance.rowCollapse = label2;
            fixture.detectChanges();

            expect(directive.rowCollapse).toBe(label2);
            expect(nativeElement.rowCollapse).toBe(label2);
        });

        it('can be configured with property binding for rowExpand', () => {
            expect(directive.rowExpand).toBe(label1);
            expect(nativeElement.rowExpand).toBe(label1);

            fixture.componentInstance.rowExpand = label2;
            fixture.detectChanges();

            expect(directive.rowExpand).toBe(label2);
            expect(nativeElement.rowExpand).toBe(label2);
        });

        it('can be configured with property binding for collapseAll', () => {
            expect(directive.collapseAll).toBe(label1);
            expect(nativeElement.collapseAll).toBe(label1);

            fixture.componentInstance.collapseAll = label2;
            fixture.detectChanges();

            expect(directive.collapseAll).toBe(label2);
            expect(nativeElement.collapseAll).toBe(label2);
        });

        it('can be configured with property binding for columnHeaderSortedAscending', () => {
            expect(directive.columnHeaderSortedAscending).toBe(label1);
            expect(nativeElement.columnHeaderSortedAscending).toBe(label1);

            fixture.componentInstance.columnHeaderSortedAscending = label2;
            fixture.detectChanges();

            expect(directive.columnHeaderSortedAscending).toBe(label2);
            expect(nativeElement.columnHeaderSortedAscending).toBe(label2);
        });

        it('can be configured with property binding for columnHeaderSortedDescending', () => {
            expect(directive.columnHeaderSortedDescending).toBe(label1);
            expect(nativeElement.columnHeaderSortedDescending).toBe(label1);

            fixture.componentInstance.columnHeaderSortedDescending = label2;
            fixture.detectChanges();

            expect(directive.columnHeaderSortedDescending).toBe(label2);
            expect(nativeElement.columnHeaderSortedDescending).toBe(label2);
        });

        it('can be configured with property binding for selectAll', () => {
            expect(directive.selectAll).toBe(label1);
            expect(nativeElement.selectAll).toBe(label1);

            fixture.componentInstance.selectAll = label2;
            fixture.detectChanges();

            expect(directive.selectAll).toBe(label2);
            expect(nativeElement.selectAll).toBe(label2);
        });

        it('can be configured with property binding for groupSelectAll', () => {
            expect(directive.groupSelectAll).toBe(label1);
            expect(nativeElement.groupSelectAll).toBe(label1);

            fixture.componentInstance.groupSelectAll = label2;
            fixture.detectChanges();

            expect(directive.groupSelectAll).toBe(label2);
            expect(nativeElement.groupSelectAll).toBe(label2);
        });

        it('can be configured with property binding for rowSelect', () => {
            expect(directive.rowSelect).toBe(label1);
            expect(nativeElement.rowSelect).toBe(label1);

            fixture.componentInstance.rowSelect = label2;
            fixture.detectChanges();

            expect(directive.rowSelect).toBe(label2);
            expect(nativeElement.rowSelect).toBe(label2);
        });

        it('can be configured with property binding for rowOperationColumn', () => {
            expect(directive.rowOperationColumn).toBe(label1);
            expect(nativeElement.rowOperationColumn).toBe(label1);

            fixture.componentInstance.rowOperationColumn = label2;
            fixture.detectChanges();

            expect(directive.rowOperationColumn).toBe(label2);
            expect(nativeElement.rowOperationColumn).toBe(label2);
        });

        it('can be configured with property binding for rowLoading', () => {
            expect(directive.rowLoading).toBe(label1);
            expect(nativeElement.rowLoading).toBe(label1);

            fixture.componentInstance.rowLoading = label2;
            fixture.detectChanges();

            expect(directive.rowLoading).toBe(label2);
            expect(nativeElement.rowLoading).toBe(label2);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-label-provider-table #labelProvider
                    [attr.cell-action-menu]="cellActionMenu"
                    [attr.column-header-grouped]="columnHeaderGrouped"
                    [attr.group-collapse]="groupCollapse"
                    [attr.group-expand]="groupExpand"
                    [attr.row-collapse]="rowCollapse"
                    [attr.row-expand]="rowExpand"
                    [attr.collapse-all]="collapseAll"
                    [attr.column-header-sorted-ascending]="columnHeaderSortedAscending"
                    [attr.column-header-sorted-descending]="columnHeaderSortedDescending"
                    [attr.select-all]="selectAll"
                    [attr.group-select-all]="groupSelectAll"
                    [attr.row-select]="rowSelect"
                    [attr.row-operation-column]="rowOperationColumn"
                    [attr.row-loading]="rowLoading"
                    >
                </nimble-label-provider-table>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderTableDirective }) public directive: NimbleLabelProviderTableDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderTable>;
            public cellActionMenu = label1;
            public columnHeaderGrouped = label1;
            public groupCollapse = label1;
            public groupExpand = label1;
            public rowCollapse = label1;
            public rowExpand = label1;
            public collapseAll = label1;
            public columnHeaderSortedAscending = label1;
            public columnHeaderSortedDescending = label1;
            public selectAll = label1;
            public groupSelectAll = label1;
            public rowSelect = label1;
            public rowOperationColumn = label1;
            public rowLoading = label1;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleLabelProviderTableDirective;
        let nativeElement: LabelProviderTable;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleLabelProviderTableModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for cellActionMenu', () => {
            expect(directive.cellActionMenu).toBe(label1);
            expect(nativeElement.cellActionMenu).toBe(label1);

            fixture.componentInstance.cellActionMenu = label2;
            fixture.detectChanges();

            expect(directive.cellActionMenu).toBe(label2);
            expect(nativeElement.cellActionMenu).toBe(label2);
        });

        it('can be configured with attribute binding for columnHeaderGrouped', () => {
            expect(directive.columnHeaderGrouped).toBe(label1);
            expect(nativeElement.columnHeaderGrouped).toBe(label1);

            fixture.componentInstance.columnHeaderGrouped = label2;
            fixture.detectChanges();

            expect(directive.columnHeaderGrouped).toBe(label2);
            expect(nativeElement.columnHeaderGrouped).toBe(label2);
        });

        it('can be configured with attribute binding for groupCollapse', () => {
            expect(directive.groupCollapse).toBe(label1);
            expect(nativeElement.groupCollapse).toBe(label1);

            fixture.componentInstance.groupCollapse = label2;
            fixture.detectChanges();

            expect(directive.groupCollapse).toBe(label2);
            expect(nativeElement.groupCollapse).toBe(label2);
        });

        it('can be configured with attribute binding for groupExpand', () => {
            expect(directive.groupExpand).toBe(label1);
            expect(nativeElement.groupExpand).toBe(label1);

            fixture.componentInstance.groupExpand = label2;
            fixture.detectChanges();

            expect(directive.groupExpand).toBe(label2);
            expect(nativeElement.groupExpand).toBe(label2);
        });

        it('can be configured with attribute binding for rowCollapse', () => {
            expect(directive.rowCollapse).toBe(label1);
            expect(nativeElement.rowCollapse).toBe(label1);

            fixture.componentInstance.rowCollapse = label2;
            fixture.detectChanges();

            expect(directive.rowCollapse).toBe(label2);
            expect(nativeElement.rowCollapse).toBe(label2);
        });

        it('can be configured with attribute binding for rowExpand', () => {
            expect(directive.rowExpand).toBe(label1);
            expect(nativeElement.rowExpand).toBe(label1);

            fixture.componentInstance.rowExpand = label2;
            fixture.detectChanges();

            expect(directive.rowExpand).toBe(label2);
            expect(nativeElement.rowExpand).toBe(label2);
        });

        it('can be configured with attribute binding for collapseAll', () => {
            expect(directive.collapseAll).toBe(label1);
            expect(nativeElement.collapseAll).toBe(label1);

            fixture.componentInstance.collapseAll = label2;
            fixture.detectChanges();

            expect(directive.collapseAll).toBe(label2);
            expect(nativeElement.collapseAll).toBe(label2);
        });

        it('can be configured with attribute binding for columnHeaderSortedAscending', () => {
            expect(directive.columnHeaderSortedAscending).toBe(label1);
            expect(nativeElement.columnHeaderSortedAscending).toBe(label1);

            fixture.componentInstance.columnHeaderSortedAscending = label2;
            fixture.detectChanges();

            expect(directive.columnHeaderSortedAscending).toBe(label2);
            expect(nativeElement.columnHeaderSortedAscending).toBe(label2);
        });

        it('can be configured with attribute binding for columnHeaderSortedDescending', () => {
            expect(directive.columnHeaderSortedDescending).toBe(label1);
            expect(nativeElement.columnHeaderSortedDescending).toBe(label1);

            fixture.componentInstance.columnHeaderSortedDescending = label2;
            fixture.detectChanges();

            expect(directive.columnHeaderSortedDescending).toBe(label2);
            expect(nativeElement.columnHeaderSortedDescending).toBe(label2);
        });

        it('can be configured with attribute binding for selectAll', () => {
            expect(directive.selectAll).toBe(label1);
            expect(nativeElement.selectAll).toBe(label1);

            fixture.componentInstance.selectAll = label2;
            fixture.detectChanges();

            expect(directive.selectAll).toBe(label2);
            expect(nativeElement.selectAll).toBe(label2);
        });

        it('can be configured with attribute binding for groupSelectAll', () => {
            expect(directive.groupSelectAll).toBe(label1);
            expect(nativeElement.groupSelectAll).toBe(label1);

            fixture.componentInstance.groupSelectAll = label2;
            fixture.detectChanges();

            expect(directive.groupSelectAll).toBe(label2);
            expect(nativeElement.groupSelectAll).toBe(label2);
        });

        it('can be configured with attribute binding for rowSelect', () => {
            expect(directive.rowSelect).toBe(label1);
            expect(nativeElement.rowSelect).toBe(label1);

            fixture.componentInstance.rowSelect = label2;
            fixture.detectChanges();

            expect(directive.rowSelect).toBe(label2);
            expect(nativeElement.rowSelect).toBe(label2);
        });

        it('can be configured with attribute binding for rowOperationColumn', () => {
            expect(directive.rowOperationColumn).toBe(label1);
            expect(nativeElement.rowOperationColumn).toBe(label1);

            fixture.componentInstance.rowOperationColumn = label2;
            fixture.detectChanges();

            expect(directive.rowOperationColumn).toBe(label2);
            expect(nativeElement.rowOperationColumn).toBe(label2);
        });

        it('can be configured with attribute binding for rowLoading', () => {
            expect(directive.rowLoading).toBe(label1);
            expect(nativeElement.rowLoading).toBe(label1);

            fixture.componentInstance.rowLoading = label2;
            fixture.detectChanges();

            expect(directive.rowLoading).toBe(label2);
            expect(nativeElement.rowLoading).toBe(label2);
        });
    });
});
