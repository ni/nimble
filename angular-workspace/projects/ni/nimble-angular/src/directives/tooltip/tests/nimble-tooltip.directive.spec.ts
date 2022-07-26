import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '../../utilities/template-value-helpers';
import { Tooltip, NimbleTooltipDirective } from '../nimble-tooltip.directive';
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

        it('has expected defaults for visible', () => {
            expect(directive.visible).toBeFalse();
            expect(nativeElement.visible).toBeFalse();
        });

        it('has expected defaults for anchor', () => {
            expect(directive.anchor).toBe('anchor');
            expect(nativeElement.anchor).toBe('anchor');
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
            @ViewChild('button', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('button', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
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

        it('will use template string values for visible', () => {
            expect(directive.visible).toBeTrue();
            expect(nativeElement.visible).toBeTrue();
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
                    [anchor]="anchor"
                </nimble-button>
            `
        })
        class TestHostComponent {
            @ViewChild('button', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('button', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
            public visible: Tooltip['visible'] = true;
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

        it('can be configured with property binding for visible', () => {
            expect(directive.visible).toBeFalse();
            expect(nativeElement.visible).toBeFalse();

            fixture.componentInstance.visible = true;
            fixture.detectChanges();

            expect(directive.visible).toBeTrue();
            expect(nativeElement.visible).toBeTrue();
        });

        it('can be configured with property binding for anchor', () => {
            expect(directive.anchor).toBe('anchor');
            expect(nativeElement.anchor).toBe('anchor');

            fixture.componentInstance.elementRef.nativeElement.anchor = 'anchor';
            fixture.detectChanges();

            expect(directive.anchor).toBe('anchor');
            expect(nativeElement.anchor).toBe('anchor');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-button #button
                    [attr.disabled]="disabled"
                    [attr.appearance]="appearance"
                    [attr.content-hidden]="contentHidden">
                </nimble-button>
            `
        })
        class TestHostComponent {
            @ViewChild('button', { read: NimbleTooltipDirective }) public directive: NimbleTooltipDirective;
            @ViewChild('button', { read: ElementRef }) public elementRef: ElementRef<Tooltip>;
            public visible: BooleanValueOrAttribute = null;
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

        it('can be configured with attribute binding for visible', () => {
            expect(directive.visible).toBeFalse();
            expect(nativeElement.visible).toBeFalse();

            fixture.componentInstance.visible = '';
            fixture.detectChanges();

            expect(directive.visible).toBeTrue();
            expect(nativeElement.visible).toBeTrue();
        });

        it('can be configured with attribute binding for anchor', () => {
            expect(directive.anchor).toBe('anchor');
            expect(nativeElement.anchor).toBe('anchor');

            fixture.componentInstance.elementRef.nativeElement.anchor = 'anchor';
            fixture.detectChanges();

            expect(directive.anchor).toBe('anchor');
            expect(nativeElement.anchor).toBe('anchor');
        });
    });
});
