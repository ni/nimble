import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute, NumberValueOrAttribute } from '../../utilities/template-value-helpers';
import { NimbleNumberFieldDirective, NumberField, NumberFieldAppearance } from '../nimble-number-field.directive';
import { NimbleNumberFieldModule } from '../nimble-number-field.module';

describe('Nimble number field', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleNumberFieldModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-number-field')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-number-field #numberField></nimble-number-field>
            `
        })
        class TestHostComponent {
            @ViewChild('numberField', { read: NimbleNumberFieldDirective }) public directive: NimbleNumberFieldDirective;
            @ViewChild('numberField', { read: ElementRef }) public elementRef: ElementRef<NumberField>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleNumberFieldDirective;
        let nativeElement: NumberField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleNumberFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(NumberFieldAppearance.underline);
            expect(nativeElement.appearance).toBe(NumberFieldAppearance.underline);
        });

        it('can use the directive to set appearance', () => {
            directive.appearance = NumberFieldAppearance.block;
            expect(nativeElement.appearance).toBe(NumberFieldAppearance.block);
        });

        it('has expected defaults for readOnly', () => {
            expect(directive.readOnly).toBeUndefined();
            expect(nativeElement.readOnly).toBeUndefined();
        });

        it('can use the directive to set readOnly', () => {
            directive.readOnly = true;
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('has expected defaults for min', () => {
            expect(directive.min).toBeUndefined();
            expect(nativeElement.min).toBeUndefined();
        });

        it('can use the directive to set min', () => {
            directive.min = 0;
            expect(nativeElement.min).toBe(0);
        });

        it('has expected defaults for max', () => {
            expect(directive.max).toBeUndefined();
            expect(nativeElement.max).toBeUndefined();
        });

        it('can use the directive to set max', () => {
            directive.max = 100;
            expect(nativeElement.max).toBe(100);
        });

        it('has expected defaults for step', () => {
            expect(directive.step).toBe(1);
            expect(nativeElement.step).toBe(1);
        });

        it('can use the directive to set step', () => {
            directive.step = 5;
            expect(nativeElement.step).toBe(5);
        });

        it('has expected defaults for placeholder', () => {
            expect(directive.placeholder).toBeUndefined();
            expect(nativeElement.placeholder).toBeUndefined();
        });

        it('can use the directive to set placeholder', () => {
            directive.placeholder = 'Put stuff here';
            expect(nativeElement.placeholder).toBe('Put stuff here');
        });

        it('has expected defaults for errorText', () => {
            expect(directive.errorText).toBeUndefined();
            expect(nativeElement.errorText).toBeUndefined();
        });

        it('can use the directive to set errorText', () => {
            directive.errorText = 'new value';
            expect(nativeElement.errorText).toBe('new value');
        });

        it('has expected defaults for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();
        });

        it('can use the directive to set errorVisible', () => {
            directive.errorVisible = true;
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-number-field #numberField
                    appearance="${NumberFieldAppearance.block}"
                    readonly
                    min=10
                    max=20
                    step=2
                    placeholder="Placeholder value"
                    error-text="error text"
                    error-visible
                >
                </nimble-number-field>`
        })
        class TestHostComponent {
            @ViewChild('numberField', { read: NimbleNumberFieldDirective }) public directive: NimbleNumberFieldDirective;
            @ViewChild('numberField', { read: ElementRef }) public elementRef: ElementRef<NumberField>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleNumberFieldDirective;
        let nativeElement: NumberField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleNumberFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(NumberFieldAppearance.block);
            expect(nativeElement.appearance).toBe(NumberFieldAppearance.block);
        });

        it('will use template string values for readonly', () => {
            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('will use template string values for min', () => {
            expect(directive.min).toBe(10);
            expect(nativeElement.min).toBe(10);
        });

        it('will use template string values for max', () => {
            expect(directive.max).toBe(20);
            expect(nativeElement.max).toBe(20);
        });

        it('will use template string values for step', () => {
            expect(directive.step).toBe(2);
            expect(nativeElement.step).toBe(2);
        });

        it('will use template string values for placeholder', () => {
            expect(directive.placeholder).toBe('Placeholder value');
            expect(nativeElement.placeholder).toBe('Placeholder value');
        });

        it('will use template string values for errorText', () => {
            expect(directive.errorText).toBe('error text');
            expect(nativeElement.errorText).toBe('error text');
        });

        it('will use template string values for errorVisible', () => {
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
            <nimble-number-field #numberField
                [appearance]="appearance"
                [readonly]="readonly"
                [min]="min"
                [max]="max"
                [step]="step"
                [placeholder]="placeholder"
                [error-text]="errorText"
                [error-visible]="errorVisible"
            >
            </nimble-number-field>`
        })
        class TestHostComponent {
            @ViewChild('numberField', { read: NimbleNumberFieldDirective }) public directive: NimbleNumberFieldDirective;
            @ViewChild('numberField', { read: ElementRef }) public elementRef: ElementRef<NumberField>;
            public appearance: NumberFieldAppearance = NumberFieldAppearance.block;
            public readonly = false;
            public min = 10;
            public max = 20;
            public step = 2;
            public placeholder = 'initial';
            public errorText = 'initial value';
            public errorVisible = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleNumberFieldDirective;
        let nativeElement: NumberField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleNumberFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(NumberFieldAppearance.block);
            expect(nativeElement.appearance).toBe(NumberFieldAppearance.block);

            fixture.componentInstance.appearance = NumberFieldAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toBe(NumberFieldAppearance.outline);
            expect(nativeElement.appearance).toBe(NumberFieldAppearance.outline);
        });

        it('can be configured with property binding for readOnly', () => {
            expect(directive.readOnly).toBeFalse();
            expect(nativeElement.readOnly).toBeFalse();

            fixture.componentInstance.readonly = true;
            fixture.detectChanges();

            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('can be configured with property binding for min', () => {
            expect(directive.min).toBe(10);
            expect(nativeElement.min).toBe(10);

            fixture.componentInstance.min = 15;
            fixture.detectChanges();

            expect(directive.min).toBe(15);
            expect(nativeElement.min).toBe(15);
        });

        it('can be configured with property binding for max', () => {
            expect(directive.max).toBe(20);
            expect(nativeElement.max).toBe(20);

            fixture.componentInstance.max = 25;
            fixture.detectChanges();

            expect(directive.max).toBe(25);
            expect(nativeElement.max).toBe(25);
        });

        it('can be configured with property binding for step', () => {
            expect(directive.step).toBe(2);
            expect(nativeElement.step).toBe(2);

            fixture.componentInstance.step = 1;
            fixture.detectChanges();

            expect(directive.step).toBe(1);
            expect(nativeElement.step).toBe(1);
        });

        it('can be configured with property binding for placeholder', () => {
            expect(directive.placeholder).toBe('initial');
            expect(nativeElement.placeholder).toBe('initial');

            fixture.componentInstance.placeholder = 'ph';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('ph');
            expect(nativeElement.placeholder).toBe('ph');
        });

        it('can be configured with property binding for errorText', () => {
            expect(directive.errorText).toBe('initial value');
            expect(nativeElement.errorText).toBe('initial value');

            fixture.componentInstance.errorText = 'new value';
            fixture.detectChanges();

            expect(directive.errorText).toBe('new value');
            expect(nativeElement.errorText).toBe('new value');
        });

        it('can be configured with property binding for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();

            fixture.componentInstance.errorVisible = true;
            fixture.detectChanges();

            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-number-field #numberField
                    [attr.appearance]="appearance"
                    [attr.readonly]="readonly"
                    [attr.min]="min"
                    [attr.max]="max"
                    [attr.step]="step"
                    [attr.placeholder]="placeholder"
                    [attr.error-text]="errorText"
                    [attr.error-visible]="errorVisible"
                >
                </nimble-number-field>`
        })
        class TestHostComponent {
            @ViewChild('numberField', { read: NimbleNumberFieldDirective }) public directive: NimbleNumberFieldDirective;
            @ViewChild('numberField', { read: ElementRef }) public elementRef: ElementRef<NumberField>;
            public appearance: NumberFieldAppearance = NumberFieldAppearance.block;
            public readonly: BooleanValueOrAttribute = null;
            public min: NumberValueOrAttribute = 10;
            public max: NumberValueOrAttribute = 20;
            public step: NumberValueOrAttribute = 2;
            public placeholder = 'initial';
            public errorText = 'initial value';
            public errorVisible: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleNumberFieldDirective;
        let nativeElement: NumberField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleNumberFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for appearance', () => {
            expect(directive.appearance).toBe(NumberFieldAppearance.block);
            expect(nativeElement.appearance).toBe(NumberFieldAppearance.block);

            fixture.componentInstance.appearance = NumberFieldAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toBe(NumberFieldAppearance.outline);
            expect(nativeElement.appearance).toBe(NumberFieldAppearance.outline);
        });

        it('can be configured with attribute binding for readOnly', () => {
            expect(directive.readOnly).toBeUndefined();
            expect(nativeElement.readOnly).toBeUndefined();

            fixture.componentInstance.readonly = '';
            fixture.detectChanges();

            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('can be configured with attribute binding for min', () => {
            expect(directive.min).toBe(10);
            expect(nativeElement.min).toBe(10);

            fixture.componentInstance.min = 15;
            fixture.detectChanges();

            expect(directive.min).toBe(15);
            expect(nativeElement.min).toBe(15);
        });

        it('can be configured with attribute binding for max', () => {
            expect(directive.max).toBe(20);
            expect(nativeElement.max).toBe(20);

            fixture.componentInstance.max = 25;
            fixture.detectChanges();

            expect(directive.max).toBe(25);
            expect(nativeElement.max).toBe(25);
        });

        it('can be configured with attribute binding for step', () => {
            expect(directive.step).toBe(2);
            expect(nativeElement.step).toBe(2);

            fixture.componentInstance.step = 1;
            fixture.detectChanges();

            expect(directive.step).toBe(1);
            expect(nativeElement.step).toBe(1);
        });

        it('can be configured with attribute binding for placeholder', () => {
            expect(directive.placeholder).toBe('initial');
            expect(nativeElement.placeholder).toBe('initial');

            fixture.componentInstance.placeholder = 'ph';
            fixture.detectChanges();

            expect(directive.placeholder).toBe('ph');
            expect(nativeElement.placeholder).toBe('ph');
        });

        it('can be configured with attribute binding for errorText', () => {
            expect(directive.errorText).toBe('initial value');
            expect(nativeElement.errorText).toBe('initial value');

            fixture.componentInstance.errorText = 'new value';
            fixture.detectChanges();

            expect(directive.errorText).toBe('new value');
            expect(nativeElement.errorText).toBe('new value');
        });

        it('can be configured with attribute binding for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();

            fixture.componentInstance.errorVisible = '';
            fixture.detectChanges();

            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });
    });
});