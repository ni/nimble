import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Drawer, DrawerLocation, NimbleDrawerDirective } from '../nimble-drawer.directive';
import { NimbleDrawerModule } from '../nimble-drawer.module';

describe('Nimble drawer', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleDrawerModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-drawer')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-drawer #drawer></nimble-drawer>
            `
        })
        class TestHostComponent {
            @ViewChild('drawer', { read: NimbleDrawerDirective }) public directive: NimbleDrawerDirective;
            @ViewChild('drawer', { read: ElementRef }) public elementRef: ElementRef<Drawer>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleDrawerDirective;
        let nativeElement: Drawer;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleDrawerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for location', () => {
            expect(directive.location).toBe(DrawerLocation.right);
            expect(nativeElement.location).toBe(DrawerLocation.right);
        });

        it('has expected defaults for preventDismiss', () => {
            expect(directive.preventDismiss).toBeFalse();
            expect(nativeElement.preventDismiss).toBeFalse();
        });

        it('has expected defaults for ariaLabel', () => {
            expect(directive.ariaLabel).toBeUndefined();
            expect(nativeElement.ariaLabel).toBeUndefined();
        });

        it('has expected defaults for open', () => {
            expect(directive.open).toBeFalse();
            expect(nativeElement.open).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-drawer #drawer
                    location="right"
                    prevent-dismiss
                    aria-label="label">
                </nimble-drawer>`
        })
        class TestHostComponent {
            @ViewChild('drawer', { read: NimbleDrawerDirective }) public directive: NimbleDrawerDirective;
            @ViewChild('drawer', { read: ElementRef }) public elementRef: ElementRef<Drawer>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleDrawerDirective;
        let nativeElement: Drawer;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleDrawerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for location', () => {
            expect(directive.location).toBe(DrawerLocation.right);
            expect(nativeElement.location).toBe(DrawerLocation.right);
        });

        it('will use template string values for preventDismiss', () => {
            expect(directive.preventDismiss).toBeTrue();
            expect(nativeElement.preventDismiss).toBeTrue();
        });

        it('will use template string values for ariaLabel', () => {
            expect(directive.ariaLabel).toBe('label');
            expect(nativeElement.ariaLabel).toBe('label');
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-drawer #drawer
                    [location]="location"
                    [preventDismiss]="preventDismiss"
                    [ariaLabel]="ariaLabel">
                </nimble-drawer>`
        })
        class TestHostComponent {
            @ViewChild('drawer', { read: NimbleDrawerDirective }) public directive: NimbleDrawerDirective;
            @ViewChild('drawer', { read: ElementRef }) public elementRef: ElementRef<Drawer>;
            public location: DrawerLocation = DrawerLocation.right;
            public preventDismiss = false;
            public ariaLabel = 'label';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleDrawerDirective;
        let nativeElement: Drawer;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleDrawerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for location', () => {
            expect(directive.location).toBe(DrawerLocation.right);
            expect(nativeElement.location).toBe(DrawerLocation.right);

            fixture.componentInstance.location = DrawerLocation.left;
            fixture.detectChanges();

            expect(directive.location).toBe(DrawerLocation.left);
            expect(nativeElement.location).toBe(DrawerLocation.left);
        });

        it('can be configured with property binding for preventDismiss', () => {
            expect(directive.preventDismiss).toBeFalse();
            expect(nativeElement.preventDismiss).toBeFalse();

            fixture.componentInstance.preventDismiss = true;
            fixture.detectChanges();

            expect(directive.preventDismiss).toBeTrue();
            expect(nativeElement.preventDismiss).toBeTrue();
        });

        it('can be configured with property binding for ariaLabel', () => {
            expect(directive.ariaLabel).toBe('label');
            expect(nativeElement.ariaLabel).toBe('label');

            fixture.componentInstance.ariaLabel = 'new label';
            fixture.detectChanges();

            expect(directive.ariaLabel).toBe('new label');
            expect(nativeElement.ariaLabel).toBe('new label');
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-drawer #drawer
                    [attr.location]="location"
                    [attr.prevent-dismiss]="preventDismiss"
                    [attr.aria-label]="ariaLabel">
                </nimble-drawer>`
        })
        class TestHostComponent {
            @ViewChild('drawer', { read: NimbleDrawerDirective }) public directive: NimbleDrawerDirective;
            @ViewChild('drawer', { read: ElementRef }) public elementRef: ElementRef<Drawer>;
            public location: DrawerLocation = DrawerLocation.right;
            public preventDismiss = false;
            public ariaLabel = 'label';
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleDrawerDirective;
        let nativeElement: Drawer;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleDrawerModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for location', () => {
            expect(directive.location).toBe(DrawerLocation.right);
            expect(nativeElement.location).toBe(DrawerLocation.right);

            fixture.componentInstance.location = DrawerLocation.left;
            fixture.detectChanges();

            expect(directive.location).toBe(DrawerLocation.left);
            expect(nativeElement.location).toBe(DrawerLocation.left);
        });

        it('can be configured with attribute binding for preventDismiss', () => {
            expect(directive.preventDismiss).toBeFalse();
            expect(nativeElement.preventDismiss).toBeFalse();

            fixture.componentInstance.preventDismiss = true;
            fixture.detectChanges();

            expect(directive.preventDismiss).toBeTrue();
            expect(nativeElement.preventDismiss).toBeTrue();
        });

        it('can be configured with attribute binding for ariaLabel', () => {
            expect(directive.ariaLabel).toBe('label');
            expect(nativeElement.ariaLabel).toBe('label');

            fixture.componentInstance.ariaLabel = 'new label';
            fixture.detectChanges();

            expect(directive.ariaLabel).toBe('new label');
            expect(nativeElement.ariaLabel).toBe('new label');
        });
    });
});
