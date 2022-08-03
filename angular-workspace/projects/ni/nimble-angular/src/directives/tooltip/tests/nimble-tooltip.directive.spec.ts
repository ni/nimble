import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { NumberValueOrAttribute } from 'dist/ni/nimble-angular/directives/utilities/template-value-helpers';
import { Tooltip, NimbleTooltipDirective, TooltipStatus } from '../nimble-tooltip.directive';
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
            expect(TooltipStatus.information).toEqual(TooltipStatus.information);
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-tooltip #tooltip></nimble-tooltip>
            `
        })
        class TestHostComponent {
            @ViewChild('tooltip', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('tooltip', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
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
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-tooltip #tooltip
                    anchor="anchor"
                    delay=300>
                </nimble-tooltip>`
        })
        class TestHostComponent {
            @ViewChild('tooltip', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('tooltip', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
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
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-tooltip #tooltip
                    [anchor]="anchor"
                    [delay]="delay">
                </nimble-tooltip>
            `
        })
        class TestHostComponent {
            @ViewChild('tooltip', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('tooltip', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
            public anchor = 'anchor';
            public delay = 300;
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
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-tooltip #tooltip
                    [attr.anchor]="anchor"
                    [attr.delay]="delay">
                </nimble-tooltip>
            `
        })
        class TestHostComponent {
            @ViewChild('tooltip', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('tooltip', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
            public anchor = 'anchor';
            public delay: NumberValueOrAttribute = 300;
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
    });
});
