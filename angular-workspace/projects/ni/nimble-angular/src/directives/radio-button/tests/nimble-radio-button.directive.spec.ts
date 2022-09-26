import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '../../utilities/template-value-helpers';
import { NimbleRadioButtonDirective, RadioButton } from '../nimble-radio-button.directive';
import { NimbleRadioButtonModule } from '../nimble-radio-button.module';

describe('Nimble radio button', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleRadioButtonModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-radio-button')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-radio-button #radioButton></nimble-radio-button>
            `
        })
        class TestHostComponent {
            @ViewChild('radioButton', { read: NimbleRadioButtonDirective }) public directive: NimbleRadioButtonDirective;
            @ViewChild('radioButton', { read: ElementRef }) public elementRef: ElementRef<RadioButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioButtonDirective;
        let nativeElement: RadioButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioButtonModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalsy();
            expect(nativeElement.disabled).toBeFalsy();
        });

        it('can use the directive to set disabled', () => {
            directive.disabled = true;
            expect(nativeElement.disabled).toBeTrue();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: '<nimble-radio-button #radioButton disabled></nimble-radio-button>'
        })
        class TestHostComponent {
            @ViewChild('radioButton', { read: NimbleRadioButtonDirective }) public directive: NimbleRadioButtonDirective;
            @ViewChild('radioButton', { read: ElementRef }) public elementRef: ElementRef<RadioButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioButtonDirective;
        let nativeElement: RadioButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioButtonModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: '<nimble-radio-button #radioButton [disabled]="disabled"></nimble-radio-button>'
        })
        class TestHostComponent {
            @ViewChild('radioButton', { read: NimbleRadioButtonDirective }) public directive: NimbleRadioButtonDirective;
            @ViewChild('radioButton', { read: ElementRef }) public elementRef: ElementRef<RadioButton>;
            public disabled = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioButtonDirective;
        let nativeElement: RadioButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioButtonModule]
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

    describe('with attribute bound values', () => {
        @Component({
            template: '<nimble-radio-button #radioButton [attr.disabled]="disabled"></nimble-radio-button>'
        })
        class TestHostComponent {
            @ViewChild('radioButton', { read: NimbleRadioButtonDirective }) public directive: NimbleRadioButtonDirective;
            @ViewChild('radioButton', { read: ElementRef }) public elementRef: ElementRef<RadioButton>;
            public disabled: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioButtonDirective;
        let nativeElement: RadioButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioButtonModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for disabled', () => {
            expect(directive.disabled).toBeFalsy();
            expect(nativeElement.disabled).toBeFalsy();

            fixture.componentInstance.disabled = '';
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });
    });
});