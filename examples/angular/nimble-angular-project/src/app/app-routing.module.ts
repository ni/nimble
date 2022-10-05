import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageTwoComponent } from './page-two/page-two.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'page-two', component:PageTwoComponent},
  { path: 'home', redirectTo: '', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
