import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerAppearance } from '../../../public-api';
import { Spinner, NimbleSpinnerDirective } from '../nimble-spinner.directive';
import { NimbleSpinnerModule } from '../nimble-spinner.module';

describe('Nimble Spinner', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleSpinnerModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-spinner')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-spinner #spinner></nimble-spinner>
            `
        })
        class TestHostComponent {
            @ViewChild('spinner', { read: NimbleSpinnerDirective }) public directive: NimbleSpinnerDirective;
            @ViewChild('spinner', { read: ElementRef }) public elementRef: ElementRef<Spinner>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSpinnerDirective;
        let nativeElement: Spinner;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSpinnerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(SpinnerAppearance.default);
            expect(nativeElement.appearance).toBe(SpinnerAppearance.default);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-spinner #spinner
                    appearance="accent">
                </nimble-spinner>
            `
        })
        class TestHostComponent {
            @ViewChild('spinner', { read: NimbleSpinnerDirective }) public directive: NimbleSpinnerDirective;
            @ViewChild('spinner', { read: ElementRef }) public elementRef: ElementRef<Spinner>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSpinnerDirective;
        let nativeElement: Spinner;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSpinnerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(SpinnerAppearance.accent);
            expect(nativeElement.appearance).toBe(SpinnerAppearance.accent);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-spinner #spinner
                    [appearance]="appearance">
                </nimble-spinner>
            `
        })
        class TestHostComponent {
            @ViewChild('spinner', { read: NimbleSpinnerDirective }) public directive: NimbleSpinnerDirective;
            @ViewChild('spinner', { read: ElementRef }) public elementRef: ElementRef<Spinner>;
            public appearance: SpinnerAppearance = SpinnerAppearance.default;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSpinnerDirective;
        let nativeElement: Spinner;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSpinnerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(SpinnerAppearance.default);
            expect(nativeElement.appearance).toBe(SpinnerAppearance.default);

            fixture.componentInstance.appearance = SpinnerAppearance.accent;
            fixture.detectChanges();

            expect(directive.appearance).toBe(SpinnerAppearance.accent);
            expect(nativeElement.appearance).toBe(SpinnerAppearance.accent);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-spinner #spinner
                    [attr.appearance]="appearance">
                </nimble-spinner>
            `
        })
        class TestHostComponent {
            @ViewChild('spinner', { read: NimbleSpinnerDirective }) public directive: NimbleSpinnerDirective;
            @ViewChild('spinner', { read: ElementRef }) public elementRef: ElementRef<Spinner>;
            public appearance: SpinnerAppearance = SpinnerAppearance.default;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSpinnerDirective;
        let nativeElement: Spinner;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSpinnerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for appearance', () => {
            expect(directive.appearance).toBe(SpinnerAppearance.default);
            expect(nativeElement.appearance).toBe(SpinnerAppearance.default);

            fixture.componentInstance.appearance = SpinnerAppearance.accent;
            fixture.detectChanges();

            expect(directive.appearance).toBe(SpinnerAppearance.accent);
            expect(nativeElement.appearance).toBe(SpinnerAppearance.accent);
        });
    });
});