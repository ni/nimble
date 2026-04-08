/**
 * [Nimble]
 * Copied from https://github.com/angular/angular/blob/20.3.15/packages/router/test/router_link_spec.ts
 * with the following modifications:
 * - replace import of Angular's RouterLink with our forked version
 * - define TestRouterLinkDirective to use in tests, and add it to declarations of testing modules
 * - replace references to RouterLink with TestRouterLinkDirective in two tests
 * - disable Zoneless change detection for these tests (use fixture.detectChanges() instead of await fixture.whenStable())
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {Component, inject, signal, provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Router, RouterLink, RouterModule, provideRouter} from '@angular/router';
import {Directive} from '@angular/core';

describe('RouterLink', () => {
  // [Nimble] Defining test directive to use instead of RouterLink
  @Directive({ selector: '[routerLink]', standalone: false })
  class TestRouterLinkDirective extends RouterLink {}

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideZonelessChangeDetection()]});
  });

  it('does not modify tabindex if already set on non-anchor element', async () => {
    @Component({
      template: `<div [routerLink]="link" tabindex="1"></div>`,
      standalone: false,
    })
    class LinkComponent {
      link: string | null | undefined = '/';
    }
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [LinkComponent],
    });
    const fixture = TestBed.createComponent(LinkComponent);
    await fixture.whenStable();
    const link = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(link.tabIndex).toEqual(1);

    fixture.nativeElement.link = null;
    await fixture.whenStable();
    expect(link.tabIndex).toEqual(1);
  });

  describe('on a non-anchor', () => {
    @Component({
      template: `
        <div
          [routerLink]="link()"
          [preserveFragment]="preserveFragment()"
          [skipLocationChange]="skipLocationChange()"
          [replaceUrl]="replaceUrl()"></div>
      `,
      standalone: false,
    })
    class LinkComponent {
      link = signal<string | null | undefined>('/');
      preserveFragment = signal<unknown>(undefined);
      skipLocationChange = signal<unknown>(undefined);
      replaceUrl = signal<unknown>(undefined);
    }
    let fixture: ComponentFixture<LinkComponent>;
    let link: HTMLDivElement;
    let router: Router;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [RouterModule.forRoot([])],
        declarations: [LinkComponent],
      });
      fixture = TestBed.createComponent(LinkComponent);
      await fixture.whenStable();
      link = fixture.debugElement.query(By.css('div')).nativeElement;
      router = TestBed.inject(Router);

      spyOn(router, 'navigateByUrl');
      link.click();
      expect(router.navigateByUrl).toHaveBeenCalled();
      (router.navigateByUrl as jasmine.Spy).calls.reset();
    });

    it('null, removes tabIndex and does not navigate', async () => {
      fixture.componentInstance.link.set(null);
      await fixture.whenStable();
      expect(link.tabIndex).toEqual(-1);

      link.click();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('undefined, removes tabIndex and does not navigate', async () => {
      fixture.componentInstance.link.set(undefined);
      await fixture.whenStable();
      expect(link.tabIndex).toEqual(-1);

      link.click();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should coerce boolean input values', async () => {
      const dir = fixture.debugElement.query(By.directive(RouterLink)).injector.get(RouterLink);

      for (const truthy of [true, '', 'true', 'anything']) {
        fixture.componentInstance.preserveFragment.set(truthy);
        fixture.componentInstance.skipLocationChange.set(truthy);
        fixture.componentInstance.replaceUrl.set(truthy);
        await fixture.whenStable();
        expect(dir.preserveFragment).toBeTrue();
        expect(dir.skipLocationChange).toBeTrue();
        expect(dir.replaceUrl).toBeTrue();
      }

      for (const falsy of [false, null, undefined, 'false']) {
        fixture.componentInstance.preserveFragment.set(falsy);
        fixture.componentInstance.skipLocationChange.set(falsy);
        fixture.componentInstance.replaceUrl.set(falsy);
        await fixture.whenStable();
        expect(dir.preserveFragment).toBeFalse();
        expect(dir.skipLocationChange).toBeFalse();
        expect(dir.replaceUrl).toBeFalse();
      }
    });
  });

  describe('on an anchor', () => {
    describe('RouterLink for elements with `href` attributes', () => {
      @Component({
        template: `
          <a
            [routerLink]="link()"
            [preserveFragment]="preserveFragment()"
            [skipLocationChange]="skipLocationChange()"
            [replaceUrl]="replaceUrl()"></a>
        `,
        standalone: false,
      })
      class LinkComponent {
        link = signal<string | null | undefined>('/');
        preserveFragment = signal<unknown>(undefined);
        skipLocationChange = signal<unknown>(undefined);
        replaceUrl = signal<unknown>(undefined);
      }
      let fixture: ComponentFixture<LinkComponent>;
      let link: HTMLAnchorElement;

      beforeEach(async () => {
        TestBed.configureTestingModule({
          imports: [RouterModule.forRoot([])],
          declarations: [LinkComponent],
        });
        fixture = TestBed.createComponent(LinkComponent);
        await fixture.whenStable();
        link = fixture.debugElement.query(By.css('a')).nativeElement;
      });

      it('null, removes href', async () => {
        expect(link.outerHTML).toContain('href');
        fixture.componentInstance.link.set(null);
        await fixture.whenStable();
        expect(link.outerHTML).not.toContain('href');
      });

      it('undefined, removes href', async () => {
        expect(link.outerHTML).toContain('href');
        fixture.componentInstance.link.set(undefined);
        await fixture.whenStable();
        expect(link.outerHTML).not.toContain('href');
      });

      it('should coerce boolean input values', async () => {
        const dir = fixture.debugElement.query(By.directive(RouterLink)).injector.get(RouterLink);

        for (const truthy of [true, '', 'true', 'anything']) {
          fixture.componentInstance.preserveFragment.set(truthy);
          fixture.componentInstance.skipLocationChange.set(truthy);
          fixture.componentInstance.replaceUrl.set(truthy);
          await fixture.whenStable();
          expect(dir.preserveFragment).toBeTrue();
          expect(dir.skipLocationChange).toBeTrue();
          expect(dir.replaceUrl).toBeTrue();
        }

        for (const falsy of [false, null, undefined, 'false']) {
          fixture.componentInstance.preserveFragment.set(falsy);
          fixture.componentInstance.skipLocationChange.set(falsy);
          fixture.componentInstance.replaceUrl.set(falsy);
          await fixture.whenStable();
          expect(dir.preserveFragment).toBeFalse();
          expect(dir.skipLocationChange).toBeFalse();
          expect(dir.replaceUrl).toBeFalse();
        }
      });
    });

    it('should handle routerLink in svg templates', async () => {
      @Component({
        template: `<svg><a routerLink="test"></a></svg>`,
        standalone: false,
      })
      class LinkComponent {}

      TestBed.configureTestingModule({
        imports: [RouterModule.forRoot([])],
        declarations: [LinkComponent],
      });
      const fixture = TestBed.createComponent(LinkComponent);
      await fixture.whenStable();
      const link = fixture.debugElement.query(By.css('a')).nativeElement;

      expect(link.outerHTML).toContain('href');
    });
  });

  // Avoid executing in node environment because customElements is not defined.
  if (typeof customElements === 'object') {
    describe('on a custom element anchor', () => {
      /** Simple anchor element imitation. */
      class CustomAnchor extends HTMLElement {
        static get observedAttributes(): string[] {
          return ['href'];
        }

        get href(): string {
          return this.getAttribute('href') ?? '';
        }
        set href(value: string) {
          this.setAttribute('href', value);
        }

        constructor() {
          super();
          const shadow = this.attachShadow({mode: 'open'});
          shadow.innerHTML = '<a><slot></slot></a>';
        }

        attributedChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
          if (name === 'href') {
            const anchor = this.shadowRoot!.querySelector('a')!;
            if (newValue === null) {
              anchor.removeAttribute('href');
            } else {
              anchor.setAttribute('href', newValue);
            }
          }
        }
      }

      if (!customElements.get('custom-anchor')) {
        customElements.define('custom-anchor', CustomAnchor);
      }

      @Component({
        template: `
          <custom-anchor [routerLink]="link()"></custom-anchor>
        `,
        standalone: false,
      })
      class LinkComponent {
        link = signal<string | null | undefined>('/');
      }
      let fixture: ComponentFixture<LinkComponent>;
      let link: HTMLAnchorElement;

      beforeEach(async () => {
        TestBed.configureTestingModule({
          imports: [RouterModule.forRoot([])],
          declarations: [LinkComponent],
        });
        fixture = TestBed.createComponent(LinkComponent);
        await fixture.whenStable();
        link = fixture.debugElement.query(By.css('custom-anchor')).nativeElement;
      });

      it('does not touch tabindex', async () => {
        expect(link.outerHTML).not.toContain('tabindex');
      });

      it('null, removes href', async () => {
        expect(link.outerHTML).toContain('href');
        fixture.componentInstance.link.set(null);
        await fixture.whenStable();
        expect(link.outerHTML).not.toContain('href');
      });

      it('undefined, removes href', async () => {
        expect(link.outerHTML).toContain('href');
        fixture.componentInstance.link.set(undefined);
        await fixture.whenStable();
        expect(link.outerHTML).not.toContain('href');
      });
    });
  }

  it('can use a UrlTree as the input', async () => {
    @Component({
      template: '<a [routerLink]="urlTree">link</a>',
      imports: [RouterLink],
    })
    class WithUrlTree {
      urlTree = inject(Router).createUrlTree(['/a/b/c']);
    }
    TestBed.configureTestingModule({providers: [provideRouter([])]});

    const fixture = TestBed.createComponent(WithUrlTree);
    await fixture.whenStable();
    expect(fixture.nativeElement.innerHTML).toContain('href="/a/b/c"');
  });

  it('cannot use a UrlTree with queryParams', () => {
    @Component({
      template: '<a [routerLink]="urlTree" [queryParams]="{}">link</a>',
      imports: [RouterLink],
    })
    class WithUrlTree {
      urlTree = inject(Router).createUrlTree(['/a/b/c']);
    }
    TestBed.configureTestingModule({providers: [provideRouter([])]});

    const fixture = TestBed.createComponent(WithUrlTree);
    expect(() => fixture.changeDetectorRef.detectChanges()).toThrow();
  });
});