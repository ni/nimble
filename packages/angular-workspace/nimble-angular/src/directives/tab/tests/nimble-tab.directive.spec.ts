import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, ViewChild } from '@angular/core';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { NimbleTabModule } from '../nimble-tab.module';
import { NimbleTabDirective, Tab } from '../nimble-tab.directive';

describe('Nimble tab', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleTabModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-tab')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-tab #tab></nimble-tab>
            `
        })
        class TestHostComponent {
            @ViewChild('tab', { read: NimbleTabDirective }) public directive: NimbleTabDirective;
            @ViewChild('tab', { read: ElementRef }) public elementRef: ElementRef<Tab>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTabDirective;
        let nativeElement: Tab;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTabModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeUndefined();
            expect(nativeElement.disabled).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-tab #tab
                    disabled
                ></nimble-tab>
            `
        })
        class TestHostComponent {
            @ViewChild('tab', { read: NimbleTabDirective }) public directive: NimbleTabDirective;
            @ViewChild('tab', { read: ElementRef }) public elementRef: ElementRef<Tab>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTabDirective;
        let nativeElement: Tab;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTabModule]
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
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-tab #tab
                    [disabled]="disabled"
                ></nimble-tab>
            `
        })
        class TestHostComponent {
            @ViewChild('tab', { read: NimbleTabDirective }) public directive: NimbleTabDirective;
            @ViewChild('tab', { read: ElementRef }) public elementRef: ElementRef<Tab>;

            public disabled = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTabDirective;
        let nativeElement: Tab;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTabModule]
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
    });

    describe('with property attribute values', () => {
        @Component({
            template: `
                <nimble-tab #tab
                    [attr.disabled]="disabled">
                </nimble-tab>
            `
        })
        class TestHostComponent {
            @ViewChild('tab', { read: NimbleTabDirective }) public directive: NimbleTabDirective;
            @ViewChild('tab', { read: ElementRef }) public elementRef: ElementRef<Tab>;

            public disabled: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTabDirective;
        let nativeElement: Tab;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTabModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for disabled', () => {
            expect(directive.disabled).toBeUndefined();
            expect(nativeElement.disabled).toBeUndefined();

            fixture.componentInstance.disabled = '';
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });
    });
});
