import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvSummaryPanelTile, FvSummaryPanelTileTextPosition, OkFvSummaryPanelTileDirective } from '../ok-fv-summary-panel-tile.directive';
import { OkFvSummaryPanelTileModule } from '../ok-fv-summary-panel-tile.module';

describe('Ok fv summary panel tile', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvSummaryPanelTileModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-summary-panel-tile')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <ok-fv-summary-panel-tile #summaryPanelTile></ok-fv-summary-panel-tile>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('summaryPanelTile', { read: OkFvSummaryPanelTileDirective }) public directive: OkFvSummaryPanelTileDirective;
            @ViewChild('summaryPanelTile', { read: ElementRef }) public elementRef: ElementRef<FvSummaryPanelTile>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSummaryPanelTileDirective;
        let nativeElement: FvSummaryPanelTile;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSummaryPanelTileModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for count', () => {
            expect(directive.count).toBe('');
            expect(nativeElement.count).toBe('');
        });

        it('has expected defaults for label', () => {
            expect(directive.label).toBe('');
            expect(nativeElement.label).toBe('');
        });

        it('has expected defaults for legacyStyle', () => {
            expect(directive.legacyStyle).toBe(false);
            expect(nativeElement.legacyStyle).toBe(false);
        });

        it('has expected defaults for selected', () => {
            expect(directive.selected).toBe(false);
            expect(nativeElement.selected).toBe(false);
        });

        it('has expected defaults for textPosition', () => {
            expect(directive.textPosition).toBe(FvSummaryPanelTileTextPosition.beside);
            expect(nativeElement.textPosition).toBe(FvSummaryPanelTileTextPosition.beside);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <ok-fv-summary-panel-tile #summaryPanelTile
                    count="7"
                    label="open items"
                    legacy-style
                    selected
                    text-position="under">
                </ok-fv-summary-panel-tile>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('summaryPanelTile', { read: OkFvSummaryPanelTileDirective }) public directive: OkFvSummaryPanelTileDirective;
            @ViewChild('summaryPanelTile', { read: ElementRef }) public elementRef: ElementRef<FvSummaryPanelTile>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSummaryPanelTileDirective;
        let nativeElement: FvSummaryPanelTile;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSummaryPanelTileModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for count', () => {
            expect(directive.count).toBe('7');
            expect(nativeElement.count).toBe('7');
        });

        it('will use template string values for label', () => {
            expect(directive.label).toBe('open items');
            expect(nativeElement.label).toBe('open items');
        });

        it('will use template string values for legacyStyle', () => {
            expect(directive.legacyStyle).toBeTrue();
            expect(nativeElement.legacyStyle).toBeTrue();
        });

        it('will use template string values for selected', () => {
            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });

        it('will use template string values for textPosition', () => {
            expect(directive.textPosition).toBe(FvSummaryPanelTileTextPosition.under);
            expect(nativeElement.textPosition).toBe(FvSummaryPanelTileTextPosition.under);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <ok-fv-summary-panel-tile #summaryPanelTile
                    [count]="count"
                    [label]="label"
                    [legacy-style]="legacyStyle"
                    [selected]="selected"
                    [text-position]="textPosition">
                </ok-fv-summary-panel-tile>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('summaryPanelTile', { read: OkFvSummaryPanelTileDirective }) public directive: OkFvSummaryPanelTileDirective;
            @ViewChild('summaryPanelTile', { read: ElementRef }) public elementRef: ElementRef<FvSummaryPanelTile>;
            public count = '7';
            public label = 'open items';
            public legacyStyle = false;
            public selected = false;
            public textPosition: FvSummaryPanelTileTextPosition = FvSummaryPanelTileTextPosition.beside;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSummaryPanelTileDirective;
        let nativeElement: FvSummaryPanelTile;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSummaryPanelTileModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for count', () => {
            expect(directive.count).toBe('7');
            expect(nativeElement.count).toBe('7');

            fixture.componentInstance.count = '12';
            fixture.detectChanges();

            expect(directive.count).toBe('12');
            expect(nativeElement.count).toBe('12');
        });

        it('can be configured with property binding for label', () => {
            expect(directive.label).toBe('open items');
            expect(nativeElement.label).toBe('open items');

            fixture.componentInstance.label = 'pending reviews';
            fixture.detectChanges();

            expect(directive.label).toBe('pending reviews');
            expect(nativeElement.label).toBe('pending reviews');
        });

        it('can be configured with property binding for legacyStyle', () => {
            expect(directive.legacyStyle).toBeFalse();
            expect(nativeElement.legacyStyle).toBeFalse();

            fixture.componentInstance.legacyStyle = true;
            fixture.detectChanges();

            expect(directive.legacyStyle).toBeTrue();
            expect(nativeElement.legacyStyle).toBeTrue();
        });

        it('can be configured with property binding for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();

            fixture.componentInstance.selected = true;
            fixture.detectChanges();

            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });

        it('can be configured with property binding for textPosition', () => {
            expect(directive.textPosition).toBe(FvSummaryPanelTileTextPosition.beside);
            expect(nativeElement.textPosition).toBe(FvSummaryPanelTileTextPosition.beside);

            fixture.componentInstance.textPosition = FvSummaryPanelTileTextPosition.under;
            fixture.detectChanges();

            expect(directive.textPosition).toBe(FvSummaryPanelTileTextPosition.under);
            expect(nativeElement.textPosition).toBe(FvSummaryPanelTileTextPosition.under);
        });
    });
});
