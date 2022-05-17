import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/menu-button/types';
import type { BooleanValueOrAttribute } from '../../utilities/template-value-helpers';
import { NimbleMenuButtonDirective, MenuButton } from '../nimble-menu-button.directive';
import { NimbleMenuButtonModule } from '../nimble-menu-button.module';

describe('Nimble menu button', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleMenuButtonModule]
            });
        });

        it('defines custom element', () => {
            expect(customElements.get('nimble-menu-button')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-menu-button #menuButton></nimble-menu-button>
            `
        })
        class TestHostComponent {
            @ViewChild('menuButton', { read: NimbleMenuButtonDirective }) public directive: NimbleMenuButtonDirective;
            @ViewChild('menuButton', { read: ElementRef }) public elementRef: ElementRef<MenuButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuButtonDirective;
        let nativeElement: MenuButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuButtonModule]
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

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(ButtonAppearance.Outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.Outline);
        });

        it('has expected defaults for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();
        });

        it('has expected defaults for open', () => {
            expect(directive.open).toBeFalse();
            expect(nativeElement.open).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-menu-button #menuButton
                    disabled
                    appearance="${ButtonAppearance.Ghost}"
                    content-hidden
                    open>
                </nimble-menu-button>`
        })
        class TestHostComponent {
            @ViewChild('menuButton', { read: NimbleMenuButtonDirective }) public directive: NimbleMenuButtonDirective;
            @ViewChild('menuButton', { read: ElementRef }) public elementRef: ElementRef<MenuButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuButtonDirective;
        let nativeElement: MenuButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuButtonModule]
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

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(ButtonAppearance.Ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.Ghost);
        });

        it('will use template string values for contentHidden', () => {
            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });

        it('will use template string values for open', () => {
            expect(directive.open).toBeTrue();
            expect(nativeElement.open).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-menu-button #menuButton
                    [disabled]="disabled"
                    [appearance]="appearance"
                    [content-hidden]="contentHidden"
                    [open]="open">
                </nimble-menu-button>
            `
        })
        class TestHostComponent {
            @ViewChild('menuButton', { read: NimbleMenuButtonDirective }) public directive: NimbleMenuButtonDirective;
            @ViewChild('menuButton', { read: ElementRef }) public elementRef: ElementRef<MenuButton>;
            public disabled = false;
            public appearance = ButtonAppearance.Outline;
            public contentHidden = false;
            public open = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuButtonDirective;
        let nativeElement: MenuButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuButtonModule]
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

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(ButtonAppearance.Outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.Outline);

            fixture.componentInstance.appearance = ButtonAppearance.Ghost;
            fixture.detectChanges();

            expect(directive.appearance).toBe(ButtonAppearance.Ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.Ghost);
        });

        it('can be configured with property binding for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();

            fixture.componentInstance.contentHidden = true;
            fixture.detectChanges();

            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });

        it('can be configured with property binding for open', () => {
            expect(directive.open).toBeFalse();
            expect(nativeElement.open).toBeFalse();

            fixture.componentInstance.open = true;
            fixture.detectChanges();

            expect(directive.open).toBeTrue();
            expect(nativeElement.open).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-menu-button #menuButton
                    [attr.disabled]="disabled"
                    [attr.appearance]="appearance"
                    [attr.content-hidden]="contentHidden"
                    [attr.open]="open">
                </nimble-menu-button>
            `
        })
        class TestHostComponent {
            @ViewChild('menuButton', { read: NimbleMenuButtonDirective }) public directive: NimbleMenuButtonDirective;
            @ViewChild('menuButton', { read: ElementRef }) public elementRef: ElementRef<MenuButton>;
            public disabled: BooleanValueOrAttribute = null;
            public appearance: ButtonAppearance = ButtonAppearance.Outline;
            public contentHidden: BooleanValueOrAttribute = null;
            public open: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuButtonDirective;
        let nativeElement: MenuButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuButtonModule]
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

        it('can be configured with attribute binding for appearance', () => {
            expect(directive.appearance).toBe(ButtonAppearance.Outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.Outline);

            fixture.componentInstance.appearance = ButtonAppearance.Ghost;
            fixture.detectChanges();

            expect(directive.appearance).toBe(ButtonAppearance.Ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.Ghost);
        });

        it('can be configured with attribute binding for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();

            fixture.componentInstance.contentHidden = '';
            fixture.detectChanges();

            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });

        it('can be configured with attribute binding for open', () => {
            expect(directive.open).toBeFalse();
            expect(nativeElement.open).toBeFalse();

            fixture.componentInstance.open = '';
            fixture.detectChanges();

            expect(directive.open).toBeTrue();
            expect(nativeElement.open).toBeTrue();
        });
    });
});
