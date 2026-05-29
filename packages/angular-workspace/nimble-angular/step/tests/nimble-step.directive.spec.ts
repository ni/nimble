import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { NimbleStepModule } from '../nimble-step.module';
import { NimbleStepDirective, StepSeverity, type Step } from '../nimble-step.directive';

describe('Nimble step', () => {
    const severity1 = StepSeverity.default;
    const severity2 = StepSeverity.error;
    const severityText1 = 'hello';
    const severityText2 = 'world';

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
            expect(directive.severity).toBe(StepSeverity.default);
            expect(nativeElement.severity).toBe(StepSeverity.default);
        });

        it('has expected defaults for severityText', () => {
            expect(directive.severityText).toBeUndefined();
            expect(nativeElement.severityText).toBeUndefined();
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
                    severity-text="${severityText1}"
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
            expect(directive.severity).toBe(StepSeverity.error);
            expect(nativeElement.severity).toBe(StepSeverity.error);
        });

        it('will use template string values for severityText', () => {
            expect(directive.severityText).toBe(severityText1);
            expect(nativeElement.severityText).toBe(severityText1);
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
                    [severityText]="severityText"
                    [disabled]="disabled"
                    [readonly]="readonly"
                    [selected]="selected"
                ></nimble-step>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('step', { read: NimbleStepDirective }) public directive: NimbleStepDirective;
            @ViewChild('step', { read: ElementRef }) public elementRef: ElementRef<Step>;
            public severity: StepSeverity = severity1;
            public severityText = severityText1;
            public disabled = false;
            public readonly = false;
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
            expect(directive.severity).toBe(severity1);
            expect(nativeElement.severity).toBe(severity1);

            fixture.componentInstance.severity = severity2;
            fixture.detectChanges();

            expect(directive.severity).toBe(severity2);
            expect(nativeElement.severity).toBe(severity2);
        });

        it('can be configured with property binding for severityText', () => {
            expect(directive.severityText).toBe(severityText1);
            expect(nativeElement.severityText).toBe(severityText1);

            fixture.componentInstance.severityText = severityText2;
            fixture.detectChanges();

            expect(directive.severityText).toBe(severityText2);
            expect(nativeElement.severityText).toBe(severityText2);
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

            fixture.componentInstance.readonly = true;
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
                    [attr.severity-text]="severityText"
                    [attr.disabled]="disabled"
                    [attr.readonly]="readonly"
                    [attr.selected]="selected"
                ></nimble-step>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('step', { read: NimbleStepDirective }) public directive: NimbleStepDirective;
            @ViewChild('step', { read: ElementRef }) public elementRef: ElementRef<Step>;
            public severity: StepSeverity = severity1;
            public severityText = severityText1;
            public disabled: BooleanValueOrAttribute = null;
            public readonly: BooleanValueOrAttribute = null;
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
            expect(directive.severity).toBe(severity1);
            expect(nativeElement.severity).toBe(severity1);

            fixture.componentInstance.severity = severity2;
            fixture.detectChanges();

            expect(directive.severity).toBe(severity2);
            expect(nativeElement.severity).toBe(severity2);
        });

        it('can be configured with attribute binding for severityText', () => {
            expect(directive.severityText).toBe(severityText1);
            expect(nativeElement.severityText).toBe(severityText1);

            fixture.componentInstance.severityText = severityText2;
            fixture.detectChanges();

            expect(directive.severityText).toBe(severityText2);
            expect(nativeElement.severityText).toBe(severityText2);
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

            fixture.componentInstance.readonly = '';
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
