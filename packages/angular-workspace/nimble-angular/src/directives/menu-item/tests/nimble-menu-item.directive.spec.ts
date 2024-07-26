import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, ViewChild } from '@angular/core';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { NimbleMenuItemModule } from '../nimble-menu-item.module';
import { MenuItem, NimbleMenuItemDirective } from '../nimble-menu-item.directive';

describe('Nimble menu item', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleMenuItemModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-menu-item')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-menu-item #menuItem></nimble-menu-item>
            `
        })
        class TestHostComponent {
            @ViewChild('menuItem', { read: NimbleMenuItemDirective }) public directive: NimbleMenuItemDirective;
            @ViewChild('menuItem', { read: ElementRef }) public elementRef: ElementRef<MenuItem>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuItemDirective;
        let nativeElement: MenuItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeUndefined();
            expect(nativeElement.disabled).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-menu-item #menuItem
                    disabled
                ></nimble-menu-item>
            `
        })
        class TestHostComponent {
            @ViewChild('menuItem', { read: NimbleMenuItemDirective }) public directive: NimbleMenuItemDirective;
            @ViewChild('menuItem', { read: ElementRef }) public elementRef: ElementRef<MenuItem>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuItemDirective;
        let nativeElement: MenuItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuItemModule]
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
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-menu-item #menuItem
                    [disabled]="disabled"
                ></nimble-menu-item>
            `
        })
        class TestHostComponent {
            @ViewChild('menuItem', { read: NimbleMenuItemDirective }) public directive: NimbleMenuItemDirective;
            @ViewChild('menuItem', { read: ElementRef }) public elementRef: ElementRef<MenuItem>;

            public disabled = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuItemDirective;
        let nativeElement: MenuItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuItemModule]
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

    describe('with property attribute values', () => {
        @Component({
            template: `
                <nimble-menu-item #menuItem
                    [attr.disabled]="disabled">
                </nimble-menu-item>
            `
        })
        class TestHostComponent {
            @ViewChild('menuItem', { read: NimbleMenuItemDirective }) public directive: NimbleMenuItemDirective;
            @ViewChild('menuItem', { read: ElementRef }) public elementRef: ElementRef<MenuItem>;

            public disabled: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleMenuItemDirective;
        let nativeElement: MenuItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleMenuItemModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for disabled', () => {
            expect(directive.disabled).toBeUndefined();
            expect(nativeElement.disabled).toBeUndefined();

            fixture.componentInstance.disabled = '';
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });
    });
});
