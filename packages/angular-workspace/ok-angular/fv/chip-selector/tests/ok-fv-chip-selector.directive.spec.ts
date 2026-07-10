import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvChipSelector, OkFvChipSelectorDirective } from '../ok-fv-chip-selector.directive';
import { OkFvChipSelectorModule } from '../ok-fv-chip-selector.module';

describe('Ok fv chip selector', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvChipSelectorModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-chip-selector')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <ok-fv-chip-selector #chipSelector></ok-fv-chip-selector>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chipSelector', { read: OkFvChipSelectorDirective }) public directive: OkFvChipSelectorDirective;
            @ViewChild('chipSelector', { read: ElementRef }) public elementRef: ElementRef<FvChipSelector>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvChipSelectorDirective;
        let nativeElement: FvChipSelector;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvChipSelectorModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBe(false);
            expect(nativeElement.disabled).toBe(false);
        });

        it('has expected defaults for open', () => {
            expect(directive.open).toBe(false);
            expect(nativeElement.open).toBe(false);
        });

        it('has expected defaults for label', () => {
            expect(directive.label).toBe('');
            expect(nativeElement.label).toBe('');
        });

        it('has expected defaults for selectedValues', () => {
            expect(directive.selectedValues).toBe('');
            expect(nativeElement.selectedValues).toBe('');
        });

        it('has expected defaults for options', () => {
            expect(directive.options).toBe('');
            expect(nativeElement.options).toBe('');
        });

        it('has expected defaults for placeholder', () => {
            expect(directive.placeholder).toBe('Select values');
            expect(nativeElement.placeholder).toBe('Select values');
        });

        it('has expected defaults for allowCustomValues', () => {
            expect(directive.allowCustomValues).toBe(false);
            expect(nativeElement.allowCustomValues).toBe(false);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <ok-fv-chip-selector #chipSelector
                    disabled
                    label="Selected assets"
                    selected-values="PXI-1"
                    options="PXI-1,DAQ-1"
                    placeholder="Select assets"
                    allow-custom-values>
                </ok-fv-chip-selector>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chipSelector', { read: OkFvChipSelectorDirective }) public directive: OkFvChipSelectorDirective;
            @ViewChild('chipSelector', { read: ElementRef }) public elementRef: ElementRef<FvChipSelector>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvChipSelectorDirective;
        let nativeElement: FvChipSelector;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvChipSelectorModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for label', () => {
            expect(directive.label).toBe('Selected assets');
            expect(nativeElement.label).toBe('Selected assets');
        });

        it('will use template string values for selectedValues', () => {
            expect(directive.selectedValues).toBe('PXI-1');
            expect(nativeElement.selectedValues).toBe('PXI-1');
        });

        it('will use template string values for options', () => {
            expect(directive.options).toBe('PXI-1,DAQ-1');
            expect(nativeElement.options).toBe('PXI-1,DAQ-1');
        });

        it('will use template string values for placeholder', () => {
            expect(directive.placeholder).toBe('Select assets');
            expect(nativeElement.placeholder).toBe('Select assets');
        });

        it('will use template string values for allowCustomValues', () => {
            expect(directive.allowCustomValues).toBeTrue();
            expect(nativeElement.allowCustomValues).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <ok-fv-chip-selector #chipSelector
                    [disabled]="disabled"
                    [open]="open"
                    [label]="label"
                    [selected-values]="selectedValues"
                    [options]="options"
                    [placeholder]="placeholder"
                    [allow-custom-values]="allowCustomValues">
                </ok-fv-chip-selector>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('chipSelector', { read: OkFvChipSelectorDirective }) public directive: OkFvChipSelectorDirective;
            @ViewChild('chipSelector', { read: ElementRef }) public elementRef: ElementRef<FvChipSelector>;
            public disabled = false;
            public open = false;
            public label = 'Selected assets';
            public selectedValues = 'PXI-1';
            public options = 'PXI-1,DAQ-1';
            public placeholder = 'Select assets';
            public allowCustomValues = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvChipSelectorDirective;
        let nativeElement: FvChipSelector;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvChipSelectorModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
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

        it('can be configured with property binding for label', () => {
            expect(directive.label).toBe('Selected assets');
            expect(nativeElement.label).toBe('Selected assets');

            fixture.componentInstance.label = 'Selected systems';
            fixture.detectChanges();

            expect(directive.label).toBe('Selected systems');
            expect(nativeElement.label).toBe('Selected systems');
        });

        it('can be configured with property binding for selectedValues', () => {
            expect(directive.selectedValues).toBe('PXI-1');
            expect(nativeElement.selectedValues).toBe('PXI-1');

            fixture.componentInstance.selectedValues = 'DAQ-1,PXI-1';
            fixture.detectChanges();

            expect(directive.selectedValues).toBe('DAQ-1,PXI-1');
            expect(nativeElement.selectedValues).toBe('DAQ-1,PXI-1');
        });

        it('can be configured with property binding for options', () => {
            expect(directive.options).toBe('PXI-1,DAQ-1');
            expect(nativeElement.options).toBe('PXI-1,DAQ-1');

            fixture.componentInstance.options = 'PXI-1,DAQ-1,DMM-1';
            fixture.detectChanges();

            expect(directive.options).toBe('PXI-1,DAQ-1,DMM-1');
            expect(nativeElement.options).toBe('PXI-1,DAQ-1,DMM-1');
        });

        it('can be configured with property binding for placeholder', () => {
            expect(directive.placeholder).toBe('Select assets');
            expect(nativeElement.placeholder).toBe('Select assets');

            fixture.componentInstance.placeholder = 'Choose assets';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('Choose assets');
            expect(nativeElement.placeholder).toBe('Choose assets');
        });

        it('can be configured with property binding for allowCustomValues', () => {
            expect(directive.allowCustomValues).toBeFalse();
            expect(nativeElement.allowCustomValues).toBeFalse();

            fixture.componentInstance.allowCustomValues = true;
            fixture.detectChanges();

            expect(directive.allowCustomValues).toBeTrue();
            expect(nativeElement.allowCustomValues).toBeTrue();
        });
    });
});
