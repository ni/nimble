import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { processUpdates } from '../../../testing/async-helpers';
import { NimbleBreadcrumbModule } from '../../breadcrumb/nimble-breadcrumb.module';
import { NimbleBreadcrumbItemModule } from '../nimble-breadcrumb-item.module';

describe('Nimble breadcrumb item RouterLinkDirective', () => {
    @Component({
        template: `
            <nimble-breadcrumb>
                <nimble-breadcrumb-item routerLink="page1">
                    Breadcrumb Text
                </nimble-breadcrumb-item>
            </nimble-breadcrumb>
            <router-outlet></router-outlet>
         `
    })
    class TestHostComponent {
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleBreadcrumbModule, NimbleBreadcrumbItemModule,
                CommonModule,
                RouterTestingModule.withRoutes([{ path: '', component: TestHostComponent, pathMatch: 'full' }
                ], { useHash: true })
            ]
        });
    });

    afterEach(() => {
        processUpdates();
    });

    it('throws an error when used, pointing consumers to nimbleRouterLink', () => {
        expect(() => {
            TestBed.createComponent(TestHostComponent);
        }).toThrowError(/nimbleRouterLink/g);
    });
});
