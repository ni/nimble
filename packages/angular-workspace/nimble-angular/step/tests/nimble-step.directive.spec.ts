import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { NimbleStepModule } from '../nimble-step.module';
import { NimbleStepDirective, type Step, type StepSeverity } from '../nimble-step.directive';

describe('Nimble step', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleStepModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-step')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-step #step></nimble-step>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('step', { read: NimbleStepDirective }) public directive: NimbleStepDirective;
            @ViewChild('step', { read: ElementRef }) public elementRef: ElementRef<Step>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleStepDirective;
        let nativeElement: Step;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleStepModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for severity', () => {
            expect(directive.severity).toBeUndefined();
            expect(nativeElement.severity).toBeUndefined();
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('has expected defaults for readOnly', () => {
            expect(directive.readOnly).toBeFalse();
            expect(nativeElement.readOnly).toBeFalse();
        });

        it('has expected defaults for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-step #step
                    severity="error"
                    disabled
                    readonly
                    selected
                ></nimble-step>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('step', { read: NimbleStepDirective }) public directive: NimbleStepDirective;
            @ViewChild('step', { read: ElementRef }) public elementRef: ElementRef<Step>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleStepDirective;
        let nativeElement: Step;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleStepModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for severity', () => {
            expect(directive.severity).toBe('error');
            expect(nativeElement.severity).toBe('error');
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for readOnly', () => {
            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('will use template string values for selected', () => {
            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-step #step
                    [severity]="severity"
                    [disabled]="disabled"
                    [readOnly]="readOnly"
                    [selected]="selected"
                ></nimble-step>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('step', { read: NimbleStepDirective }) public directive: NimbleStepDirective;
            @ViewChild('step', { read: ElementRef }) public elementRef: ElementRef<Step>;
            public severity: StepSeverity;
            public disabled = false;
            public readOnly = false;
            public selected = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleStepDirective;
        let nativeElement: Step;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleStepModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for severity', () => {
            expect(directive.severity).toBeUndefined();
            expect(nativeElement.severity).toBeUndefined();

            fixture.componentInstance.severity = 'error';
            fixture.detectChanges();

            expect(directive.severity).toBe('error');
            expect(nativeElement.severity).toBe('error');
        });

        it('can be configured with property binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with property binding for readOnly', () => {
            expect(directive.readOnly).toBeFalse();
            expect(nativeElement.readOnly).toBeFalse();

            fixture.componentInstance.readOnly = true;
            fixture.detectChanges();

            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('can be configured with property binding for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();

            fixture.componentInstance.selected = true;
            fixture.detectChanges();

            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-step #step
                    [attr.severity]="severity"
                    [attr.disabled]="disabled"
                    [attr.readonly]="readOnly"
                    [attr.selected]="selected"
                ></nimble-step>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('step', { read: NimbleStepDirective }) public directive: NimbleStepDirective;
            @ViewChild('step', { read: ElementRef }) public elementRef: ElementRef<Step>;
            public severity: StepSeverity;
            public disabled: BooleanValueOrAttribute = null;
            public readOnly: BooleanValueOrAttribute = null;
            public selected: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleStepDirective;
        let nativeElement: Step;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleStepModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for severity', () => {
            expect(directive.severity).toBeUndefined();
            expect(nativeElement.severity).toBeUndefined();

            fixture.componentInstance.severity = 'warning';
            fixture.detectChanges();

            expect(directive.severity).toBe('warning');
            expect(nativeElement.severity).toBe('warning');
        });

        it('can be configured with attribute binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = '';
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with attribute binding for readOnly', () => {
            expect(directive.readOnly).toBeFalse();
            expect(nativeElement.readOnly).toBeFalse();

            fixture.componentInstance.readOnly = '';
            fixture.detectChanges();

            expect(directive.readOnly).toBeTrue();
            expect(nativeElement.readOnly).toBeTrue();
        });

        it('can be configured with attribute binding for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();

            fixture.componentInstance.selected = '';
            fixture.detectChanges();

            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });
    });
});
