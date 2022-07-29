import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-tooltip #tooltip
                    anchor="anchor">
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
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-tooltip #tooltip
                    [anchor]="anchor">
                </nimble-tooltip>
            `
        })
        class TestHostComponent {
            @ViewChild('tooltip', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('tooltip', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
            public anchor = 'anchor';
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
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-tooltip #tooltip
                    [attr.anchor]="anchor">
                </nimble-tooltip>
            `
        })
        class TestHostComponent {
            @ViewChild('tooltip', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('tooltip', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
            public anchor = 'anchor';
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
    });
});
