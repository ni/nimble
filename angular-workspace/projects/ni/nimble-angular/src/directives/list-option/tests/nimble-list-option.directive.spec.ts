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

        fit('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeUndefined();
            expect(nativeElement.disabled).toBeUndefined();
        });

        it('has expected defaults for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();
        });

        it('has expected defaults for hidden', () => {
            expect(directive.hidden).toBeFalse();
            expect(nativeElement.hidden).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-list-option #listOption
                    disabled
                    selected
                    hidden
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

        it('will use template string values for selected', () => {
            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });

        it('will use template string values for hidden', () => {
            expect(directive.hidden).toBeTrue();
            expect(nativeElement.hidden).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-list-option #listOption
                    [disabled]="disabled"
                    [selected]="selected"
                    [hidden]="hidden"
                ></nimble-list-option>
            `
        })
        class TestHostComponent {
            @ViewChild('listOption', { read: NimbleListOptionDirective }) public directive: NimbleListOptionDirective;
            @ViewChild('listOption', { read: ElementRef }) public elementRef: ElementRef<ListOption>;

            public disabled = false;
            public selected = false;
            public hidden = false;
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

        it('can be configured with property binding for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();

            fixture.componentInstance.selected = true;
            fixture.detectChanges();

            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });

        it('can be configured with property binding for hidden', () => {
            expect(directive.hidden).toBeFalse();
            expect(nativeElement.hidden).toBeFalse();

            fixture.componentInstance.hidden = true;
            fixture.detectChanges();

            expect(directive.hidden).toBeTrue();
            expect(nativeElement.hidden).toBeTrue();
        });
    });

    fdescribe('with property attribute values', () => {
        @Component({
            template: `
                <nimble-list-option #listOption
                    [attr.disabled]="disabled"
                    [attr.selected]="selected"
                    [attr.hidden]="hidden">
                </nimble-list-option>
            `
        })
        class TestHostComponent {
            @ViewChild('listOption', { read: NimbleListOptionDirective }) public directive: NimbleListOptionDirective;
            @ViewChild('listOption', { read: ElementRef }) public elementRef: ElementRef<ListOption>;

            public disabled: BooleanValueOrAttribute = null;
            public selected: BooleanValueOrAttribute = null;
            public hidden: BooleanValueOrAttribute = null;
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

        it('can be configured with attribute binding for selected', () => {
            expect(directive.selected).toBeFalse();
            expect(nativeElement.selected).toBeFalse();

            fixture.componentInstance.selected = '';
            fixture.detectChanges();

            expect(directive.selected).toBeTrue();
            expect(nativeElement.selected).toBeTrue();
        });

        it('can be configured with attribute binding for hidden', () => {
            expect(directive.hidden).toBeFalse();
            expect(nativeElement.hidden).toBeFalse();

            fixture.componentInstance.hidden = '';
            fixture.detectChanges();

            expect(directive.hidden).toBeTrue();
            expect(nativeElement.hidden).toBeTrue();
        });
    });
});
