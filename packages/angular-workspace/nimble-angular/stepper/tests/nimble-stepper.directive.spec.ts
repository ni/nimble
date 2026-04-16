import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleStepperModule } from '../nimble-stepper.module';
import { NimbleStepperDirective, type Stepper, StepperOrientation } from '../nimble-stepper.directive';

describe('Nimble stepper', () => {
    const orientation1 = StepperOrientation.horizontal;
    const orientation2 = StepperOrientation.vertical;

    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleStepperModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-stepper')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-stepper #stepper></nimble-stepper>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('stepper', { read: NimbleStepperDirective }) public directive: NimbleStepperDirective;
            @ViewChild('stepper', { read: ElementRef }) public elementRef: ElementRef<Stepper>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleStepperDirective;
        let nativeElement: Stepper;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleStepperModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for orientation', () => {
            expect(directive.orientation).toBe(StepperOrientation.horizontal);
            expect(nativeElement.orientation).toBe(StepperOrientation.horizontal);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-stepper #stepper
                    orientation="vertical">
                </nimble-stepper>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('stepper', { read: NimbleStepperDirective }) public directive: NimbleStepperDirective;
            @ViewChild('stepper', { read: ElementRef }) public elementRef: ElementRef<Stepper>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleStepperDirective;
        let nativeElement: Stepper;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleStepperModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for orientation', () => {
            expect(directive.orientation).toBe(StepperOrientation.vertical);
            expect(nativeElement.orientation).toBe(StepperOrientation.vertical);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-stepper #stepper
                    [orientation]="orientation">
                </nimble-stepper>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('stepper', { read: NimbleStepperDirective }) public directive: NimbleStepperDirective;
            @ViewChild('stepper', { read: ElementRef }) public elementRef: ElementRef<Stepper>;
            public orientation: StepperOrientation = orientation1;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleStepperDirective;
        let nativeElement: Stepper;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleStepperModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for orientation', () => {
            expect(directive.orientation).toBe(orientation1);
            expect(nativeElement.orientation).toBe(orientation1);

            fixture.componentInstance.orientation = orientation2;
            fixture.detectChanges();

            expect(directive.orientation).toBe(orientation2);
            expect(nativeElement.orientation).toBe(orientation2);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-stepper #stepper
                    [attr.orientation]="orientation">
                </nimble-stepper>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('stepper', { read: NimbleStepperDirective }) public directive: NimbleStepperDirective;
            @ViewChild('stepper', { read: ElementRef }) public elementRef: ElementRef<Stepper>;
            public orientation: StepperOrientation = orientation1;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleStepperDirective;
        let nativeElement: Stepper;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleStepperModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for orientation', () => {
            expect(directive.orientation).toBe(orientation1);
            expect(nativeElement.orientation).toBe(orientation1);

            fixture.componentInstance.orientation = orientation2;
            fixture.detectChanges();

            expect(directive.orientation).toBe(orientation2);
            expect(nativeElement.orientation).toBe(orientation2);
        });
    });
});
