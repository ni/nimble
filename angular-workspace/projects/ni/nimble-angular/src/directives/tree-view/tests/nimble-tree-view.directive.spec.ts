import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeItem } from '@ni/nimble-components/dist/esm/tree-item';
import { SelectionMode } from '@ni/nimble-components/dist/esm/tree-view/types';
import { NimbleTreeItemModule } from '../../tree-item';
import { NimbleTreeViewModule } from '..';

describe('Nimble tree view', () => {
    @Component({
        template: `
            <nimble-tree-view [selectionMode]="selectionMode" (selectedChange)="itemSelected($event)">
                <nimble-tree-item #parent1 [(expanded)]="parent1Expanded">
                    Parent 1
                    <nimble-tree-item #child1 [(selected)]="child1Selected">Child 1</nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item [(expanded)]="parent2Expanded">
                    Parent 2
                    <nimble-tree-item #child2 [(selected)]="child2Selected">Child 2</nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item #parent3 [(disabled)]="parent3Disabled">
                    Parent 3
                </nimble-tree-item>
            </nimble-tree-view>
         `
    })
    class TestHostComponent {
        @ViewChild('parent1', { static: true }) public parent1: ElementRef<TreeItem>;
        @ViewChild('child1', { static: true }) public child1: ElementRef<TreeItem>;
        public selectedItem: TreeItem;
        public selectionMode: SelectionMode | undefined;

        public itemSelected(treeItem: TreeItem): void {
            this.selectedItem = treeItem;
        }
    }

    let parent1Element: TreeItem;
    let child1Element: TreeItem;
    let fixture: ComponentFixture<TestHostComponent>;
    let testHostComponent: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleTreeViewModule, NimbleTreeItemModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = fixture.componentInstance;
        parent1Element = testHostComponent.parent1.nativeElement;
        child1Element = testHostComponent.child1.nativeElement;
        fixture.detectChanges();
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-tree-view')).not.toBeUndefined();
    });

    describe('NimbleTreeViewDirective selectedChange event', () => {
        it('is emitted for leaf tree items', () => {
            child1Element.click();
            fixture.detectChanges();

            expect(testHostComponent.selectedItem).toBe(child1Element);
        });

        it('is not emitted for tree parent items when selectionMode is set to LeavesOnly', () => {
            testHostComponent.selectionMode = SelectionMode.LeavesOnly;
            fixture.detectChanges();
            child1Element.click(); // select child first

            parent1Element.click();
            fixture.detectChanges();

            // selection stayed on child
            expect(testHostComponent.selectedItem).toBe(child1Element);
        });

        it('is emitted for tree parent items when selectionMode is set to All', () => {
            testHostComponent.selectionMode = SelectionMode.All;
            fixture.detectChanges();
            parent1Element.click();
            fixture.detectChanges();

            expect(testHostComponent.selectedItem).toBe(parent1Element);
        });

        it('is emitted for tree parent items when selectionMode is undefined', () => {
            testHostComponent.selectionMode = undefined;
            parent1Element.click();
            fixture.detectChanges();

            expect(testHostComponent.selectedItem).toBe(parent1Element);
        });
    });
});
