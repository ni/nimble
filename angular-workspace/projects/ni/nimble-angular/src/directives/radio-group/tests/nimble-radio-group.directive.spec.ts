import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Orientation } from '@ni/nimble-components/dist/esm/radio-group';
import type { BooleanValueOrAttribute } from '../../utilities/template-value-helpers';
import { NimbleRadioGroupDirective, RadioGroup } from '../nimble-radio-group.directive';
import { NimbleRadioGroupModule } from '../nimble-radio-group.module';

describe('Nimble radio group', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleRadioGroupModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-radio-group')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-radio-group #radioGroup></nimble-radio-group>
            `
        })
        class TestHostComponent {
            @ViewChild('radioGroup', { read: NimbleRadioGroupDirective }) public directive: NimbleRadioGroupDirective;
            @ViewChild('radioGroup', { read: ElementRef }) public elementRef: ElementRef<RadioGroup>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioGroupDirective;
        let nativeElement: RadioGroup;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioGroupModule]
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

        it('has expected defaults for orientation', () => {
            expect(directive.orientation).toBe(Orientation.horizontal);
            expect(nativeElement.orientation).toBe(Orientation.horizontal);
        });

        it('can use the directive to set orientation', () => {
            directive.orientation = Orientation.vertical;
            expect(nativeElement.orientation).toBe(Orientation.vertical);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: '<nimble-radio-group #radioGroup disabled orientation="vertical"></nimble-radio-group>'
        })
        class TestHostComponent {
            @ViewChild('radioGroup', { read: NimbleRadioGroupDirective }) public directive: NimbleRadioGroupDirective;
            @ViewChild('radioGroup', { read: ElementRef }) public elementRef: ElementRef<RadioGroup>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioGroupDirective;
        let nativeElement: RadioGroup;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioGroupModule]
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

        it('will use template values for orientation', () => {
            expect(directive.orientation).toBe(Orientation.vertical);
            expect(nativeElement.orientation).toBe(Orientation.vertical);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: '<nimble-radio-group #radioGroup [disabled]="disabled" [orientation]="orientation"></nimble-radio-group>'
        })
        class TestHostComponent {
            @ViewChild('radioGroup', { read: NimbleRadioGroupDirective }) public directive: NimbleRadioGroupDirective;
            @ViewChild('radioGroup', { read: ElementRef }) public elementRef: ElementRef<RadioGroup>;
            public disabled = false;
            public orientation: Orientation = Orientation.vertical;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioGroupDirective;
        let nativeElement: RadioGroup;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioGroupModule]
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

        it('can be configured with property binding for orientation', () => {
            expect(directive.orientation).toBe(Orientation.vertical);
            expect(nativeElement.orientation).toBe(Orientation.vertical);

            fixture.componentInstance.orientation = Orientation.horizontal;
            fixture.detectChanges();

            expect(directive.orientation).toBe(Orientation.horizontal);
            expect(nativeElement.orientation).toBe(Orientation.horizontal);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: '<nimble-radio-group #radioGroup [attr.disabled]="disabled" [attr.orientation]="orientation"></nimble-radio-group>'
        })
        class TestHostComponent {
            @ViewChild('radioGroup', { read: NimbleRadioGroupDirective }) public directive: NimbleRadioGroupDirective;
            @ViewChild('radioGroup', { read: ElementRef }) public elementRef: ElementRef<RadioGroup>;
            public disabled: BooleanValueOrAttribute = null;
            public orientation: Orientation = Orientation.vertical;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleRadioGroupDirective;
        let nativeElement: RadioGroup;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleRadioGroupModule]
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

        it('can be configured with attribute binding for orientation', () => {
            expect(directive.orientation).toBe(Orientation.vertical);
            expect(nativeElement.orientation).toBe(Orientation.vertical);

            fixture.componentInstance.orientation = Orientation.horizontal;
            fixture.detectChanges();

            expect(directive.orientation).toBe(Orientation.horizontal);
            expect(nativeElement.orientation).toBe(Orientation.horizontal);
        });
    });
});