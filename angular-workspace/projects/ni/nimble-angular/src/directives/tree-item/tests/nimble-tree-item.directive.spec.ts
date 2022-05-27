import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTreeItemModule } from '../nimble-tree-item.module';
import type { TreeItem } from '../nimble-tree-item.directive';
import { NimbleTreeViewModule } from '../../tree-view/nimble-tree-view.module';
import { TreeViewSelectionMode } from '../../tree-view/nimble-tree-view.directive';

describe('Nimble tree item directive (using 2-way binding)', () => {
    @Component({
        template: `
            <nimble-tree-view [selectionMode]="selectionMode">
                <nimble-tree-item #parent1 [(expanded)]="parent1Expanded">
                    Parent 1
                    <nimble-tree-item #child1 selected>Child 1</nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item [(expanded)]="parent2Expanded">
                    Parent 2
                    <nimble-tree-item #child2>Child 2</nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item #parent3 [disabled]="parent3Disabled">
                    Parent 3
                </nimble-tree-item>
            </nimble-tree-view>
         `
    })
    class TestHostComponent {
        @ViewChild('parent1', { static: true }) public parent1: ElementRef<TreeItem>;
        @ViewChild('parent3', { static: true }) public parent3: ElementRef<TreeItem>;
        @ViewChild('child1', { static: true }) public child1: ElementRef<TreeItem>;
        @ViewChild('child2', { static: true }) public child2: ElementRef<TreeItem>;
        public parent1Expanded = true;
        public parent2Expanded = true;
        public parent3Disabled = true;
        public selectionMode = TreeViewSelectionMode.leavesOnly;
    }

    let parent1Element: TreeItem;
    let parent3Element: TreeItem;
    let child1Element: TreeItem;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleTreeViewModule, NimbleTreeItemModule]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        parent1Element = testHostComponent.parent1.nativeElement;
        parent3Element = testHostComponent.parent3.nativeElement;
        child1Element = testHostComponent.child1.nativeElement;
        fixture.detectChanges();
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-tree-item')).not.toBeUndefined();
    });

    it('the TreeItem DOM element reflects correct initial state set via NimbleTreeItemDirective', () => {
        expect(parent1Element.expanded).toBe(true);
        expect(child1Element.selected).toBe(true);
        expect(parent3Element.disabled).toBe(true);
    });

    describe('NimbleTreeItemDirective properties are correctly updated after interactive updates to the tree item', () => {
        it('for expand/collapse', () => {
            parent1Element.click();
            fixture.detectChanges();

            expect(parent1Element.expanded).toBe(false);
            expect(testHostComponent.parent1Expanded).toBe(false);
        });
    });

    describe('when directive properties change, the tree item DOM element is updated', () => {
        it('for expand/collapse', () => {
            testHostComponent.parent1Expanded = false;
            fixture.detectChanges();

            expect(parent1Element.expanded).toBe(false);
        });

        it('for disabled', () => {
            testHostComponent.parent3Disabled = false;
            fixture.detectChanges();

            expect(parent3Element.disabled).toBe(false);
        });
    });
});
