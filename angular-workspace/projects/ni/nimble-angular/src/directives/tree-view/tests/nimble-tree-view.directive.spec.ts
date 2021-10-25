import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTreeItemModule, TreeItem } from '../../tree-item';
import { NimbleTreeViewModule, SelectionMode } from '..';

describe('Nimble tree view', () => {
    @Component({
        template: `
            <nimble-tree-view [selectionMode]="selectionMode" (selectedChange)="itemSelected($event)">
                <nimble-tree-item #parent1 [(expanded)]="parent1Expanded">
                    Parent 1
                    <nimble-tree-item #child1 [selected]="child1Selected">Child 1</nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item [(expanded)]="parent2Expanded">
                    Parent 2
                    <nimble-tree-item #child2>Child 2</nimble-tree-item>
                </nimble-tree-item>
                <nimble-tree-item #parent3>
                    Parent 3
                </nimble-tree-item>
            </nimble-tree-view>
         `
    })
    class TestHostComponent {
        @ViewChild('parent1', { static: true }) public parent1: ElementRef<TreeItem>;
        @ViewChild('child1', { static: true }) public child1: ElementRef<TreeItem>;
        public selectedItem: TreeItem;
        public selectionMode: SelectionMode;

        public itemSelected(treeItem: TreeItem): void {
            this.selectedItem = treeItem;
        }
    }

    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleTreeViewModule, NimbleTreeItemModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-tree-view')).not.toBeUndefined();
    });
});
