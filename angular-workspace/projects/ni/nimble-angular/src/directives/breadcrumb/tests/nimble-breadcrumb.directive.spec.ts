import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Breadcrumb, BreadcrumbAppearance, NimbleBreadcrumbDirective } from '../nimble-breadcrumb.directive';
import { NimbleBreadcrumbModule } from '../nimble-breadcrumb.module';

describe('Nimble breadcrumb', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleBreadcrumbModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-breadcrumb')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-breadcrumb #target></nimble-breadcrumb>
            `
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleBreadcrumbDirective }) public directive: NimbleBreadcrumbDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Breadcrumb>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBreadcrumbDirective;
        let nativeElement: Breadcrumb;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBreadcrumbModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(BreadcrumbAppearance.default);
            expect(nativeElement.appearance).toBe(BreadcrumbAppearance.default);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-breadcrumb #target
                    appearance="prominent"
                >
                </nimble-breadcrumb>`
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleBreadcrumbDirective }) public directive: NimbleBreadcrumbDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Breadcrumb>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBreadcrumbDirective;
        let nativeElement: Breadcrumb;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBreadcrumbModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(BreadcrumbAppearance.prominent);
            expect(nativeElement.appearance).toBe(BreadcrumbAppearance.prominent);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-breadcrumb #target
                    [appearance]="appearance"
                >
                </nimble-breadcrumb>
            `
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleBreadcrumbDirective }) public directive: NimbleBreadcrumbDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Breadcrumb>;
            public appearance: BreadcrumbAppearance;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBreadcrumbDirective;
        let nativeElement: Breadcrumb;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBreadcrumbModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(BreadcrumbAppearance.default);
            expect(nativeElement.appearance).toBe(BreadcrumbAppearance.default);

            fixture.componentInstance.appearance = BreadcrumbAppearance.prominent;
            fixture.detectChanges();

            expect(directive.appearance).toBe(BreadcrumbAppearance.prominent);
            expect(nativeElement.appearance).toBe(BreadcrumbAppearance.prominent);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-breadcrumb #target
                    [attr.appearance]="appearance"
                >
                </nimble-breadcrumb>
            `
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleBreadcrumbDirective }) public directive: NimbleBreadcrumbDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Breadcrumb>;
            public appearance: BreadcrumbAppearance;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleBreadcrumbDirective;
        let nativeElement: Breadcrumb;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleBreadcrumbModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for appearance', () => {
            expect(directive.appearance).toBe(BreadcrumbAppearance.default);
            expect(nativeElement.appearance).toBe(BreadcrumbAppearance.default);

            fixture.componentInstance.appearance = BreadcrumbAppearance.prominent;
            fixture.detectChanges();

            expect(directive.appearance).toBe(BreadcrumbAppearance.prominent);
            expect(nativeElement.appearance).toBe(BreadcrumbAppearance.prominent);
        });
    });
});
