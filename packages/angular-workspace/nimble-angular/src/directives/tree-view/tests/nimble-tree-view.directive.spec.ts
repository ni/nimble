import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NimbleTreeViewModule } from '../nimble-tree-view.module';
import { NimbleTreeViewDirective, TreeView, TreeViewSelectionMode } from '../nimble-tree-view.directive';

describe('Nimble tree view', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleTreeViewModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-tree-view')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-tree-view #treeView></nimble-tree-view>
            `
        })
        class TestHostComponent {
            @ViewChild('treeView', { read: NimbleTreeViewDirective }) public directive: NimbleTreeViewDirective;
            @ViewChild('treeView', { read: ElementRef }) public elementRef: ElementRef<TreeView>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTreeViewDirective;
        let nativeElement: TreeView;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTreeViewModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for selectionMode', () => {
            expect(directive.selectionMode).toBe(TreeViewSelectionMode.all);
            expect(nativeElement.selectionMode).toBe(TreeViewSelectionMode.all);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-tree-view #treeView
                    selection-mode="none"
                ></nimble-tree-view>
            `
        })
        class TestHostComponent {
            @ViewChild('treeView', { read: NimbleTreeViewDirective }) public directive: NimbleTreeViewDirective;
            @ViewChild('treeView', { read: ElementRef }) public elementRef: ElementRef<TreeView>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTreeViewDirective;
        let nativeElement: TreeView;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTreeViewModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for selectionMode', () => {
            expect(directive.selectionMode).toBe(TreeViewSelectionMode.none);
            expect(nativeElement.selectionMode).toBe(TreeViewSelectionMode.none);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-tree-view #treeView
                    [selection-mode]="selectionMode"
                ></nimble-tree-view>
            `
        })
        class TestHostComponent {
            @ViewChild('treeView', { read: NimbleTreeViewDirective }) public directive: NimbleTreeViewDirective;
            @ViewChild('treeView', { read: ElementRef }) public elementRef: ElementRef<TreeView>;

            public selectionMode: TreeViewSelectionMode = TreeViewSelectionMode.leavesOnly;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTreeViewDirective;
        let nativeElement: TreeView;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTreeViewModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for selectionMode', () => {
            expect(directive.selectionMode).toBe(TreeViewSelectionMode.leavesOnly);
            expect(nativeElement.selectionMode).toBe(TreeViewSelectionMode.leavesOnly);

            fixture.componentInstance.selectionMode = TreeViewSelectionMode.all;
            fixture.detectChanges();

            expect(directive.selectionMode).toBe(TreeViewSelectionMode.all);
            expect(nativeElement.selectionMode).toBe(TreeViewSelectionMode.all);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-tree-view #treeView
                    [attr.selection-mode]="selectionMode"
                ></nimble-tree-view>
            `
        })
        class TestHostComponent {
            @ViewChild('treeView', { read: NimbleTreeViewDirective }) public directive: NimbleTreeViewDirective;
            @ViewChild('treeView', { read: ElementRef }) public elementRef: ElementRef<TreeView>;

            public selectionMode: TreeViewSelectionMode = TreeViewSelectionMode.leavesOnly;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTreeViewDirective;
        let nativeElement: TreeView;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTreeViewModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for selectionMode', () => {
            expect(directive.selectionMode).toBe(TreeViewSelectionMode.leavesOnly);
            expect(nativeElement.selectionMode).toBe(TreeViewSelectionMode.leavesOnly);

            fixture.componentInstance.selectionMode = TreeViewSelectionMode.all;
            fixture.detectChanges();

            expect(directive.selectionMode).toBe(TreeViewSelectionMode.all);
            expect(nativeElement.selectionMode).toBe(TreeViewSelectionMode.all);
        });
    });
});
