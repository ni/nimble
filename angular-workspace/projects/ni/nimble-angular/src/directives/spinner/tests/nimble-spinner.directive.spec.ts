import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spinner, SpinnerSize, NimbleSpinnerDirective } from '../nimble-spinner.directive';
import { NimbleSpinnerModule } from '../nimble-spinner.module';

describe('Nimble Spinner', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleSpinnerModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-spinner')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-spinner #target></nimble-spinner>
            `
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleSpinnerDirective }) public directive: NimbleSpinnerDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Spinner>;
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

        it('has expected defaults for size', () => {
            expect(directive.size).toBe(SpinnerSize.default);
            expect(nativeElement.size).toBe(SpinnerSize.default);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-spinner #target
                    size="large"
                >
                </nimble-spinner>`
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleSpinnerDirective }) public directive: NimbleSpinnerDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Spinner>;
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

        it('will use template string values for size', () => {
            expect(directive.size).toBe(SpinnerSize.large);
            expect(nativeElement.size).toBe(SpinnerSize.large);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-spinner #target
                    [size]="size"
                >
                </nimble-spinner>
            `
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleSpinnerDirective }) public directive: NimbleSpinnerDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Spinner>;
            public size: SpinnerSize;
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

        it('can be configured with property binding for size', () => {
            expect(directive.size).toBe(SpinnerSize.default);
            expect(nativeElement.size).toBe(SpinnerSize.default);

            fixture.componentInstance.size = SpinnerSize.medium;
            fixture.detectChanges();

            expect(directive.size).toBe(SpinnerSize.medium);
            expect(nativeElement.size).toBe(SpinnerSize.medium);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-spinner #target
                    [attr.size]="size"
                >
                </nimble-spinner>
            `
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleSpinnerDirective }) public directive: NimbleSpinnerDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Spinner>;
            public size: SpinnerSize;
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

        it('can be configured with attribute binding for size', () => {
            expect(directive.size).toBe(SpinnerSize.default);
            expect(nativeElement.size).toBe(SpinnerSize.default);

            fixture.componentInstance.size = SpinnerSize.large;
            fixture.detectChanges();

            expect(directive.size).toBe(SpinnerSize.large);
            expect(nativeElement.size).toBe(SpinnerSize.large);
        });
    });
});