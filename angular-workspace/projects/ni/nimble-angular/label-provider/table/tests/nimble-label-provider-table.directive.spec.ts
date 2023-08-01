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

        it('has expected defaults for columnHeaderGroupedIndicator', () => {
            expect(directive.columnHeaderGroupedIndicator).toBeUndefined();
            expect(nativeElement.columnHeaderGroupedIndicator).toBeUndefined();
        });

        it('has expected defaults for groupCollapse', () => {
            expect(directive.groupCollapse).toBeUndefined();
            expect(nativeElement.groupCollapse).toBeUndefined();
        });

        it('has expected defaults for groupExpand', () => {
            expect(directive.groupExpand).toBeUndefined();
            expect(nativeElement.groupExpand).toBeUndefined();
        });

        it('has expected defaults for groupsCollapseAll', () => {
            expect(directive.groupsCollapseAll).toBeUndefined();
            expect(nativeElement.groupsCollapseAll).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-label-provider-table #labelProvider
                    cell-action-menu="${label1}"
                    column-header-grouped-indicator="${label2}"
                    group-collapse="${label3}"
                    group-expand="${label4}"
                    groups-collapse-all="${label5}"
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

        it('will use template string values for columnHeaderGroupedIndicator', () => {
            expect(directive.columnHeaderGroupedIndicator).toBe(label2);
            expect(nativeElement.columnHeaderGroupedIndicator).toBe(label2);
        });

        it('will use template string values for groupCollapse', () => {
            expect(directive.groupCollapse).toBe(label3);
            expect(nativeElement.groupCollapse).toBe(label3);
        });

        it('will use template string values for groupExpand', () => {
            expect(directive.groupExpand).toBe(label4);
            expect(nativeElement.groupExpand).toBe(label4);
        });

        it('will use template string values for groupsCollapseAll', () => {
            expect(directive.groupsCollapseAll).toBe(label5);
            expect(nativeElement.groupsCollapseAll).toBe(label5);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-label-provider-table #labelProvider
                    [cellActionMenu]="cellActionMenu"
                    [columnHeaderGroupedIndicator]="columnHeaderGroupedIndicator"
                    [groupCollapse]="groupCollapse"
                    [groupExpand]="groupExpand"
                    [groupsCollapseAll]="groupsCollapseAll"
                    >
                </nimble-label-provider-table>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderTableDirective }) public directive: NimbleLabelProviderTableDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderTable>;
            public cellActionMenu = label1;
            public columnHeaderGroupedIndicator = label1;
            public groupCollapse = label1;
            public groupExpand = label1;
            public groupsCollapseAll = label1;
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

        it('can be configured with property binding for columnHeaderGroupedIndicator', () => {
            expect(directive.columnHeaderGroupedIndicator).toBe(label1);
            expect(nativeElement.columnHeaderGroupedIndicator).toBe(label1);

            fixture.componentInstance.columnHeaderGroupedIndicator = label2;
            fixture.detectChanges();

            expect(directive.columnHeaderGroupedIndicator).toBe(label2);
            expect(nativeElement.columnHeaderGroupedIndicator).toBe(label2);
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

        it('can be configured with property binding for groupsCollapseAll', () => {
            expect(directive.groupsCollapseAll).toBe(label1);
            expect(nativeElement.groupsCollapseAll).toBe(label1);

            fixture.componentInstance.groupsCollapseAll = label2;
            fixture.detectChanges();

            expect(directive.groupsCollapseAll).toBe(label2);
            expect(nativeElement.groupsCollapseAll).toBe(label2);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-label-provider-table #labelProvider
                    [attr.cell-action-menu]="cellActionMenu"
                    [attr.column-header-grouped-indicator]="columnHeaderGroupedIndicator"
                    [attr.group-collapse]="groupCollapse"
                    [attr.group-expand]="groupExpand"
                    [attr.groups-collapse-all]="groupsCollapseAll"
                    >
                </nimble-label-provider-table>
            `
        })
        class TestHostComponent {
            @ViewChild('labelProvider', { read: NimbleLabelProviderTableDirective }) public directive: NimbleLabelProviderTableDirective;
            @ViewChild('labelProvider', { read: ElementRef }) public elementRef: ElementRef<LabelProviderTable>;
            public cellActionMenu = label1;
            public columnHeaderGroupedIndicator = label1;
            public groupCollapse = label1;
            public groupExpand = label1;
            public groupsCollapseAll = label1;
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

        it('can be configured with attribute binding for columnHeaderGroupedIndicator', () => {
            expect(directive.columnHeaderGroupedIndicator).toBe(label1);
            expect(nativeElement.columnHeaderGroupedIndicator).toBe(label1);

            fixture.componentInstance.columnHeaderGroupedIndicator = label2;
            fixture.detectChanges();

            expect(directive.columnHeaderGroupedIndicator).toBe(label2);
            expect(nativeElement.columnHeaderGroupedIndicator).toBe(label2);
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

        it('can be configured with attribute binding for groupsCollapseAll', () => {
            expect(directive.groupsCollapseAll).toBe(label1);
            expect(nativeElement.groupsCollapseAll).toBe(label1);

            fixture.componentInstance.groupsCollapseAll = label2;
            fixture.detectChanges();

            expect(directive.groupsCollapseAll).toBe(label2);
            expect(nativeElement.groupsCollapseAll).toBe(label2);
        });
    });
});
