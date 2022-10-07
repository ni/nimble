import { Component, EventEmitter, Inject, Input, Output, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavigationEnd, Router} from '@angular/router';
import { DrawerLocation, NimbleDrawerDirective, Theme } from '@ni/nimble-angular';
import { Subscription } from 'rxjs';
import { tap, filter } from 'rxjs/operators';


@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  @Input() public location: DrawerLocation = DrawerLocation.left;
  @ViewChild('drawerReference', { read: NimbleDrawerDirective }) public drawer: NimbleDrawerDirective;

  @Input() public theme: Theme;
  @Output() public themeChange = new EventEmitter();

  public themes = Theme;
  settingsForm: FormGroup;

  private subscription = new Subscription();

  public constructor(private fb:FormBuilder, private router: Router ) {
    this.subscription.add(router.events.pipe(
      filter(x => x instanceof NavigationEnd && this.drawer.open),
      tap(() => this.closeDrawer())
    ).subscribe());
  }

  ngOnInit(): void {
    this.initializeSettingsForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initializeSettingsForm(): void {
    this.settingsForm = this.fb.group({
      theme: 'Theme'
    })
  }

  public openDrawer(): void {
    this.drawer.show();
  }

  // public themeSelectionChange() :void {
  public themeSelectionChange(value: Theme): void {

    this.themeChange.emit(value);
  }

  public closeDrawer(): void {
    this.drawer.close();
  }
}
