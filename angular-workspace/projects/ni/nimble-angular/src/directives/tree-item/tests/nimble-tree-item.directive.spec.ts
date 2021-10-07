import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeItem } from '@ni/nimble-components/dist/esm/tree-item';
import { NimbleTreeItemModule } from '..';
import { NimbleTreeViewModule } from '../../tree-view';

describe('Nimble tree item directive (using 2-way binding)', () => {
    @Component({
        template: `
            <nimble-tree-view>
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
        @ViewChild('parent3', { static: true }) public parent3: ElementRef<TreeItem>;
        @ViewChild('child1', { static: true }) public child1: ElementRef<TreeItem>;
        @ViewChild('child2', { static: true }) public child2: ElementRef<TreeItem>;
        public parent1Expanded = true;
        public parent2Expanded = true;
        public child1Selected = true;
        public child2Selected = false;
        public parent3Disabled = true;
    }

    let parent1Element: TreeItem;
    let parent3Element: TreeItem;
    let child1Element: TreeItem;
    let child2Element: TreeItem;
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
        parent3Element = testHostComponent.parent3.nativeElement;
        child1Element = testHostComponent.child1.nativeElement;
        child2Element = testHostComponent.child2.nativeElement;
        fixture.detectChanges();
    });

    it('the TreeItem DOM element reflects correct initial state set via NimbleTreeItemDirective', () => {
        expect(parent1Element.expanded).toBe(true);
        expect(child1Element.selected).toBe(true);
        expect(parent3Element.disabled).toBe(true);
    });

    describe('NimbleTreeItemDirective properties are correctly updated after interactive updates to the tree item', () => {
        it('for selection', () => {
            child2Element.click();
            fixture.detectChanges();

            expect(child2Element.selected).toBe(true);
            expect(testHostComponent.child2Selected).toBe(true);
        });

        it('for expand/collapse', () => {
            parent1Element.click();
            fixture.detectChanges();

            expect(parent1Element.expanded).toBe(false);
            expect(testHostComponent.parent1Expanded).toBe(false);
        });
    });

    describe('when directive properties change, the tree item DOM element is updated', () => {
        it('for selection', () => {
            testHostComponent.child2Selected = true;
            fixture.detectChanges();

            expect(child2Element.selected).toBe(true);
        });

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
