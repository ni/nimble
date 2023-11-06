/**
 * [Nimble]
 * Copied from https://github.com/angular/angular/blob/035aee01089b9f9d4b5b6af66a74002e07723fba/packages/router/test/router_link_spec.ts
 * with the following modifications:
 * - replace import of Angular's RouterLink with our forked version
 * - define TestRouterLinkDirective to use in tests, and add it to declarations of testing modules
 * - replace references to RouterLink with TestRouterLinkDirective in two tests
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, Directive} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterLink} from '../router_link';

describe('RouterLink', () => {
  // [Nimble] Defining test directive to use instead of RouterLink
  @Directive({ selector: '[routerLink]' })
  class TestRouterLinkDirective extends RouterLink {}

  it('does not modify tabindex if already set on non-anchor element', () => {
    @Component({template: `<div [routerLink]="link" tabindex="1"></div>`})
    class LinkComponent {
      link: string|null|undefined = '/';
    }
    // [Nimble] Declare TestRouterLinkDirective
    TestBed.configureTestingModule({imports: [RouterTestingModule], declarations: [LinkComponent, TestRouterLinkDirective]});
    const fixture = TestBed.createComponent(LinkComponent);
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(link.tabIndex).toEqual(1);

    fixture.nativeElement.link = null;
    fixture.detectChanges();
    expect(link.tabIndex).toEqual(1);
  });

  describe('on a non-anchor', () => {
    @Component({template: `<div [routerLink]="link"></div>`})
    class LinkComponent {
      link: string|null|undefined = '/';
    }
    let fixture: ComponentFixture<LinkComponent>;
    let link: HTMLDivElement;
    let router: Router;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        // [Nimble] Declare TestRouterLinkDirective
        declarations: [LinkComponent, TestRouterLinkDirective]
      });
      fixture = TestBed.createComponent(LinkComponent);
      fixture.detectChanges();
      link = fixture.debugElement.query(By.css('div')).nativeElement;
      router = TestBed.inject(Router);

      spyOn(router, 'navigateByUrl');
      link.click();
      expect(router.navigateByUrl).toHaveBeenCalled();
      (router.navigateByUrl as jasmine.Spy).calls.reset();
    });

    it('null, removes tabIndex and does not navigate', () => {
      fixture.componentInstance.link = null;
      fixture.detectChanges();
      expect(link.tabIndex).toEqual(-1);

      link.click();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('undefined, removes tabIndex and does not navigate', () => {
      fixture.componentInstance.link = undefined;
      fixture.detectChanges();
      expect(link.tabIndex).toEqual(-1);

      link.click();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should coerce boolean input values', () => {
      // [Nimble] Use directive TestRouterLinkDirective instead of RouterLink
      const dir = fixture.debugElement.query(By.directive(TestRouterLinkDirective)).injector.get(TestRouterLinkDirective);

      for (const truthy of [true, '', 'true', 'anything']) {
        dir.preserveFragment = truthy;
        dir.skipLocationChange = truthy;
        dir.replaceUrl = truthy;
        expect(dir.preserveFragment).toBeTrue();
        expect(dir.skipLocationChange).toBeTrue();
        expect(dir.replaceUrl).toBeTrue();
      }

      for (const falsy of [false, null, undefined, 'false']) {
        dir.preserveFragment = falsy;
        dir.skipLocationChange = falsy;
        dir.replaceUrl = falsy;
        expect(dir.preserveFragment).toBeFalse();
        expect(dir.skipLocationChange).toBeFalse();
        expect(dir.replaceUrl).toBeFalse();
      }
    });
  });

  describe('on an anchor', () => {
    describe('RouterLink for elements with `href` attributes', () => {
      @Component({template: `<a [routerLink]="link"></a>`})
      class LinkComponent {
        link: string|null|undefined = '/';
      }
      let fixture: ComponentFixture<LinkComponent>;
      let link: HTMLAnchorElement;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [RouterTestingModule],
          // [Nimble] Declare TestRouterLinkDirective
          declarations: [LinkComponent, TestRouterLinkDirective]
        });
        fixture = TestBed.createComponent(LinkComponent);
        fixture.detectChanges();
        link = fixture.debugElement.query(By.css('a')).nativeElement;
      });

      it('null, removes href', () => {
        expect(link.outerHTML).toContain('href');
        fixture.componentInstance.link = null;
        fixture.detectChanges();
        expect(link.outerHTML).not.toContain('href');
      });

      it('undefined, removes href', () => {
        expect(link.outerHTML).toContain('href');
        fixture.componentInstance.link = undefined;
        fixture.detectChanges();
        expect(link.outerHTML).not.toContain('href');
      });

      it('should coerce boolean input values', () => {
        // [Nimble] Use directive TestRouterLinkDirective instead of RouterLink
        const dir = fixture.debugElement.query(By.directive(TestRouterLinkDirective)).injector.get(TestRouterLinkDirective);

        for (const truthy of [true, '', 'true', 'anything']) {
          dir.preserveFragment = truthy;
          dir.skipLocationChange = truthy;
          dir.replaceUrl = truthy;
          expect(dir.preserveFragment).toBeTrue();
          expect(dir.skipLocationChange).toBeTrue();
          expect(dir.replaceUrl).toBeTrue();
        }

        for (const falsy of [false, null, undefined, 'false']) {
          dir.preserveFragment = falsy;
          dir.skipLocationChange = falsy;
          dir.replaceUrl = falsy;
          expect(dir.preserveFragment).toBeFalse();
          expect(dir.skipLocationChange).toBeFalse();
          expect(dir.replaceUrl).toBeFalse();
        }
      });
    });

    it('should handle routerLink in svg templates', () => {
      @Component({template: `<svg><a routerLink="test"></a></svg>`})
      class LinkComponent {
      }

      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        // [Nimble] Declare TestRouterLinkDirective
        declarations: [LinkComponent, TestRouterLinkDirective]
      });
      const fixture = TestBed.createComponent(LinkComponent);
      fixture.detectChanges();
      const link = fixture.debugElement.query(By.css('a')).nativeElement;

      expect(link.outerHTML).toContain('href');
    });
  });
});