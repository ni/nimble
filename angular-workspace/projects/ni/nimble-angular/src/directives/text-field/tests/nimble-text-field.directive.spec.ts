import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleTextFieldModule } from '../nimble-text-field.module';
import { NimbleTextFieldDirective, TextField } from '../nimble-text-field.directive';

describe('Nimble text field', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleTextFieldModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-text-field')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-text-field #textField></nimble-text-field>
            `
        })
        class TestHostComponent {
            @ViewChild('textField', { read: NimbleTextFieldDirective }) public directive: NimbleTextFieldDirective;
            @ViewChild('textField', { read: ElementRef }) public elementRef: ElementRef<TextField>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextFieldDirective;
        let nativeElement: TextField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for errorText', () => {
            expect(directive.errorText).toBeUndefined();
            expect(nativeElement.errorText).toBeUndefined();
        });

        it('can use the directive to set errorText', () => {
            directive.errorText = 'new value';
            expect(nativeElement.errorText).toBe('new value');
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-text-field #textField
                    error-text="error text">
                </nimble-text-field>`
        })
        class TestHostComponent {
            @ViewChild('textField', { read: NimbleTextFieldDirective }) public directive: NimbleTextFieldDirective;
            @ViewChild('textField', { read: ElementRef }) public elementRef: ElementRef<TextField>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextFieldDirective;
        let nativeElement: TextField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for errorText', () => {
            expect(directive.errorText).toBe('error text');
            expect(nativeElement.errorText).toBe('error text');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-text-field #textField
                    [error-text]="errorText">
                </nimble-text-field>`
        })
        class TestHostComponent {
            @ViewChild('textField', { read: NimbleTextFieldDirective }) public directive: NimbleTextFieldDirective;
            @ViewChild('textField', { read: ElementRef }) public elementRef: ElementRef<TextField>;
            public errorText = 'initial value';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextFieldDirective;
        let nativeElement: TextField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for errorText', () => {
            expect(directive.errorText).toBe('initial value');
            expect(nativeElement.errorText).toBe('initial value');

            fixture.componentInstance.errorText = 'new value';
            fixture.detectChanges();

            expect(directive.errorText).toBe('new value');
            expect(nativeElement.errorText).toBe('new value');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-text-field #textField
                    [attr.error-text]="errorText">
                </nimble-text-field>`
        })
        class TestHostComponent {
            @ViewChild('textField', { read: NimbleTextFieldDirective }) public directive: NimbleTextFieldDirective;
            @ViewChild('textField', { read: ElementRef }) public elementRef: ElementRef<TextField>;
            public errorText = 'initial value';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTextFieldDirective;
        let nativeElement: TextField;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTextFieldModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for errorText', () => {
            expect(directive.errorText).toBe('initial value');
            expect(nativeElement.errorText).toBe('initial value');

            fixture.componentInstance.errorText = 'new value';
            fixture.detectChanges();

            expect(directive.errorText).toBe('new value');
            expect(nativeElement.errorText).toBe('new value');
        });
    });
});
