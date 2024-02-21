import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { NimbleSwitchDirective } from '../nimble-switch.directive';
import { NimbleSwitchModule } from '../nimble-switch.module';
import type { Switch } from '../nimble-switch.directive';

describe('Nimble switch', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleSwitchModule]
            });
        });

        it('defines custom element', () => {
            expect(customElements.get('nimble-switch')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-switch #switch></nimble-switch>
            `
        })
        class TestHostComponent {
            @ViewChild('switch', { read: NimbleSwitchDirective }) public directive: NimbleSwitchDirective;
            @ViewChild('switch', { read: ElementRef }) public elementRef: ElementRef<Switch>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSwitchDirective;
        let nativeElement: Switch;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSwitchModule]
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
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-switch #switch
                    disabled
                    checked>
                </nimble-switch>`
        })
        class TestHostComponent {
            @ViewChild('switch', { read: NimbleSwitchDirective }) public directive: NimbleSwitchDirective;
            @ViewChild('switch', { read: ElementRef }) public elementRef: ElementRef<Switch>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSwitchDirective;
        let nativeElement: Switch;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSwitchModule]
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
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-switch #switch
                    [disabled]="disabled"
                    [checked]="checked">
                </nimble-switch>
            `
        })
        class TestHostComponent {
            @ViewChild('switch', { read: NimbleSwitchDirective }) public directive: NimbleSwitchDirective;
            @ViewChild('switch', { read: ElementRef }) public elementRef: ElementRef<Switch>;
            public disabled = false;
            public checked = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSwitchDirective;
        let nativeElement: Switch;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSwitchModule]
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
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-switch #switch
                    [attr.disabled]="disabled"
                    [attr.checked]="checked">
                </nimble-switch>
            `
        })
        class TestHostComponent {
            @ViewChild('switch', { read: NimbleSwitchDirective }) public directive: NimbleSwitchDirective;
            @ViewChild('switch', { read: ElementRef }) public elementRef: ElementRef<Switch>;
            public disabled: BooleanValueOrAttribute = null;
            public checked: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSwitchDirective;
        let nativeElement: Switch;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSwitchModule]
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
    });
});
