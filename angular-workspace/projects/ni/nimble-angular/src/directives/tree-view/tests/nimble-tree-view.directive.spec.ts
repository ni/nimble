import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeItem } from '@ni/nimble-components/dist/esm/tree-item';
import { NimbleTreeViewModule } from '../nimble-tree-view.module';
import { waitAnimationFrame } from '../../../async-test-utilities';
import { NimbleTreeItemModule } from '../../tree-item';

describe('Nimble tree view directive', () => {
    describe('with a tree item pre-selected in the page HTML', () => {
        @Component({
            template: `
                <nimble-tree-view>
                    <nimble-tree-item [expanded]="true">
                        Parent 1
                        <nimble-tree-item #child1 [selected]="true">Child 1</nimble-tree-item>
                    </nimble-tree-item>
                    <nimble-tree-item [expanded]="true">
                        Parent 2
                        <nimble-tree-item #child2>Child 2</nimble-tree-item>
                    </nimble-tree-item>
                </nimble-tree-view>
             `
        })
        class TestHostComponent {
            @ViewChild('child1', { static: true }) public child1: ElementRef<TreeItem>;
            @ViewChild('child2', { static: true }) public child2: ElementRef<TreeItem>;
        }

        let child1: TreeItem;
        let child2: TreeItem;
        let fixture: ComponentFixture<TestHostComponent>;
        let testHostComponent: TestHostComponent;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTreeViewModule, NimbleTreeItemModule]
            }).compileComponents();
        });

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestHostComponent);
            testHostComponent = fixture.componentInstance;
            child1 = testHostComponent.child1.nativeElement;
            child2 = testHostComponent.child2.nativeElement;
            fixture.detectChanges();
            await waitAnimationFrame();
        });

        it('the pre-selected tree item correctly reflects its selected state', () => {
            expect(child1.selected).toBe(true);
        });

        it('when another tree item is clicked, that tree item is selected, and the pre-selected tree item becomes deselected', async () => {
            child2.click();
            fixture.detectChanges();

            expect(child1.selected).toBe(false);
            expect(child2.selected).toBe(true);
        });
    });
});