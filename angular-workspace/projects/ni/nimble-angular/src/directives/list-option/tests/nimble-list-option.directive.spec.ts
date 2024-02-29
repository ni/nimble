import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, ViewChild } from '@angular/core';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { NimbleListOptionModule } from '../nimble-list-option.module';
import type { ListOption } from '../../../public-api';
import { NimbleListOptionDirective } from '../nimble-list-option.directive';

describe('Nimble listbox option', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleListOptionModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-list-option')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-list-option #listOption></nimble-list-option>
            `
        })
        class TestHostComponent {
            @ViewChild('listOption', { read: NimbleListOptionDirective }) public directive: NimbleListOptionDirective;
            @ViewChild('listOption', { read: ElementRef }) public elementRef: ElementRef<ListOption>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleListOptionDirective;
        let nativeElement: ListOption;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleListOptionModule]
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
                <nimble-list-option #listOption
                    disabled
                ></nimble-list-option>
            `
        })
        class TestHostComponent {
            @ViewChild('listOption', { read: NimbleListOptionDirective }) public directive: NimbleListOptionDirective;
            @ViewChild('listOption', { read: ElementRef }) public elementRef: ElementRef<ListOption>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleListOptionDirective;
        let nativeElement: ListOption;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleListOptionModule]
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
                <nimble-list-option #listOption
                    [disabled]="disabled"
                ></nimble-list-option>
            `
        })
        class TestHostComponent {
            @ViewChild('listOption', { read: NimbleListOptionDirective }) public directive: NimbleListOptionDirective;
            @ViewChild('listOption', { read: ElementRef }) public elementRef: ElementRef<ListOption>;

            public disabled = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleListOptionDirective;
        let nativeElement: ListOption;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleListOptionModule]
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
                <nimble-list-option #listOption
                    [attr.disabled]="disabled">
                </nimble-list-option>
            `
        })
        class TestHostComponent {
            @ViewChild('listOption', { read: NimbleListOptionDirective }) public directive: NimbleListOptionDirective;
            @ViewChild('listOption', { read: ElementRef }) public elementRef: ElementRef<ListOption>;

            public disabled: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleListOptionDirective;
        let nativeElement: ListOption;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleListOptionModule]
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
