import { Component, EventEmitter, Inject, Input, Output, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router} from '@angular/router';
import { DrawerLocation, NimbleDrawerDirective, Theme } from '@ni/nimble-angular';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @Input() public location: DrawerLocation = DrawerLocation.left;
  @ViewChild('drawerReference', { read: NimbleDrawerDirective }) public drawer: NimbleDrawerDirective;

  @Input() public theme: Theme;
  @Output() public themeChange = new EventEmitter();

  public themes = Theme;
  settingsForm: FormGroup;

  public constructor(private fb:FormBuilder, private router: Router ) { }

  ngOnInit(): void {
    this.initializeSettingsForm();
  }

  initializeSettingsForm(): void {
    this.settingsForm = this.fb.group({
      theme: 'Theme'
    })
  }

  public openDrawer(): void {
    this.drawer.show();
  }

  public themeSelectionChange(e: any) :void {
    // public themeSelectionChange(value: Theme): void {
      console.log(e);

    // this.themeChange.emit(e.target.);
  }

  public closeDrawer(): void {
    this.drawer.hide();
  }

  public goToRoute(route: string){
    this.router.navigate([route]);
    this.closeDrawer();
  }
}
