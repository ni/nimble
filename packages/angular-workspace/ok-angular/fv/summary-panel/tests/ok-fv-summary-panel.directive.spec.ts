import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvSummaryPanel, OkFvSummaryPanelDirective } from '../ok-fv-summary-panel.directive';
import { OkFvSummaryPanelModule } from '../ok-fv-summary-panel.module';

describe('Ok fv summary panel', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvSummaryPanelModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-summary-panel')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <ok-fv-summary-panel #summaryPanel></ok-fv-summary-panel>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('summaryPanel', { read: OkFvSummaryPanelDirective }) public directive: OkFvSummaryPanelDirective;
            @ViewChild('summaryPanel', { read: ElementRef }) public elementRef: ElementRef<FvSummaryPanel>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSummaryPanelDirective;
        let nativeElement: FvSummaryPanel;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSummaryPanelModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for showEditItemsButton', () => {
            expect(directive.showEditItemsButton).toBe(false);
            expect(nativeElement.showEditItemsButton).toBe(false);
        });

        it('has expected defaults for legacyStyle', () => {
            expect(directive.legacyStyle).toBe(false);
            expect(nativeElement.legacyStyle).toBe(false);
        });

        it('has expected defaults for editItemsButtonLabel', () => {
            expect(directive.editItemsButtonLabel).toBe('Configure');
            expect(nativeElement.editItemsButtonLabel).toBe('Configure');
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <ok-fv-summary-panel #summaryPanel
                    show-edit-items-button
                    legacy-style
                    edit-items-button-label="Customize summary">
                </ok-fv-summary-panel>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('summaryPanel', { read: OkFvSummaryPanelDirective }) public directive: OkFvSummaryPanelDirective;
            @ViewChild('summaryPanel', { read: ElementRef }) public elementRef: ElementRef<FvSummaryPanel>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSummaryPanelDirective;
        let nativeElement: FvSummaryPanel;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSummaryPanelModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for showEditItemsButton', () => {
            expect(directive.showEditItemsButton).toBeTrue();
            expect(nativeElement.showEditItemsButton).toBeTrue();
        });

        it('will use template string values for legacyStyle', () => {
            expect(directive.legacyStyle).toBeTrue();
            expect(nativeElement.legacyStyle).toBeTrue();
        });

        it('will use template string values for editItemsButtonLabel', () => {
            expect(directive.editItemsButtonLabel).toBe('Customize summary');
            expect(nativeElement.editItemsButtonLabel).toBe('Customize summary');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <ok-fv-summary-panel #summaryPanel
                    [show-edit-items-button]="showEditItemsButton"
                    [legacy-style]="legacyStyle"
                    [edit-items-button-label]="editItemsButtonLabel">
                </ok-fv-summary-panel>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('summaryPanel', { read: OkFvSummaryPanelDirective }) public directive: OkFvSummaryPanelDirective;
            @ViewChild('summaryPanel', { read: ElementRef }) public elementRef: ElementRef<FvSummaryPanel>;
            public showEditItemsButton = false;
            public legacyStyle = false;
            public editItemsButtonLabel = 'Configure tiles';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSummaryPanelDirective;
        let nativeElement: FvSummaryPanel;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSummaryPanelModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for showEditItemsButton', () => {
            expect(directive.showEditItemsButton).toBeFalse();
            expect(nativeElement.showEditItemsButton).toBeFalse();

            fixture.componentInstance.showEditItemsButton = true;
            fixture.detectChanges();

            expect(directive.showEditItemsButton).toBeTrue();
            expect(nativeElement.showEditItemsButton).toBeTrue();
        });

        it('can be configured with property binding for legacyStyle', () => {
            expect(directive.legacyStyle).toBeFalse();
            expect(nativeElement.legacyStyle).toBeFalse();

            fixture.componentInstance.legacyStyle = true;
            fixture.detectChanges();

            expect(directive.legacyStyle).toBeTrue();
            expect(nativeElement.legacyStyle).toBeTrue();
        });

        it('can be configured with property binding for editItemsButtonLabel', () => {
            expect(directive.editItemsButtonLabel).toBe('Configure tiles');
            expect(nativeElement.editItemsButtonLabel).toBe('Configure tiles');

            fixture.componentInstance.editItemsButtonLabel = 'Customize summary';
            fixture.detectChanges();

            expect(directive.editItemsButtonLabel).toBe('Customize summary');
            expect(nativeElement.editItemsButtonLabel).toBe('Customize summary');
        });
    });
});
