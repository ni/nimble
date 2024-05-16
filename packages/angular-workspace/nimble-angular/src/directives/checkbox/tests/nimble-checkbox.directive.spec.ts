import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { Checkbox, NimbleCheckboxDirective } from '../nimble-checkbox.directive';
import { NimbleCheckboxModule } from '../nimble-checkbox.module';

describe('Nimble checkbox', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleCheckboxModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-checkbox')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-checkbox #checkbox></nimble-checkbox>
            `
        })
        class TestHostComponent {
            @ViewChild('checkbox', { read: NimbleCheckboxDirective }) public directive: NimbleCheckboxDirective;
            @ViewChild('checkbox', { read: ElementRef }) public elementRef: ElementRef<Checkbox>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleCheckboxDirective;
        let nativeElement: Checkbox;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleCheckboxModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('has expected defaults for checked', () => {
            expect(directive.checked).toBeFalse();
            expect(nativeElement.checked).toBeFalse();
        });

        it('has expected defaults for indeterminate', () => {
            expect(directive.indeterminate).toBeFalse();
            expect(nativeElement.indeterminate).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-checkbox #checkbox
                    disabled
                    checked
                    indeterminate>
                </nimble-checkbox>`
        })
        class TestHostComponent {
            @ViewChild('checkbox', { read: NimbleCheckboxDirective }) public directive: NimbleCheckboxDirective;
            @ViewChild('checkbox', { read: ElementRef }) public elementRef: ElementRef<Checkbox>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleCheckboxDirective;
        let nativeElement: Checkbox;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleCheckboxModule]
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

        it('will use template string values for checked', () => {
            expect(directive.checked).toBeTrue();
            expect(nativeElement.checked).toBeTrue();
        });

        it('will use template string values for indeterminate', () => {
            expect(directive.indeterminate).toBeTrue();
            expect(nativeElement.indeterminate).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-checkbox #checkbox
                    [disabled]="disabled"
                    [checked]="checked"
                    [indeterminate]="indeterminate">
                </nimble-checkbox>
            `
        })
        class TestHostComponent {
            @ViewChild('checkbox', { read: NimbleCheckboxDirective }) public directive: NimbleCheckboxDirective;
            @ViewChild('checkbox', { read: ElementRef }) public elementRef: ElementRef<Checkbox>;
            public disabled = false;
            public checked = false;
            public indeterminate = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleCheckboxDirective;
        let nativeElement: Checkbox;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleCheckboxModule]
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

        it('can be configured with property binding for checked', () => {
            expect(directive.checked).toBeFalse();
            expect(nativeElement.checked).toBeFalse();

            fixture.componentInstance.checked = true;
            fixture.detectChanges();

            expect(directive.checked).toBeTrue();
            expect(nativeElement.checked).toBeTrue();
        });

        it('can be configured with property binding for indeterminate', () => {
            expect(directive.indeterminate).toBeFalse();
            expect(nativeElement.indeterminate).toBeFalse();

            fixture.componentInstance.indeterminate = true;
            fixture.detectChanges();

            expect(directive.indeterminate).toBeTrue();
            expect(nativeElement.indeterminate).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-checkbox #checkbox
                    [attr.disabled]="disabled"
                    [attr.checked]="checked">
                </nimble-checkbox>
            `
        })
        class TestHostComponent {
            @ViewChild('checkbox', { read: NimbleCheckboxDirective }) public directive: NimbleCheckboxDirective;
            @ViewChild('checkbox', { read: ElementRef }) public elementRef: ElementRef<Checkbox>;
            public disabled: BooleanValueOrAttribute = null;
            public checked: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleCheckboxDirective;
        let nativeElement: Checkbox;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleCheckboxModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = '';
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with attribute binding for checked', () => {
            expect(directive.checked).toBeFalse();
            expect(nativeElement.checked).toBeFalse();

            fixture.componentInstance.checked = '';
            fixture.detectChanges();

            expect(directive.checked).toBeTrue();
            expect(nativeElement.checked).toBeTrue();
        });

        // indeterminate property does not have a matching attribute
    });
});
