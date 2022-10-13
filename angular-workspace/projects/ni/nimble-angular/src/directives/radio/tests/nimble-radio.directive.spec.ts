import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '../../utilities/template-value-helpers';
import { NimbleRadioDirective, Radio } from '../nimble-radio.directive';
import { NimbleRadioModule } from '../nimble-radio.module';

describe('Nimble radio', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleRadioModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-radio')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-radio #radio></nimble-radio>
            `
        })
        class TestHostComponent {
            @ViewChild('radio', { read: NimbleRadioDirective }) public directive: NimbleRadioDirective;
            @ViewChild('radio', { read: ElementRef }) public elementRef: ElementRef<Radio>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioDirective;
        let nativeElement: Radio;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioModule]
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
            template: '<nimble-radio #radio disabled></nimble-radio>'
        })
        class TestHostComponent {
            @ViewChild('radio', { read: NimbleRadioDirective }) public directive: NimbleRadioDirective;
            @ViewChild('radio', { read: ElementRef }) public elementRef: ElementRef<Radio>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioDirective;
        let nativeElement: Radio;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioModule]
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
            template: '<nimble-radio #radio [disabled]="disabled"></nimble-radio>'
        })
        class TestHostComponent {
            @ViewChild('radio', { read: NimbleRadioDirective }) public directive: NimbleRadioDirective;
            @ViewChild('radio', { read: ElementRef }) public elementRef: ElementRef<Radio>;
            public disabled = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioDirective;
        let nativeElement: Radio;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioModule]
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
            template: '<nimble-radio #radio [attr.disabled]="disabled"></nimble-radio>'
        })
        class TestHostComponent {
            @ViewChild('radio', { read: NimbleRadioDirective }) public directive: NimbleRadioDirective;
            @ViewChild('radio', { read: ElementRef }) public elementRef: ElementRef<Radio>;
            public disabled: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioDirective;
        let nativeElement: Radio;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioModule]
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