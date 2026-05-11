import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvSplitButtonAnchor, FvSplitButtonAnchorAppearance, FvSplitButtonAnchorAppearanceVariant, OkFvSplitButtonAnchorDirective } from '../ok-fv-split-button-anchor.directive';
import { OkFvSplitButtonAnchorModule } from '../ok-fv-split-button-anchor.module';

describe('Ok fv split button anchor', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvSplitButtonAnchorModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-split-button-anchor')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <ok-fv-split-button-anchor #splitButtonAnchor></ok-fv-split-button-anchor>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('splitButtonAnchor', { read: OkFvSplitButtonAnchorDirective }) public directive: OkFvSplitButtonAnchorDirective;
            @ViewChild('splitButtonAnchor', { read: ElementRef }) public elementRef: ElementRef<FvSplitButtonAnchor>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSplitButtonAnchorDirective;
        let nativeElement: FvSplitButtonAnchor;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSplitButtonAnchorModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for label', () => {
            expect(directive.label).toBe('Primary function');
            expect(nativeElement.label).toBe('Primary function');
        });

        it('has expected defaults for href', () => {
            expect(directive.href).toBe('');
            expect(nativeElement.href).toBe('');
        });

        it('has expected defaults for target', () => {
            expect(directive.target).toBe('');
            expect(nativeElement.target).toBe('');
        });

        it('has expected defaults for rel', () => {
            expect(directive.rel).toBe('');
            expect(nativeElement.rel).toBe('');
        });

        it('has expected defaults for download', () => {
            expect(directive.download).toBe('');
            expect(nativeElement.download).toBe('');
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBe(false);
            expect(nativeElement.disabled).toBe(false);
        });

        it('has expected defaults for open', () => {
            expect(directive.open).toBe(false);
            expect(nativeElement.open).toBe(false);
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(FvSplitButtonAnchorAppearance.outline);
            expect(nativeElement.appearance).toBe(FvSplitButtonAnchorAppearance.outline);
        });

        it('has expected defaults for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(FvSplitButtonAnchorAppearanceVariant.default);
            expect(nativeElement.appearanceVariant).toBe(FvSplitButtonAnchorAppearanceVariant.default);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <ok-fv-split-button-anchor #splitButtonAnchor
                    label="Open report"
                    href="https://example.com/report"
                    target="_blank"
                    rel="noopener"
                    download="report.csv"
                    disabled
                    appearance="block"
                    appearance-variant="primary">
                </ok-fv-split-button-anchor>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('splitButtonAnchor', { read: OkFvSplitButtonAnchorDirective }) public directive: OkFvSplitButtonAnchorDirective;
            @ViewChild('splitButtonAnchor', { read: ElementRef }) public elementRef: ElementRef<FvSplitButtonAnchor>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSplitButtonAnchorDirective;
        let nativeElement: FvSplitButtonAnchor;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSplitButtonAnchorModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for label', () => {
            expect(directive.label).toBe('Open report');
            expect(nativeElement.label).toBe('Open report');
        });

        it('will use template string values for href', () => {
            expect(directive.href).toBe('https://example.com/report');
            expect(nativeElement.href).toBe('https://example.com/report');
        });

        it('will use template string values for target', () => {
            expect(directive.target).toBe('_blank');
            expect(nativeElement.target).toBe('_blank');
        });

        it('will use template string values for rel', () => {
            expect(directive.rel).toBe('noopener');
            expect(nativeElement.rel).toBe('noopener');
        });

        it('will use template string values for download', () => {
            expect(directive.download).toBe('report.csv');
            expect(nativeElement.download).toBe('report.csv');
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(FvSplitButtonAnchorAppearance.block);
            expect(nativeElement.appearance).toBe(FvSplitButtonAnchorAppearance.block);
        });

        it('will use template string values for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(FvSplitButtonAnchorAppearanceVariant.primary);
            expect(nativeElement.appearanceVariant).toBe(FvSplitButtonAnchorAppearanceVariant.primary);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <ok-fv-split-button-anchor #splitButtonAnchor
                    [label]="label"
                    [href]="href"
                    [target]="target"
                    [rel]="rel"
                    [download]="download"
                    [disabled]="disabled"
                    [open]="open"
                    [appearance]="appearance"
                    [appearance-variant]="appearanceVariant">
                </ok-fv-split-button-anchor>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('splitButtonAnchor', { read: OkFvSplitButtonAnchorDirective }) public directive: OkFvSplitButtonAnchorDirective;
            @ViewChild('splitButtonAnchor', { read: ElementRef }) public elementRef: ElementRef<FvSplitButtonAnchor>;
            public label = 'Open report';
            public href = 'https://example.com/report';
            public target = '_blank';
            public rel = 'noopener';
            public download = 'report.csv';
            public disabled = false;
            public open = false;
            public appearance: FvSplitButtonAnchorAppearance = FvSplitButtonAnchorAppearance.outline;
            public appearanceVariant: FvSplitButtonAnchorAppearanceVariant = FvSplitButtonAnchorAppearanceVariant.default;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSplitButtonAnchorDirective;
        let nativeElement: FvSplitButtonAnchor;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSplitButtonAnchorModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for label', () => {
            expect(directive.label).toBe('Open report');
            expect(nativeElement.label).toBe('Open report');

            fixture.componentInstance.label = 'Open dashboard';
            fixture.detectChanges();

            expect(directive.label).toBe('Open dashboard');
            expect(nativeElement.label).toBe('Open dashboard');
        });

        it('can be configured with property binding for href', () => {
            expect(directive.href).toBe('https://example.com/report');
            expect(nativeElement.href).toBe('https://example.com/report');

            fixture.componentInstance.href = 'https://example.com/dashboard';
            fixture.detectChanges();

            expect(directive.href).toBe('https://example.com/dashboard');
            expect(nativeElement.href).toBe('https://example.com/dashboard');
        });

        it('can be configured with property binding for target', () => {
            expect(directive.target).toBe('_blank');
            expect(nativeElement.target).toBe('_blank');

            fixture.componentInstance.target = '_self';
            fixture.detectChanges();

            expect(directive.target).toBe('_self');
            expect(nativeElement.target).toBe('_self');
        });

        it('can be configured with property binding for rel', () => {
            expect(directive.rel).toBe('noopener');
            expect(nativeElement.rel).toBe('noopener');

            fixture.componentInstance.rel = 'noreferrer';
            fixture.detectChanges();

            expect(directive.rel).toBe('noreferrer');
            expect(nativeElement.rel).toBe('noreferrer');
        });

        it('can be configured with property binding for download', () => {
            expect(directive.download).toBe('report.csv');
            expect(nativeElement.download).toBe('report.csv');

            fixture.componentInstance.download = 'summary.csv';
            fixture.detectChanges();

            expect(directive.download).toBe('summary.csv');
            expect(nativeElement.download).toBe('summary.csv');
        });

        it('can be configured with property binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with property binding for open', () => {
            expect(directive.open).toBeFalse();
            expect(nativeElement.open).toBeFalse();

            fixture.componentInstance.open = true;
            fixture.detectChanges();

            expect(directive.open).toBeTrue();
            expect(nativeElement.open).toBeTrue();
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(FvSplitButtonAnchorAppearance.outline);
            expect(nativeElement.appearance).toBe(FvSplitButtonAnchorAppearance.outline);

            fixture.componentInstance.appearance = FvSplitButtonAnchorAppearance.block;
            fixture.detectChanges();

            expect(directive.appearance).toBe(FvSplitButtonAnchorAppearance.block);
            expect(nativeElement.appearance).toBe(FvSplitButtonAnchorAppearance.block);
        });

        it('can be configured with property binding for appearanceVariant', () => {
            expect(directive.appearanceVariant).toBe(FvSplitButtonAnchorAppearanceVariant.default);
            expect(nativeElement.appearanceVariant).toBe(FvSplitButtonAnchorAppearanceVariant.default);

            fixture.componentInstance.appearanceVariant = FvSplitButtonAnchorAppearanceVariant.primary;
            fixture.detectChanges();

            expect(directive.appearanceVariant).toBe(FvSplitButtonAnchorAppearanceVariant.primary);
            expect(nativeElement.appearanceVariant).toBe(FvSplitButtonAnchorAppearanceVariant.primary);
        });
    });
});
