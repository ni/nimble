import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { NumberValueOrAttribute } from 'dist/ni/nimble-angular/directives/utilities/template-value-helpers';
import type { BooleanValueOrAttribute } from '../../utilities/template-value-helpers';
import { Tooltip, NimbleTooltipDirective, TooltipSeverity } from '../nimble-tooltip.directive';
import { NimbleTooltipModule } from '../nimble-tooltip.module';

describe('Nimble tooltip', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleTooltipModule]
            });
        });

        it('defines custom element', () => {
            expect(customElements.get('nimble-tooltip')).not.toBeUndefined();
        });
    });

    describe('TooltipStatus', () => {
        it('can use TooltipStatus values', () => {
            // Ensure TooltipStatus is exported correctly so that it can be used
            // as more than a type.
            expect(TooltipSeverity.information).toEqual(TooltipSeverity.information);
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-tooltip #target></nimble-tooltip>
            `
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTooltipDirective;
        let nativeElement: Tooltip;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTooltipModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for anchor', () => {
            expect(directive.anchor).toBe('');
            expect(nativeElement.anchor).toBe('');
        });

        it('has expected defaults for delay', () => {
            expect(directive.delay).toBe(300);
            expect(nativeElement.delay).toBe(300);
        });

        it('has expected defaults for severity', () => {
            expect(directive.severity).toBe(TooltipSeverity.default);
            expect(nativeElement.severity).toBe(TooltipSeverity.default);
        });

        it('has expected defaults for iconVisible', () => {
            expect(directive.iconVisible).toBeFalse();
            expect(nativeElement.iconVisible).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-tooltip #target
                    anchor="anchor"
                    delay="300"
                    severity="information"
                    icon-visible
                >
                </nimble-tooltip>`
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTooltipDirective;
        let nativeElement: Tooltip;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTooltipModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for anchor', () => {
            expect(directive.anchor).toBe('anchor');
            expect(nativeElement.anchor).toBe('anchor');
        });

        it('will use template string values for delay', () => {
            expect(directive.delay).toBe(300);
            expect(nativeElement.delay).toBe(300);
        });

        it('will use template string values for severity', () => {
            expect(directive.severity).toBe(TooltipSeverity.information);
            expect(nativeElement.severity).toBe(TooltipSeverity.information);
        });

        it('will use template string values for iconVisible', () => {
            expect(directive.iconVisible).toBeTrue();
            expect(nativeElement.iconVisible).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-tooltip #target
                    [anchor]="anchor"
                    [delay]="delay"
                    [severity]="severity"
                    [icon-visible]="iconVisible"
                >
                </nimble-tooltip>
            `
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
            public anchor = 'anchor';
            public delay = 300;
            public severity: TooltipSeverity;
            public iconVisible = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTooltipDirective;
        let nativeElement: Tooltip;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTooltipModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for anchor', () => {
            expect(directive.anchor).toBe('anchor');
            expect(nativeElement.anchor).toBe('anchor');

            fixture.componentInstance.anchor = 'anchor2';
            fixture.detectChanges();

            expect(directive.anchor).toBe('anchor2');
            expect(nativeElement.anchor).toBe('anchor2');
        });

        it('can be configured with property binding for delay', () => {
            expect(directive.delay).toBe(300);
            expect(nativeElement.delay).toBe(300);

            fixture.componentInstance.delay = 400;
            fixture.detectChanges();

            expect(directive.delay).toBe(400);
            expect(nativeElement.delay).toBe(400);
        });

        it('can be configured with property binding for severity', () => {
            expect(directive.severity).toBe(TooltipSeverity.default);
            expect(nativeElement.severity).toBe(TooltipSeverity.default);

            fixture.componentInstance.severity = TooltipSeverity.information;
            fixture.detectChanges();

            expect(directive.severity).toBe(TooltipSeverity.information);
            expect(nativeElement.severity).toBe(TooltipSeverity.information);
        });

        it('can be configured with property binding for iconVisible', () => {
            expect(directive.iconVisible).toBeFalse();
            expect(nativeElement.iconVisible).toBeFalse();

            fixture.componentInstance.iconVisible = true;
            fixture.detectChanges();

            expect(directive.iconVisible).toBeTrue();
            expect(nativeElement.iconVisible).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-tooltip #target
                    [attr.anchor]="anchor"
                    [attr.delay]="delay"
                    [attr.severity]="severity"
                    [attr.icon-visible]="iconVisible"
                >
                </nimble-tooltip>
            `
        })
        class TestHostComponent {
            @ViewChild('target', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('target', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
            public anchor = 'anchor';
            public delay: NumberValueOrAttribute = 300;
            public severity: TooltipSeverity;
            public iconVisible: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleTooltipDirective;
        let nativeElement: Tooltip;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleTooltipModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for anchor', () => {
            expect(directive.anchor).toBe('anchor');
            expect(nativeElement.anchor).toBe('anchor');

            fixture.componentInstance.anchor = 'anchor2';
            fixture.detectChanges();

            expect(directive.anchor).toBe('anchor2');
            expect(nativeElement.anchor).toBe('anchor2');
        });

        // Test is disabled because of [FAST bug](https://github.com/microsoft/fast/issues/6257)
        xit('can be configured with attribute binding for delay', () => {
            expect(directive.delay).toBe(300);
            expect(nativeElement.delay).toBe(300);

            fixture.componentInstance.delay = 400;
            fixture.detectChanges();

            expect(directive.delay).toBe(400);
            expect(nativeElement.delay).toBe(400);
        });

        it('can be configured with attribute binding for severity', () => {
            expect(directive.severity).toBe(TooltipSeverity.default);
            expect(nativeElement.severity).toBe(TooltipSeverity.default);

            fixture.componentInstance.severity = TooltipSeverity.information;
            fixture.detectChanges();

            expect(directive.severity).toBe(TooltipSeverity.information);
            expect(nativeElement.severity).toBe(TooltipSeverity.information);
        });

        it('can be configured with attribute binding for iconVisible', () => {
            expect(directive.iconVisible).toBeFalse();
            expect(nativeElement.iconVisible).toBeFalse();

            fixture.componentInstance.iconVisible = '';
            fixture.detectChanges();

            expect(directive.iconVisible).toBeTrue();
            expect(nativeElement.iconVisible).toBeTrue();
        });
    });
});
